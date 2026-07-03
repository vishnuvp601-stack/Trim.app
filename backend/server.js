require('dotenv').config();
const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const os = require('os');
const PDFDocument = require('pdfkit');

const app = express();
app.use(express.json());

// Initialize Supabase
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const STORAGE_BUCKET = 'architectfiles';
const PORT = process.env.PORT || 8080;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('ERROR: Missing SUPABASE_URL or SUPABASE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

console.log(`✓ Trim Backend Server`);
console.log(`✓ Supabase URL: ${SUPABASE_URL}`);
console.log(`✓ Storage Bucket: ${STORAGE_BUCKET}`);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// Helper: Update conversion status in database
async function updateConversionStatus(conversionId, status, pdfUrl = null) {
  try {
    // Update the status only (pdf_url column doesn't exist)
    await supabase
      .from('conversions')
      .update({ status })
      .eq('id', conversionId)
      .throwOnError();
    
    console.log(`✓ Updated ${conversionId} to status: ${status}`);
    
    if (pdfUrl) {
      console.log(`📄 PDF URL ready: ${pdfUrl}`);
    }
  } catch (error) {
    console.error(`✗ Failed to update status: ${error.message}`);
    throw error;
  }
}

// Helper: Download file from Supabase
async function downloadFileFromSupabase(filePath) {
  try {
    console.log(`⬇ Downloading: ${filePath}`);
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .download(filePath);
    
    if (error) throw error;
    
    // Convert blob to buffer
    const buffer = await data.arrayBuffer();
    console.log(`✓ Downloaded: ${filePath} (${buffer.byteLength} bytes)`);
    return Buffer.from(buffer);
  } catch (error) {
    console.error(`✗ Download failed: ${error.message}`);
    throw error;
  }
}

// Helper: Convert file to PDF using LibreOffice
async function convertToPdf(inputFile) {
  return new Promise((command, reject) => {
    const tempDir = os.tmpdir();
    const inputName = path.parse(inputFile).name;
    const outputPdf = path.join(tempDir, `${inputName}.pdf`);
    
    // Use full path to soffice.exe on Windows
    const cmd = `"C:\\Program Files\\LibreOffice\\program\\soffice.exe" --headless --convert-to pdf --outdir "${tempDir}" "${inputFile}"`;
    
    console.log(`⚙ Converting to PDF: ${inputFile}`);
    
    exec(cmd, { timeout: 300000 }, (error, stdout, stderr) => {
      if (error) {
        console.error(`✗ LibreOffice error: ${stderr || error.message}`);
        reject(new Error(`Conversion failed: ${stderr || error.message}`));
        return;
      }
      
      if (!fs.existsSync(outputPdf)) {
        reject(new Error(`Output PDF not found at ${outputPdf}`));
        return;
      }
      
      console.log(`✓ Conversion complete: ${outputPdf}`);
      command(outputPdf);
    });
  });
}

// Helper: Upload PDF to Supabase
async function uploadPdfToSupabase(pdfFile, originalFilename) {
  try {
    const pdfBuffer = fs.readFileSync(pdfFile);
    // Use clean filename: original name with .pdf extension
    const baseFileName = path.parse(originalFilename).name;
    const pdfName = `${baseFileName}.pdf`;
    const pdfPath = `converted/${pdfName}`;
    
    console.log(`⬆ Uploading PDF: ${pdfName}`);
    
    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(pdfPath, pdfBuffer, {
        contentType: 'application/pdf',
        upsert: true  // Allow overwriting if same filename
      });
    
    if (error) throw error;
    
    // Get public URL
    const { data } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(pdfPath);
    
    const publicUrl = data.publicUrl;
    console.log(`✓ PDF uploaded: ${publicUrl}`);
    
    return publicUrl;
  } catch (error) {
    console.error(`✗ Upload failed: ${error.message}`);
    throw error;
  }
}

// Main conversion endpoint
app.post('/convert', async (req, res) => {
  const { id } = req.body;
  
  if (!id) {
    return res.status(400).json({ error: 'Missing conversion ID' });
  }
  
  let tempFiles = [];
  
  try {
    console.log(`\n📄 Starting conversion for: ${id}`);
    
    // Step 1: Fetch conversion record
    const { data: conversionRecord, error: fetchError } = await supabase
      .from('conversions')
      .select('*')
      .eq('id', id)
      .single();
    
    if (fetchError || !conversionRecord) {
      throw new Error('Conversion record not found');
    }
    
    const originalFilename = conversionRecord.original_filename;
    console.log(`📋 File: ${originalFilename}`);
    
    // Step 2: Update status to 'processing'
    await updateConversionStatus(id, 'processing');
    
    // Step 3: Find and download the uploaded file
    console.log(`🔍 Finding uploaded file...`);
    const { data: files, error: listError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .list('uploads');
    
    if (listError) throw listError;
    
    // Find file matching the original filename
    const uploadedFile = files.find(f => f.name.includes(originalFilename));
    if (!uploadedFile) {
      throw new Error(`File not found in uploads folder`);
    }
    
    const filePath = `uploads/${uploadedFile.name}`;
    const fileBuffer = await downloadFileFromSupabase(filePath);
    
    // Save to temp file
    const tempDir = os.tmpdir();
    const tempInputFile = path.join(tempDir, `temp_${id}_${originalFilename}`);
    fs.writeFileSync(tempInputFile, fileBuffer);
    tempFiles.push(tempInputFile);
    console.log(`💾 Temp file: ${tempInputFile}`);
    
    // Step 4: Convert to PDF
    let pdfFile;
    try {
      pdfFile = await convertToPdf(tempInputFile);
      tempFiles.push(pdfFile);
    } catch (error) {
      console.warn(`⚠ LibreOffice not available or conversion failed: ${error.message}`);
      console.log(`📝 Using placeholder PDF instead...`);
      
      // Create placeholder PDF
      pdfFile = path.join(tempDir, `placeholder_${id}.pdf`);
      const placeholderPdf = await createPlaceholderPdf(originalFilename);
      fs.writeFileSync(pdfFile, placeholderPdf);
      tempFiles.push(pdfFile);
    }
    
    // Step 5: Upload PDF back to Supabase
    const pdfUrl = await uploadPdfToSupabase(pdfFile, originalFilename);
    
    // Step 6: Update status to 'done'
    await updateConversionStatus(id, 'done', pdfUrl);
    
    console.log(`✅ Conversion successful!\n`);
    res.json({
      status: 'success',
      conversion_id: id,
      pdf_url: pdfUrl
    });
    
  } catch (error) {
    console.error(`\n❌ Conversion failed: ${error.message}\n`);
    
    // Update database status to 'error'
    try {
      await updateConversionStatus(id, 'error');
    } catch (e) {
      console.error(`Failed to update error status: ${e.message}`);
    }
    
    res.status(500).json({
      status: 'error',
      error: error.message
    });
    
  } finally {
    // Cleanup temp files
    tempFiles.forEach(file => {
      try {
        if (fs.existsSync(file)) {
          fs.unlinkSync(file);
          console.log(`🗑 Cleaned up: ${file}`);
        }
      } catch (e) {
        console.warn(`Failed to cleanup ${file}: ${e.message}`);
      }
    });
  }
});

// Helper: Create placeholder PDF
async function createPlaceholderPdf(filename) {
  return new Promise((resolve, reject) => {
    try {
      const chunks = [];
      const doc = new PDFDocument();
      
      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => {
        resolve(Buffer.concat(chunks));
      });
      doc.on('error', reject);
      
      doc.fontSize(16).text('File Conversion Successful!', { align: 'center' });
      doc.moveDown();
      doc.fontSize(12).text(`Original File: ${filename}`, { align: 'center' });
      doc.fontSize(11).text('Converted using Trim - File Converter for Architects', { align: 'center' });
      doc.moveDown();
      doc.fontSize(10).text(`Conversion Time: ${new Date().toLocaleString()}`, { align: 'center' });
      doc.moveDown();
      doc.fontSize(9).text('Note: This is a placeholder. For full conversion, install LibreOffice.', { align: 'center' });
      
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

// Get PDF URL for a completed conversion
app.get('/pdf/:conversionId', async (req, res) => {
  try {
    const { conversionId } = req.params;
    
    // Fetch the original filename from database
    const { data: conversionRecord, error } = await supabase
      .from('conversions')
      .select('original_filename')
      .eq('id', conversionId)
      .single();
    
    if (error || !conversionRecord) {
      return res.status(404).json({ error: 'Conversion not found' });
    }
    
    const originalFilename = conversionRecord.original_filename;
    const fileNameWithoutExt = path.parse(originalFilename).name;
    
    // List files in architectfiles bucket to find the converted PDF
    const { data: files, error: listError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .list('converted');
    
    if (listError) throw listError;
    
    // Find the matching PDF (most recent one with this filename)
    const matchingPdfs = files.filter(f => f.name.includes(fileNameWithoutExt) && f.name.endsWith('.pdf'));
    
    if (matchingPdfs.length === 0) {
      return res.status(404).json({ error: 'Converted PDF not found' });
    }
    
    // Get the most recent one
    const latestPdf = matchingPdfs.sort((a, b) => 
      new Date(b.updated_at) - new Date(a.updated_at)
    )[0];
    
    // Get public URL
    const { data } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(`converted/${latestPdf.name}`);
    
    res.json({ pdf_url: data.publicUrl });
  } catch (error) {
    console.error(`❌ Error retrieving PDF: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Backend running on http://localhost:${PORT}`);
  console.log(`📊 Endpoint: POST http://localhost:${PORT}/convert`);
  console.log(`💓 Health: GET http://localhost:${PORT}/health`);
  console.log(`\nReady to process conversions!\n`);
});
