from sqlalchemy import (
    Column, String, Integer, Date, Text, Boolean, DECIMAL, JSON,
    Enum as SQLEnum, ForeignKey, Index
)
from sqlalchemy.dialects.mysql import CHAR
from ..core.database import Base
from .base import BaseModel


# ============================================
# PATIENT HEALTH RECORDS
# ============================================
class PatientHealthRecord(Base, BaseModel):
    __tablename__ = "patient_health_records"

    patient_id = Column(CHAR(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    record_type = Column(SQLEnum("lab_report", "imaging", "document", "vaccination", "measurement", "surgery", "other"), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    file_url = Column(String(500))
    file_type = Column(String(50))
    file_size = Column(Integer)
    recorded_by = Column(CHAR(36), ForeignKey("users.id"), nullable=True)
    is_shared = Column(Boolean, default=False)
    shared_with = Column(JSON)


# ============================================
# PATIENT VACCINATIONS
# ============================================
class PatientVaccination(Base, BaseModel):
    __tablename__ = "patient_vaccinations"

    patient_id = Column(CHAR(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    vaccine_name = Column(String(255), nullable=False)
    disease = Column(String(255))
    dose_number = Column(Integer, default=1)
    scheduled_date = Column(Date)
    administered_at = Column(Date)
    next_due_date = Column(Date)
    administered_by = Column(String(255))
    facility_name = Column(String(255))
    hospital_name = Column(String(255))
    batch_number = Column(String(100))
    status = Column(SQLEnum("scheduled", "completed", "missed", "delayed"), default="scheduled", index=True)
    side_effects = Column(Text)
    notes = Column(Text)
    certificate_url = Column(String(500))


# ============================================
# PATIENT MEDICATIONS
# ============================================
class PatientMedication(Base, BaseModel):
    __tablename__ = "patient_medications"

    patient_id = Column(CHAR(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    medicine_name = Column(String(255), nullable=False)
    dosage = Column(String(100), nullable=False)
    frequency = Column(String(100), nullable=False)
    route = Column(String(50), default="oral")
    start_date = Column(Date, nullable=False)
    end_date = Column(Date)
    prescribed_by = Column(CHAR(36), ForeignKey("doctor_profiles.id"), nullable=True)
    prescription_id = Column(CHAR(36), ForeignKey("prescriptions.id"), nullable=True)
    is_active = Column(Boolean, default=True)
    reminder_time = Column(String(10))
    reminder_enabled = Column(Boolean, default=False)
    notes = Column(Text)


# ============================================
# PATIENT MEDICAL HISTORY
# ============================================
class PatientMedicalHistory(Base, BaseModel):
    __tablename__ = "patient_medical_history"

    patient_id = Column(CHAR(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    condition_name = Column(String(255), nullable=False)
    diagnosed_date = Column(Date)
    status = Column(SQLEnum("active", "resolved", "managed", "ongoing"), default="active")
    notes = Column(Text)


# ============================================
# PATIENT SURGERIES
# ============================================
class PatientSurgery(Base, BaseModel):
    __tablename__ = "patient_surgeries"

    patient_id = Column(CHAR(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    surgery_name = Column(String(255), nullable=False)
    surgery_date = Column(Date)
    hospital = Column(String(255))
    doctor_name = Column(String(150))
    notes = Column(Text)
