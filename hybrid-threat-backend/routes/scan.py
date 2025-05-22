from fastapi import APIRouter, HTTPException, File, UploadFile
from pydantic import BaseModel
from models.hybrid_model import classify_input
from db.database import SessionLocal
from db.models import ScanResult

router = APIRouter()
MAX_LENGTH = 571  # Adjust as needed for token safety

class ScanRequest(BaseModel):
    input_text: str

@router.post("/")
def scan_input(request: ScanRequest):
    try:
        result = classify_input(request.input_text)

        db = SessionLocal()
        scan_entry = ScanResult(
            input_type="url",
            raw_name="User URL Input",
            content=request.input_text[:MAX_LENGTH],
            is_malicious=result["is_malicious"],
            threat_type=result["threat_type"],
            threat_score=result["threat_score"],
            binary_score=result["binary_score"],
            tokens=", ".join(result["highlighted_tokens"]),
        )
        db.add(scan_entry)
        db.commit()
        db.refresh(scan_entry)

        return {
            "status": "success",
            "data": result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/email")
async def scan_uploaded_file(file: UploadFile = File(...)):
    try:
        content = await file.read()
        text = content.decode("utf-8", errors="ignore")[:MAX_LENGTH]

        result = classify_input(text)

        db = SessionLocal()
        scan_entry = ScanResult(
            input_type="email",
            raw_name=file.filename,
            content=text,
            is_malicious=result["is_malicious"],
            threat_type=result["threat_type"],
            threat_score=result["threat_score"],
            binary_score=result["binary_score"],
            tokens=", ".join(result["highlighted_tokens"]),
        )
        db.add(scan_entry)
        db.commit()
        db.refresh(scan_entry)

        return {
            "filename": file.filename,
            "status": "success",
            "data": result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/html")
async def scan_html_file(file: UploadFile = File(...)):
    try:
        content = await file.read()
        text = content.decode("utf-8", errors="ignore")[:MAX_LENGTH]

        result = classify_input(text)

        db = SessionLocal()
        scan_entry = ScanResult(
            input_type="html",
            raw_name=file.filename,
            content=text,
            is_malicious=result["is_malicious"],
            threat_type=result["threat_type"],
            threat_score=result["threat_score"],
            binary_score=result["binary_score"],
            tokens=", ".join(result["highlighted_tokens"]),
        )
        db.add(scan_entry)
        db.commit()
        db.refresh(scan_entry)

        return {
            "filename": file.filename,
            "status": "success",
            "data": result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))