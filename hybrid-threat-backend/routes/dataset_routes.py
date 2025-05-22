import os
from fastapi import APIRouter, UploadFile, File, HTTPException
from typing import List
from datetime import datetime

router = APIRouter()

DATASET_DIR = "./datasets"
os.makedirs(DATASET_DIR, exist_ok=True)

@router.post("/")
async def upload_dataset(file: UploadFile = File(...)):
    try:
        filename = file.filename
        file_path = os.path.join(DATASET_DIR, filename)

        with open(file_path, "wb") as f:
            f.write(await file.read())

        return {"message": "Dataset uploaded", "filename": filename}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/")
def list_datasets():
    try:
        files = os.listdir(DATASET_DIR)
        datasets = [
            {
                "filename": f,
                "uploaded_at": datetime.fromtimestamp(os.path.getctime(os.path.join(DATASET_DIR, f)))
            }
            for f in files
        ]
        return datasets
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{filename}")
def delete_dataset(filename: str):
    try:
        file_path = os.path.join(DATASET_DIR, filename)
        if not os.path.exists(file_path):
            raise HTTPException(status_code=404, detail="File not found")
        os.remove(file_path)
        return {"message": "Dataset deleted", "filename": filename}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))