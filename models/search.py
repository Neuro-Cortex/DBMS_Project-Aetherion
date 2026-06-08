from sqlalchemy import Column, String, Integer, Text, DateTime, JSON
from sqlalchemy.dialects.mysql import CHAR
from ..core.database import Base
from .base import BaseModel


# ============================================
# SEARCH LOGS (Analytics)
# ============================================
class SearchLog(Base, BaseModel):
    __tablename__ = "search_logs"

    user_id = Column(CHAR(36), nullable=True, index=True)
    query = Column(String(500), nullable=False, index=True)
    type = Column(String(50), comment="doctor/hospital/medicine/pharmacy")
    results_count = Column(Integer, default=0)
    filters = Column(JSON)
    ip_address = Column(String(45))
    user_agent = Column(String(500))


# ============================================
# AUDIT LOGS (System Activity Trail)
# ============================================
class AuditLog(Base, BaseModel):
    __tablename__ = "audit_logs"

    user_id = Column(CHAR(36), nullable=True, index=True)
    action = Column(String(100), nullable=False)
    entity_type = Column(String(50))
    entity_id = Column(CHAR(36))
    old_values = Column(JSON)
    new_values = Column(JSON)
    ip_address = Column(String(45))
    user_agent = Column(String(500))
    severity = Column(String(20), default="info")


# ============================================
# SECURITY LOGS (Auth & Security Events)
# ============================================
class SecurityLog(Base, BaseModel):
    __tablename__ = "security_logs"

    event = Column(String(100), nullable=False, index=True)
    user_id = Column(CHAR(36), nullable=True, index=True)
    user_name = Column(String(150))
    ip_address = Column(String(45))
    user_agent = Column(String(500))
    status = Column(String(20), default="success", comment="success/failed/blocked")
    details = Column(Text)
