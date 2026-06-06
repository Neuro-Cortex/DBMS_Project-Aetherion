from sqlalchemy import (
    Column, String, Integer, Boolean, DECIMAL, JSON, Text, Date,
    Enum as SQLEnum, ForeignKey, Index
)
from sqlalchemy.dialects.mysql import CHAR
from ..core.database import Base
from .base import BaseModel


# ============================================
# DOCTOR PROFILES
# ============================================
class DoctorProfile(Base, BaseModel):
    __tablename__ = "doctor_profiles"

    user_id = Column(CHAR(36), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    specialization = Column(String(150), nullable=False)
    sub_specializations = Column(JSON)
    license_number = Column(String(100), unique=True, nullable=False)
    medical_council = Column(String(150))
    experience_years = Column(Integer, default=0)
    qualifications = Column(JSON, nullable=False)
    consultation_fee = Column(DECIMAL(10, 2), default=0)
    follow_up_fee = Column(DECIMAL(10, 2), default=0)
    video_consultation_fee = Column(DECIMAL(10, 2), default=0)
    hospital_affiliation = Column(String(255))
    department = Column(String(100))
    designation = Column(String(100))
    languages = Column(JSON)
    is_verified = Column(Boolean, default=False)
    verified_by = Column(CHAR(36), ForeignKey("users.id"))
    rating = Column(DECIMAL(2, 1), default=0.0)
    review_count = Column(Integer, default=0)
    total_patients = Column(Integer, default=0)
    total_consultations = Column(Integer, default=0)
    success_rate = Column(DECIMAL(5, 2), default=0.00)
    about = Column(Text)
    profile_image = Column(String(500))
    cover_image = Column(String(500))
    achievements = Column(JSON)
    awards = Column(JSON)
    publications = Column(JSON)
    memberships = Column(JSON)
    status = Column(SQLEnum("online", "offline", "busy"), default="offline")
    is_online = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    max_patients_per_day = Column(Integer, default=30)
    consultation_duration = Column(Integer, default=15)
    consultation_modes = Column(JSON)


# ============================================
# DOCTOR AVAILABILITY (Weekly Schedule)
# ============================================
class DoctorAvailability(Base, BaseModel):
    __tablename__ = "doctor_availability"

    doctor_id = Column(CHAR(36), ForeignKey("doctor_profiles.id", ondelete="CASCADE"), nullable=False, index=True)
    day_of_week = Column(Integer, nullable=False, comment="0=Sun,1=Mon,...,6=Sat")
    start_time = Column(String(10), nullable=False)
    end_time = Column(String(10), nullable=False)
    max_patients = Column(Integer, default=10)
    current_patients = Column(Integer, default=0)
    is_available = Column(Boolean, default=True)

    __table_args__ = (Index("ix_doctor_availability_doctor_day", "doctor_id", "day_of_week"),)


# ============================================
# DOCTOR EARNINGS
# ============================================
class DoctorEarning(Base, BaseModel):
    __tablename__ = "doctor_earnings"

    doctor_id = Column(CHAR(36), ForeignKey("doctor_profiles.id", ondelete="CASCADE"), nullable=False, index=True)
    earning_date = Column(Date, nullable=False)
    consultations = Column(Integer, default=0)
    video_consultations = Column(Integer, default=0)
    follow_ups = Column(Integer, default=0)
    total_amount = Column(DECIMAL(12, 2), default=0)

    __table_args__ = (Index("ix_doctor_earnings_doctor_date", "doctor_id", "earning_date", unique=True),)


# ============================================
# DOCTOR-PATIENT RELATIONSHIP
# ============================================
class DoctorPatient(Base, BaseModel):
    __tablename__ = "doctor_patients"

    doctor_id = Column(CHAR(36), ForeignKey("doctor_profiles.id", ondelete="CASCADE"), nullable=False, index=True)
    patient_id = Column(CHAR(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    total_visits = Column(Integer, default=0)
    last_visit = Column(Date)
    is_active = Column(Boolean, default=True)

    __table_args__ = (Index("ix_doctor_patient_unique", "doctor_id", "patient_id", unique=True),)


# ============================================
# DOCTOR NOTIFICATIONS
# ============================================
class DoctorNotification(Base, BaseModel):
    __tablename__ = "doctor_notifications"

    doctor_id = Column(CHAR(36), ForeignKey("doctor_profiles.id", ondelete="CASCADE"), nullable=False, index=True)
    type = Column(SQLEnum("appointment", "emergency", "prescription", "review", "system", "patient", "earnings"), nullable=False)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False)
    action_url = Column(String(500))
    priority = Column(SQLEnum("low", "medium", "high", "urgent"), default="medium")


# ============================================
# DOCTOR ACTIVITIES
# ============================================
class DoctorActivity(Base, BaseModel):
    __tablename__ = "doctor_activities"

    doctor_id = Column(CHAR(36), ForeignKey("doctor_profiles.id", ondelete="CASCADE"), nullable=False, index=True)
    type = Column(SQLEnum("appointment", "prescription", "consultation", "review", "emergency"), nullable=False)
    description = Column(Text, nullable=False)
    patient_name = Column(String(150))
    status = Column(SQLEnum("completed", "pending", "cancelled"), default="completed")
