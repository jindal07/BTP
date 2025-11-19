"""
Vercel Serverless Function for FastAPI Backend
"""
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import os
from pathlib import Path

app = FastAPI(
    title="NIRF Rankings Portal API",
    description="API for NIRF Engineering College Rankings and Predictions",
    version="1.0.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Vercel will handle this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Get base path (works both locally and on Vercel)
BASE_DIR = Path(__file__).resolve().parent.parent
CSV_DATA_DIR = BASE_DIR / "csv_data"
PREDICTIONS_FILE = BASE_DIR / "nirf_predictions_2025.csv"

@app.get("/")
def root():
    return {
        "message": "NIRF Rankings Portal API",
        "version": "1.0.0",
        "docs": "/api/docs",
        "status": "online"
    }

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "environment": "vercel",
        "csv_data_exists": CSV_DATA_DIR.exists(),
        "predictions_exists": PREDICTIONS_FILE.exists()
    }

@app.get("/api/colleges")
def get_colleges():
    """Get all colleges data"""
    try:
        import numpy as np
        csv_path = CSV_DATA_DIR / "nirf_combined_data.csv"
        
        if not csv_path.exists():
            return {"error": "Data file not found", "colleges": []}
        
        df = pd.read_csv(csv_path)
        # Replace all NaN/inf with None so they're JSON-serializable
        df = df.replace({np.nan: None, np.inf: None, -np.inf: None})
        return df.to_dict('records')
    except Exception as e:
        return {"error": str(e), "colleges": []}

@app.get("/api/predictions")
def get_predictions():
    """Get predictions data"""
    try:
        if PREDICTIONS_FILE.exists():
            df = pd.read_csv(PREDICTIONS_FILE)
            return df.to_dict('records')
        return []
    except Exception as e:
        return {"error": str(e), "predictions": []}

@app.post("/api/admin/upload")
async def upload_csv(file: UploadFile = File(...)):
    """Upload new CSV file"""
    try:
        # Note: On Vercel, filesystem is read-only except /tmp
        # This is for demo purposes - in production, use a database
        contents = await file.read()
        
        # Save to /tmp (only writable location on Vercel)
        temp_path = f"/tmp/{file.filename}"
        with open(temp_path, "wb") as f:
            f.write(contents)
        
        return {
            "message": "File uploaded successfully (saved to temporary storage)",
            "status": "success",
            "note": "On Vercel, files are stored temporarily. For production, use a database."
        }
    except Exception as e:
        return {"message": str(e), "status": "error"}

# Vercel expects this handler
handler = app

