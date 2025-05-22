import os
import json
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from datetime import datetime

router = APIRouter()

STATUS_FILE = "model_status.json"

# Default structure if file doesn't exist
default_status = {
    "binary_model": {
        "name": "distilbert-base-uncased",
        "type": "binary",
        "trained_on": "binary_dataset_v1.csv",
        "last_updated": str(datetime.now())
    },
    "multi_model": {
        "name": "facebook/bart-large-mnli",
        "type": "multi-class",
        "trained_on": "multi_dataset_v1.csv",
        "last_updated": str(datetime.now())
    },
    "mode": "hybrid"
}

# Helper: read status
def read_status():
    if not os.path.exists(STATUS_FILE):
        with open(STATUS_FILE, "w") as f:
            json.dump(default_status, f, indent=2)
    with open(STATUS_FILE, "r") as f:
        return json.load(f)

# Helper: write status
def write_status(data):
    with open(STATUS_FILE, "w") as f:
        json.dump(data, f, indent=2)

@router.get("/status")
def get_model_status():
    try:
        status = read_status()
        return status
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class ModeSwitch(BaseModel):
    mode: str  # "hybrid", "binary-only", "multi-only"

@router.post("/switch")
def switch_mode(req: ModeSwitch):
    try:
        if req.mode not in ["hybrid", "binary-only", "multi-only"]:
            raise HTTPException(status_code=400, detail="Invalid mode value")

        status = read_status()
        status["mode"] = req.mode
        write_status(status)
        return {"message": f"Switched to {req.mode} mode"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))