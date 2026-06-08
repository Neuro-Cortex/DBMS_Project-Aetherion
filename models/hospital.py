from sqlalchemy import (
    Column, String, Integer, Boolean, DECIMAL, JSON, Text, Date, Time,
    Enum as SQLEnum, ForeignKey, Index
)
from sqlalchemy.dialects.mysql import CHAR
from ..core.database import Base
from .base import BaseModel


# ============================================
# HOSPITALS
# ============================================
class Hospital(Base, BaseModel):
    __tablename__ = "hospitals"

    admin_user_id = Column(CHAR(36), ForeignKey("users.id"), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    registration_number = Column(String(100), unique=True, nullable=False)
    type = Column(SQLEnum("government", "private", "charitable", "multispecialty", "community", "teaching", "specialized", "general"))
    phone = Column(String(20), nullable=False)
    emergency_phone = Column(String(20))
    email = Column(String(255))
    website = Column(String(500))
    street = Column(String(255))
    city = Column(String(100), nullable=False, index=True)
    state = Column(String(100), nullable=False, index=True)
    zip_code = Column(String(20))
    country = Column(String(100), default="USA")
    latitude = Column(DECIMAL(10, 7))
    longitude = Column(DECIMAL(10, 7))
    total_beds = Column(Integer, default=0)
    available_beds = Column(Integer, default=0)
    icu_total_beds = Column(Integer, default=0)
    icu_available_beds = Column(Integer, default=0)
    icu_with_ventilator = Column(Integer, default=0)
    icu_without_ventilator = Column(Integer, default=0)
    ambulance_count = Column(Integer, default=0)
    ambulance_available = Column(Integer, default=0)
    emergency_service = Column(SQLEnum("active", "busy", "unavailable"), default="active")
    emergency_response_time = Column(String(20), default="15 min")
    total_doctors = Column(Integer, default=0)
    total_nurses = Column(Integer, default=0)
    total_staff = Column(Integer, default=0)
    rating = Column(DECIMAL(2, 1), default=0.0)
    review_count = Column(Integer, default=0)
    is_verified = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    verified_by = Column(CHAR(36), ForeignKey("users.id"))
    services = Column(JSON)
    facilities = Column(JSON)
    insurance_accepted = Column(JSON)
    working_hours = Column(JSON)
    visiting_hours = Column(JSON)


# ============================================
# HOSPITAL DEPARTMENTS
# ============================================
class HospitalDepartment(Base, BaseModel):
    __tablename__ = "hospital_departments"

    hospital_id = Column(CHAR(36), ForeignKey("hospitals.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(150), nullable=False)
    description = Column(Text)
    head_doctor_id = Column(CHAR(36), ForeignKey("doctor_profiles.id"), nullable=True)
    total_beds = Column(Integer, default=0)
    available_beds = Column(Integer, default=0)
    total_doctors = Column(Integer, default=0)
    total_nurses = Column(Integer, default=0)
    services = Column(JSON)
    timings = Column(String(100))
    is_active = Column(Boolean, default=True)


# ============================================
# HOSPITAL DOCTORS (Affiliation)
# ============================================
class HospitalDoctor(Base, BaseModel):
    __tablename__ = "hospital_doctors"

    hospital_id = Column(CHAR(36), ForeignKey("hospitals.id", ondelete="CASCADE"), nullable=False, index=True)
    doctor_id = Column(CHAR(36), ForeignKey("doctor_profiles.id", ondelete="CASCADE"), nullable=False, index=True)
    department_id = Column(CHAR(36), ForeignKey("hospital_departments.id"), nullable=True)
    designation = Column(String(100))
    joining_date = Column(Date)
    is_active = Column(Boolean, default=True)

    __table_args__ = (Index("ix_hospital_doctor_unique", "hospital_id", "doctor_id", unique=True),)


# ============================================
# HOSPITAL BEDS
# ============================================
class HospitalBed(Base, BaseModel):
    __tablename__ = "hospital_beds"

    hospital_id = Column(CHAR(36), ForeignKey("hospitals.id", ondelete="CASCADE"), nullable=False, index=True)
    department_id = Column(CHAR(36), ForeignKey("hospital_departments.id"), nullable=True)
    bed_number = Column(String(20), nullable=False)
    bed_type = Column(SQLEnum("general", "semi-private", "private", "icu", "nicu", "picu", "cardiac-icu", "emergency", "pediatric", "maternity"))
    floor = Column(String(50))
    ward = Column(String(100))
    status = Column(SQLEnum("available", "occupied", "reserved", "maintenance", "cleaning"), default="available")
    price_per_day = Column(DECIMAL(10, 2), default=0)
    features = Column(JSON)
    patient_id = Column(CHAR(36), ForeignKey("users.id"), nullable=True)
    patient_name = Column(String(150))
    admission_date = Column(Date)
    expected_discharge = Column(Date)
    has_ventilator = Column(Boolean, default=False)
    has_monitor = Column(Boolean, default=False)
    daily_charge = Column(DECIMAL(10, 2), default=0)


# ============================================
# HOSPITAL BLOOD BANK
# ============================================
class HospitalBloodBank(Base, BaseModel):
    __tablename__ = "hospital_blood_bank"

    hospital_id = Column(CHAR(36), ForeignKey("hospitals.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    is_available = Column(Boolean, default=True)
    total_units = Column(Integer, default=0)
    expiry_alerts = Column(Integer, default=0)
    last_updated = Column(String(30))


# ============================================
# HOSPITAL BLOOD STOCKS
# ============================================
class HospitalBloodStock(Base, BaseModel):
    __tablename__ = "hospital_blood_stocks"

    blood_bank_id = Column(CHAR(36), ForeignKey("hospital_blood_bank.id", ondelete="CASCADE"), nullable=False, index=True)
    blood_group = Column(SQLEnum("A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"), nullable=False)
    units = Column(Integer, default=0)
    expiry_date = Column(Date)
    status = Column(SQLEnum("sufficient", "low", "critical", "out-of-stock"), default="sufficient")

    __table_args__ = (Index("ix_blood_stock_bank_group", "blood_bank_id", "blood_group"),)


# ============================================
# HOSPITAL OXYGEN STOCK
# ============================================
class HospitalOxygenStock(Base, BaseModel):
    __tablename__ = "hospital_oxygen_stock"

    hospital_id = Column(CHAR(36), ForeignKey("hospitals.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    total_cylinders = Column(Integer, default=0)
    available_cylinders = Column(Integer, default=0)
    in_use_cylinders = Column(Integer, default=0)
    reserved_cylinders = Column(Integer, default=0)
    cylinder_types = Column(JSON)
    last_refilled = Column(Date)
    next_refill_date = Column(Date)
    supplier = Column(String(255))
    supplier_contact = Column(String(20))
    status = Column(SQLEnum("sufficient", "low", "critical", "out-of-stock"), default="sufficient")


# ============================================
# HOSPITAL AMBULANCES
# ============================================
class HospitalAmbulance(Base, BaseModel):
    __tablename__ = "hospital_ambulances"

    hospital_id = Column(CHAR(36), ForeignKey("hospitals.id", ondelete="CASCADE"), nullable=False, index=True)
    vehicle_number = Column(String(50), unique=True, nullable=False)
    type = Column(SQLEnum("basic", "advanced", "cardiac", "neonatal", "mobile-icu"), default="basic")
    status = Column(SQLEnum("available", "on-call", "dispatched", "maintenance", "offline"), default="available")
    driver_name = Column(String(150))
    driver_phone = Column(String(20))
    paramedic_name = Column(String(150))
    equipment = Column(JSON)
    current_latitude = Column(DECIMAL(10, 7))
    current_longitude = Column(DECIMAL(10, 7))
    current_address = Column(String(255))
    has_oxygen = Column(Boolean, default=True)
    has_ac = Column(Boolean, default=True)


# ============================================
# HOSPITAL ACTIVITIES
# ============================================
class HospitalActivity(Base, BaseModel):
    __tablename__ = "hospital_activities"

    hospital_id = Column(CHAR(36), ForeignKey("hospitals.id", ondelete="CASCADE"), nullable=False, index=True)
    type = Column(SQLEnum("admission", "discharge", "emergency", "surgery", "blood", "ambulance", "other"), nullable=False)
    description = Column(Text, nullable=False)
    department = Column(String(100))
    user_name = Column(String(150))
