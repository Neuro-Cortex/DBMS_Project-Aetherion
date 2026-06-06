from sqlalchemy import (
    Column, String, Integer, Date, Time, Text, Boolean, DECIMAL, JSON,
    Enum as SQLEnum, ForeignKey, Index
)
from sqlalchemy.dialects.mysql import CHAR
from ..core.database import Base
from .base import BaseModel


# ============================================
# APPOINTMENTS
# ============================================
class Appointment(Base, BaseModel):
    __tablename__ = "appointments"

    patient_id = Column(CHAR(36), ForeignKey("users.id"), nullable=False, index=True)
    doctor_id = Column(CHAR(36), ForeignKey("doctor_profiles.id"), nullable=False, index=True)
    hospital_id = Column(CHAR(36), ForeignKey("hospitals.id"), nullable=True)
    department_id = Column(CHAR(36), ForeignKey("hospital_departments.id"), nullable=True)
    appointment_date = Column(Date, nullable=False, index=True)
    start_time = Column(Time, nullable=False)
    end_time = Column(Time)
    duration_minutes = Column(Integer, default=15)
    type = Column(SQLEnum("consultation", "follow-up", "emergency", "checkup", "surgery", "lab-review"), default="consultation")
    status = Column(SQLEnum("scheduled", "confirmed", "in-progress", "completed", "cancelled", "rescheduled", "no-show"), default="scheduled", index=True)
    location = Column(SQLEnum("in-person", "video", "phone"), default="in-person")
    priority = Column(SQLEnum("low", "medium", "high", "urgent"), default="medium")
    reason = Column(Text)
    symptoms = Column(JSON)
    notes = Column(Text)
    cancellation_reason = Column(String(500))
    rescheduled_from = Column(CHAR(36))
    is_emergency = Column(Boolean, default=False)
    is_first_visit = Column(Boolean, default=True)
    video_call_url = Column(String(500))
    meeting_link = Column(String(500))
    room_id = Column(String(100))
    fee = Column(DECIMAL(10, 2), default=0)
    payment_status = Column(SQLEnum("pending", "paid", "unpaid", "insurance"), default="pending")


# ============================================
# PRESCRIPTIONS
# ============================================
class Prescription(Base, BaseModel):
    __tablename__ = "prescriptions"

    appointment_id = Column(CHAR(36), ForeignKey("appointments.id"), nullable=True, index=True)
    doctor_id = Column(CHAR(36), ForeignKey("doctor_profiles.id"), nullable=False, index=True)
    patient_id = Column(CHAR(36), ForeignKey("users.id"), nullable=False, index=True)
    hospital_id = Column(CHAR(36), ForeignKey("hospitals.id"), nullable=True)
    diagnosis = Column(Text)
    symptoms = Column(JSON)
    advice = Column(Text)
    notes = Column(Text)
    follow_up_date = Column(Date)
    valid_until = Column(Date)
    is_digital = Column(Boolean, default=True)
    digital_signature = Column(String(500))
    pdf_url = Column(String(500))
    status = Column(SQLEnum("active", "completed", "expired"), default="active")


# ============================================
# PRESCRIPTION ITEMS (Medications)
# ============================================
class PrescriptionItem(Base, BaseModel):
    __tablename__ = "prescription_items"

    prescription_id = Column(CHAR(36), ForeignKey("prescriptions.id", ondelete="CASCADE"), nullable=False, index=True)
    medicine_name = Column(String(255), nullable=False)
    dosage = Column(String(100), nullable=False)
    frequency = Column(String(100), nullable=False)
    duration = Column(String(100))
    timing = Column(SQLEnum("before-food", "after-food", "with-food", "empty-stomach"))
    route = Column(String(50), default="oral")
    quantity = Column(Integer, default=1)
    refills = Column(Integer, default=0)
    instructions = Column(Text)
    is_otc = Column(Boolean, default=False)


# ============================================
# PRESCRIPTION TESTS (Lab Tests)
# ============================================
class PrescriptionTest(Base, BaseModel):
    __tablename__ = "prescription_tests"

    prescription_id = Column(CHAR(36), ForeignKey("prescriptions.id", ondelete="CASCADE"), nullable=False, index=True)
    test_name = Column(String(255), nullable=False)
    test_type = Column(String(100))
    instructions = Column(Text)
    is_urgent = Column(Boolean, default=False)
    result_url = Column(String(500))
