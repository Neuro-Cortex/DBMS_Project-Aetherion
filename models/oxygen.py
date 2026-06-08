from sqlalchemy import (
    Column, String, Integer, Date, Text, Boolean, DECIMAL, JSON,
    Enum as SQLEnum, ForeignKey, Index
)
from sqlalchemy.dialects.mysql import CHAR
from ..core.database import Base
from .base import BaseModel


# ============================================
# OXYGEN STOCKS (Per-Center Inventory)
# ============================================
class OxygenStock(Base, BaseModel):
    __tablename__ = "oxygen_stocks"

    hospital_id = Column(CHAR(36), ForeignKey("hospitals.id", ondelete="CASCADE"), nullable=False, index=True)
    hospital_name = Column(String(255))
    total_cylinders = Column(Integer, default=0)
    available_cylinders = Column(Integer, default=0)
    in_use_cylinders = Column(Integer, default=0)
    reserved_cylinders = Column(Integer, default=0)
    cylinder_types = Column(JSON)
    status = Column(SQLEnum("sufficient", "low", "critical", "out-of-stock"), default="sufficient", index=True)
    emergency_support = Column(Boolean, default=True)
    phone = Column(String(20))
    emergency_phone = Column(String(20))
    last_updated = Column(String(30))
    last_refilled = Column(Date)
    next_refill_date = Column(Date)
    supplier = Column(String(255))
    supplier_contact = Column(String(20))


# ============================================
# OXYGEN CENTERS
# ============================================
class OxygenCenter(Base, BaseModel):
    __tablename__ = "oxygen_centers"

    name = Column(String(255), nullable=False)
    type = Column(SQLEnum("hospital", "oxygen-bank", "supplier", "emergency-center"), nullable=False)
    oxygen_stock_id = Column(CHAR(36), ForeignKey("oxygen_stocks.id"), nullable=True)
    street = Column(String(255))
    city = Column(String(100), nullable=False, index=True)
    state = Column(String(100))
    zip_code = Column(String(20))
    latitude = Column(DECIMAL(10, 7))
    longitude = Column(DECIMAL(10, 7))
    is_open = Column(Boolean, default=True)
    is_emergency_ready = Column(Boolean, default=False)
    operating_hours = Column(String(255))
    phone = Column(String(20))
    emergency_phone = Column(String(20))
    rating = Column(DECIMAL(2, 1), default=0.0)
    total_reviews = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)


# ============================================
# OXYGEN REQUESTS
# ============================================
class OxygenRequest(Base, BaseModel):
    __tablename__ = "oxygen_requests"

    request_number = Column(String(50), unique=True, nullable=False)
    patient_name = Column(String(150), nullable=False)
    patient_age = Column(Integer)
    patient_condition = Column(Text)
    oxygen_type = Column(String(50))
    cylinders_needed = Column(Integer, nullable=False)
    urgency = Column(SQLEnum("normal", "urgent", "emergency"), default="normal", index=True)
    hospital_name = Column(String(255))
    doctor_name = Column(String(150))
    status = Column(SQLEnum("pending", "approved", "dispatched", "delivered", "cancelled"), default="pending", index=True)
    delivery_address = Column(Text)
    latitude = Column(DECIMAL(10, 7))
    longitude = Column(DECIMAL(10, 7))
    contact_phone = Column(String(20))
    contact_email = Column(String(255))
    requested_by = Column(CHAR(36), ForeignKey("users.id"), nullable=False, index=True)
    hospital_id = Column(CHAR(36), ForeignKey("hospitals.id"), nullable=True)
    required_date = Column(Date)
    delivery_date = Column(Date, nullable=True)


# ============================================
# OXYGEN ALERTS
# ============================================
class OxygenAlert(Base, BaseModel):
    __tablename__ = "oxygen_alerts"

    type = Column(SQLEnum("stock-low", "stock-out", "request-pending", "delivery-delayed"), nullable=False)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    hospital_name = Column(String(255))
    priority = Column(SQLEnum("low", "medium", "high", "critical"), default="medium", index=True)
    is_read = Column(Boolean, default=False)
