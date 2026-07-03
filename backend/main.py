import os
import subprocess
import tempfile
import logging
from pathlib import Path
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from supabase import create_client, Client
import uuid

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(title="Trim File Conversion Worker", version="1.0.0")

# Initialize Supabase client
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
STORAGE_BUCKET = "architectfiles"

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("Missing SUPABASE_URL or SUPABASE_KEY environment variables")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Request model
class ConversionRequest(BaseModel):
    id: str


def update_conversion_status(conversion_id: str, status: str, pdf_url: str = None):
    """Update the conversion record in the database."""
    try:
        data = {"status": status}
        if pdf_url:
            data["pdf_url"] = pdf_url
        
        result = supabase.table("conversions").update(data).eq("id", conversion_id).execute()
        logger.info(f"Updated conversion {conversion_id} to status: {status}")
        return result
    except Exception as e:
        logger.error(f"Failed to update conversion status: {str(e)}")
        raise


def download_file(conversion_id: str, original_filename: str) -> str:
    """Download the file from Supabase Storage."""
    try:
        # Get all files in uploads folder to find the one for this conversion
        # Since we don't have a direct mapping, we'll download by looking for the file
        temp_dir = tempfile.gettempdir()
        temp_file = os.path.join(temp_dir, f"temp_{conversion_id}_{original_filename}")
        
        # List files in uploads folder
        response = supabase.storage.from_bucket(STORAGE_BUCKET).list("uploads")
        
        # Find the file (assuming it contains the original filename or is recent)
        file_to_download = None
        for file in response:
            if original_filename in file.get("name", ""):
                file_to_download = file.get("name")
                break
        
        if not file_to_download:
            # If not found by name, take the most recent file
            if response:
                file_to_download = response[-1].get("name")
            else:
                raise Exception("No files found in uploads folder")
        
        # Download the file
        file_bytes = supabase.storage.from_bucket(STORAGE_BUCKET).download(f"uploads/{file_to_download}")
        
        with open(temp_file, "wb") as f:
            f.write(file_bytes)
        
        logger.info(f"Downloaded file from uploads/{file_to_download} to {temp_file}")
        return temp_file
    except Exception as e:
        logger.error(f"Failed to download file: {str(e)}")
        raise


def convert_to_pdf(input_file: str) -> str:
    """Convert the file to PDF using LibreOffice headless mode."""
    try:
        temp_dir = tempfile.gettempdir()
        
        # LibreOffice command for headless conversion
        cmd = [
            "libreoffice",
            "--headless",
            "--convert-to", "pdf",
            "--outdir", temp_dir,
            input_file
        ]
        
        logger.info(f"Running LibreOffice conversion: {' '.join(cmd)}")
        
        # Run the conversion with timeout
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=300)
        
        if result.returncode != 0:
            logger.error(f"LibreOffice conversion failed: {result.stderr}")
            raise Exception(f"Conversion failed: {result.stderr}")
        
        # Determine the output PDF path
        input_name = Path(input_file).stem
        output_pdf = os.path.join(temp_dir, f"{input_name}.pdf")
        
        if not os.path.exists(output_pdf):
            raise Exception(f"Output PDF not found at {output_pdf}")
        
        logger.info(f"Successfully converted to PDF: {output_pdf}")
        return output_pdf
    except subprocess.TimeoutExpired:
        logger.error("LibreOffice conversion timed out")
        raise Exception("Conversion timed out after 5 minutes")
    except Exception as e:
        logger.error(f"Failed to convert file to PDF: {str(e)}")
        raise


def upload_pdf(conversion_id: str, pdf_file: str, original_filename: str) -> str:
    """Upload the converted PDF back to Supabase Storage."""
    try:
        # Generate unique filename for the PDF
        pdf_name = f"{uuid.uuid4()}_{Path(original_filename).stem}.pdf"
        pdf_path = f"converted/{pdf_name}"
        
        # Read the PDF file
        with open(pdf_file, "rb") as f:
            file_bytes = f.read()
        
        # Upload to Supabase Storage
        response = supabase.storage.from_bucket(STORAGE_BUCKET).upload(pdf_path, file_bytes)
        
        # Get the public URL
        public_url = supabase.storage.from_bucket(STORAGE_BUCKET).get_public_url(pdf_path)
        
        logger.info(f"Uploaded PDF to {pdf_path}")
        return public_url.get("publicUrl") if hasattr(public_url, 'get') else public_url
    except Exception as e:
        logger.error(f"Failed to upload PDF: {str(e)}")
        raise


@app.get("/health")
async def health_check():
    """Health check endpoint for Cloud Run."""
    return {"status": "healthy"}


@app.post("/convert")
async def convert_file(request: ConversionRequest):
    """
    Convert a file from the conversions table.
    
    Receives: conversion_id
    Processes: Download -> Convert -> Upload
    Updates database status throughout
    """
    conversion_id = request.id
    temp_files = []
    
    try:
        logger.info(f"Starting conversion for ID: {conversion_id}")
        
        # Step 1: Fetch the conversion record
        conversion_record = supabase.table("conversions").select("*").eq("id", conversion_id).single().execute()
        conversion_data = conversion_record.data
        original_filename = conversion_data.get("original_filename")
        
        if not original_filename:
            raise Exception("Original filename not found in database")
        
        # Step 2: Update status to 'processing'
        update_conversion_status(conversion_id, "processing")
        
        # Step 3: Download the file
        input_file = download_file(conversion_id, original_filename)
        temp_files.append(input_file)
        
        # Step 4: Convert to PDF using LibreOffice
        pdf_file = convert_to_pdf(input_file)
        temp_files.append(pdf_file)
        
        # Step 5: Upload the PDF back to Supabase
        pdf_url = upload_pdf(conversion_id, pdf_file, original_filename)
        
        # Step 6: Update status to 'done' with PDF URL
        update_conversion_status(conversion_id, "done", pdf_url)
        
        logger.info(f"Conversion completed for ID: {conversion_id}")
        
        return {
            "status": "success",
            "conversion_id": conversion_id,
            "pdf_url": pdf_url
        }
    
    except Exception as e:
        logger.error(f"Conversion failed for ID {conversion_id}: {str(e)}")
        
        # Update database status to 'error'
        try:
            update_conversion_status(conversion_id, "error")
        except:
            logger.error("Failed to update error status in database")
        
        raise HTTPException(status_code=500, detail=f"Conversion failed: {str(e)}")
    
    finally:
        # Cleanup temporary files
        for temp_file in temp_files:
            try:
                if os.path.exists(temp_file):
                    os.remove(temp_file)
                    logger.info(f"Cleaned up temp file: {temp_file}")
            except Exception as e:
                logger.warning(f"Failed to cleanup temp file {temp_file}: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", "8080"))
    uvicorn.run(app, host="0.0.0.0", port=port)
