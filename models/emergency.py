from sqlalchemy import (
    Column, String, Integer, Date, Text, Boolean, DECIMAL, JSON,
    Enum as SQLEnum, ForeignKey, Index
)
from sqlalchemy.dialects.mysql import CHAR
from ..core.database import Base
from .base import BaseModel


# ============================================
# EMERGENCY SERVICES
# ============================================
class EmergencyService(Base, BaseModel):
    __tablename__ = "emergency_services"

    name = Column(String(255), nullable=False)
    type = Column(SQLEnum("ambulance", "blood", "oxygen", "doctor", "emergency-room", "helicopter"), nullable=False, index=True)
    status = Column(SQLEnum("available", "busy", "dispatched", "offline", "maintenance"), default="available", index=True)
    provider = Column(String(255))
    phone = Column(String(20))
    street = Column(String(255))
    city = Column(String(100))
    state = Column(String(100))
    latitude = Column(DECIMAL(10, 7))
    longitude = Column(DECIMAL(10, 7))
    eta_minutes = Column(Integer)
    capacity = Column(Integer)
    current_load = Column(Integer, default=0)
    vehicle_number = Column(String(50))
    crew_members = Column(Integer)
    equipment = Column(JSON)
    rating = Column(DECIMAL(2, 1), default=0.0)
    price = Column(DECIMAL(10, 2), default=0)
    hospital_id = Column(CHAR(36), ForeignKey("hospitals.id"), nullable=True, index=True)
    is_active = Column(Boolean, default=True)


# ============================================
# EMERGENCY REQUESTS
# ============================================
class EmergencyRequest(Base, BaseModel):
    __tablename__ = "emergency_requests"

    type = Column(SQLEnum("ambulance", "blood", "oxygen", "doctor", "emergency-room"), nullable=False, index=True)
    priority = Column(SQLEnum("low", "medium", "high", "critical"), default="medium", index=True)
    status = Column(SQLEnum("pending", "dispatched", "en-route", "arrived", "completed", "cancelled"), default="pending", index=True)
    patient_id = Column(CHAR(36), ForeignKey("users.id"), nullable=True, index=True)
    patient_name = Column(String(150))
    patient_phone = Column(String(20))
    location_address = Column(Text, nullable=False)
    latitude = Column(DECIMAL(10, 7))
    longitude = Column(DECIMAL(10, 7))
    notes = Column(Text)
    service_id = Column(CHAR(36), ForeignKey("emergency_services.id"), nullable=True)
    hospital_id = Column(CHAR(36), ForeignKey("hospitals.id"), nullable=True)
    estimated_time = Column(Integer, comment="ETA in minutes")
    dispatched_at = Column(Date, nullable=True)
    arrived_at = Column(Date, nullable=True)
    completed_at = Column(Date, nullable=True)
    cancelled_at = Column(Date, nullable=True)
    cancellation_reason = Column(String(500))
