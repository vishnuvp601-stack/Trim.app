# Trim Backend - File Conversion Worker

A FastAPI-based backend worker that converts office files (PPT, PPTX, DOC, DOCX) to PDF using LibreOffice.

## Features

- ✅ FastAPI REST endpoint for file conversion
- ✅ Supabase integration for database and storage
- ✅ LibreOffice headless conversion
- ✅ Robust error handling with database status tracking
- ✅ Docker containerization for Cloud Run deployment
- ✅ Health check endpoint for monitoring

## Architecture

```
Frontend (Next.js) 
    ↓ (uploads file)
Supabase Storage + Database
    ↓ (triggers conversion)
Backend Worker (FastAPI)
    ↓ (converts PPT/DOC → PDF)
Supabase Storage
    ↓ (downloads converted PDF)
Frontend
```

## Setup Instructions

### Local Development

1. **Install dependencies:**
```bash
cd backend
pip install -r requirements.txt
```

2. **Install LibreOffice locally:**

**Windows:**
```bash
# Using Chocolatey
choco install libreoffice
```

**Mac:**
```bash
# Using Homebrew
brew install libreoffice
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get update
sudo apt-get install -y libreoffice libreoffice-writer libreoffice-calc libreoffice-impress
```

3. **Set up environment variables:**
```bash
cp .env.example .env
```

Edit `.env` and add your Supabase credentials:
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
PORT=8080
```

⚠️ **Important:** Use your **Service Role Key** (not Anon Key) for the backend. Get it from Supabase Settings → API.

4. **Run the server:**
```bash
python main.py
```

The server will start at `http://localhost:8080`

5. **Test the endpoint:**
```bash
curl -X POST http://localhost:8080/convert \
  -H "Content-Type: application/json" \
  -d '{"id": "your-conversion-id"}'
```

### Docker Build & Test

1. **Build the Docker image:**
```bash
docker build -t trim-backend:latest .
```

2. **Run locally with Docker:**
```bash
docker run -e SUPABASE_URL="your-url" \
           -e SUPABASE_KEY="your-key" \
           -p 8080:8080 \
           trim-backend:latest
```

## Google Cloud Run Deployment

### Prerequisites
- Google Cloud Project with billing enabled
- `gcloud` CLI installed and configured
- Docker installed

### Steps

1. **Authenticate with Google Cloud:**
```bash
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
```

2. **Create a `.gcloudignore` file (optional):**
```
.git
.gitignore
__pycache__
*.pyc
.env
.env.local
```

3. **Deploy to Cloud Run:**
```bash
gcloud run deploy trim-backend \
  --source . \
  --platform managed \
  --region us-central1 \
  --set-env-vars SUPABASE_URL="your-url" \
  --set-env-vars SUPABASE_KEY="your-service-role-key" \
  --allow-unauthenticated \
  --memory 2Gi
```

4. **Get the service URL:**
```bash
gcloud run services describe trim-backend --region us-central1
```

### Environment Variables in Cloud Run

Set these securely in Cloud Run:
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_KEY` - Your Service Role Key (keep this secret!)

Use Secret Manager for sensitive values:
```bash
echo -n "your-service-role-key" | gcloud secrets create supabase-key --data-file=-

gcloud run deploy trim-backend \
  --update-secrets SUPABASE_KEY=supabase-key:latest \
  ...
```

## API Endpoints

### POST /convert
Converts a file from the conversions table.

**Request:**
```json
{
  "id": "conversion-uuid-from-database"
}
```

**Response (Success):**
```json
{
  "status": "success",
  "conversion_id": "uuid",
  "pdf_url": "https://..."
}
```

**Response (Error):**
```json
{
  "detail": "Conversion failed: ..."
}
```

### GET /health
Health check endpoint (used by Cloud Run).

**Response:**
```json
{
  "status": "healthy"
}
```

## Database Status Flow

The backend updates the `conversions` table status:

- `pending` → File uploaded, waiting for conversion
- `processing` → Conversion started
- `done` → Conversion complete, PDF available
- `error` → Conversion failed

## Troubleshooting

### "LibreOffice not found"
Make sure LibreOffice is installed and in PATH:
```bash
which libreoffice  # Linux/Mac
where libreoffice  # Windows
```

### "Conversion timeout"
Increase the timeout in `main.py` (line ~110) or give the container more resources in Cloud Run.

### "Permission denied uploading PDF"
Ensure your Supabase Storage bucket allows public uploads and the Service Role Key has sufficient permissions.

### Docker build fails
Make sure you're in the `backend` directory:
```bash
cd backend
docker build -t trim-backend:latest .
```

## File Conversion Support

- **.ppt** - PowerPoint 97-2003
- **.pptx** - PowerPoint 2007+
- **.doc** - Word 97-2003
- **.docx** - Word 2007+

All files are converted to **PDF format** via LibreOffice.

## Performance Notes

- First conversion takes ~5-10 seconds (LibreOffice startup)
- Subsequent conversions take ~2-5 seconds
- Large files (>50MB) may take longer
- Cloud Run timeout is 30 minutes (default, adjustable)

## Security

⚠️ **Critical:** Always use **Service Role Key** for the backend, never the Anon Key.

- Service Role Key has full database/storage access
- Anon Key is limited for frontend use only
- Never commit `.env` to version control

## Monitoring

In Cloud Run, monitor via:
- Logs: `gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=trim-backend"`
- Metrics: Google Cloud Console → Cloud Run → Logs

## Next Steps

1. Update the frontend to call this backend when conversion completes
2. Monitor conversion status from Supabase in real-time
3. Show download link when status changes to `done`
4. Add retry logic for failed conversions

---

**Questions?** Check the logs:
```bash
# Local
tail -f output.log

# Cloud Run
gcloud logging read "resource.type=cloud_run_revision" --limit=50
```
