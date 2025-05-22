from sqlalchemy import Column, Integer, String, Boolean, Float, DateTime
from datetime import datetime
from .database import Base

class ScanResult(Base):
    __tablename__ = "scan_results"

    id = Column(Integer, primary_key=True, index=True)
    input_type = Column(String, index=True)
    raw_name = Column(String)
    content = Column(String)
    is_malicious = Column(Boolean)
    threat_type = Column(String)
    threat_score = Column(Float)
    binary_score = Column(Float)
    tokens = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)