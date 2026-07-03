# Use Python 3.11 slim image as base
FROM python:3.11-slim

# Install LibreOffice and required dependencies
RUN apt-get update && apt-get install -y \
    libreoffice \
    libreoffice-writer \
    libreoffice-calc \
    libreoffice-impress \
    fonts-dejavu \
    fonts-liberation \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application code
COPY main.py .

# Set environment variables for LibreOffice
ENV SAL_NO_DIALOGS=1
ENV SAL_NO_PROPERTY_PRINTING=1

# Cloud Run requires the service to listen on 0.0.0.0:8080
ENV PORT=8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:${PORT}/health || exit 1

# Run the FastAPI application
CMD exec uvicorn main:app --host 0.0.0.0 --port ${PORT}
