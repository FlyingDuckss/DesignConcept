from fastapi import APIRouter, HTTPException
from sqlalchemy.orm import Session
from db.database import SessionLocal
from db.models import ScanResult

router = APIRouter()

@router.get("/")
def list_scans():
    try:
        db: Session = SessionLocal()
        scans = db.query(ScanResult).order_by(ScanResult.created_at.desc()).all()
        return [
            {
                "id": scan.id,
                "input_type": scan.input_type,
                "raw_name": scan.raw_name,
                "threat_type": scan.threat_type,
                "is_malicious": scan.is_malicious,
                "created_at": scan.created_at,
            }
            for scan in scans
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{scan_id}")
def get_scan_detail(scan_id: int):
    try:
        db: Session = SessionLocal()
        scan = db.query(ScanResult).filter(ScanResult.id == scan_id).first()
        if not scan:
            raise HTTPException(status_code=404, detail="Scan not found")
        return {
            "id": scan.id,
            "input_type": scan.input_type,
            "raw_name": scan.raw_name,
            "content": scan.content,
            "is_malicious": scan.is_malicious,
            "threat_type": scan.threat_type,
            "threat_score": scan.threat_score,
            "binary_score": scan.binary_score,
            "tokens": scan.tokens,
            "created_at": scan.created_at,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))