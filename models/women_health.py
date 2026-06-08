from sqlalchemy import (
    Column, String, Integer, Date, Text, Boolean, DECIMAL, JSON,
    Enum as SQLEnum, ForeignKey, Index
)
from sqlalchemy.dialects.mysql import CHAR
from ..core.database import Base
from .base import BaseModel


# ============================================
# WOMEN MENSTRUAL CYCLES
# ============================================
class WomenMenstrualCycle(Base, BaseModel):
    __tablename__ = "women_menstrual_cycles"

    user_id = Column(CHAR(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date)
    cycle_length = Column(Integer)
    period_length = Column(Integer)
    flow_intensity = Column(SQLEnum("light", "medium", "heavy", "very_heavy"))
    is_regular = Column(Boolean, default=True)
    symptoms = Column(JSON)
    mood = Column(String(100))
    notes = Column(Text)
    is_prediction = Column(Boolean, default=False)
    next_period_date = Column(Date)
    ovulation_date = Column(Date)
    fertile_window_start = Column(Date)
    fertile_window_end = Column(Date)
    reminder_enabled = Column(Boolean, default=False)
    reminder_days = Column(Integer, default=2)


# ============================================
# WOMEN PREGNANCIES
# ============================================
class WomenPregnancy(Base, BaseModel):
    __tablename__ = "women_pregnancies"

    user_id = Column(CHAR(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    lmp_date = Column(Date, nullable=False, comment="Last Menstrual Period")
    estimated_due_date = Column(Date, nullable=False)
    current_week = Column(Integer)
    current_trimester = Column(SQLEnum("first", "second", "third"))
    pregnancy_number = Column(Integer, default=1)
    is_first_pregnancy = Column(Boolean, default=True)
    previous_pregnancies = Column(Integer, default=0)
    high_risk = Column(Boolean, default=False)
    risk_notes = Column(Text)
    assigned_doctor_id = Column(CHAR(36), ForeignKey("doctor_profiles.id"), nullable=True)
    baby_gender = Column(SQLEnum("boy", "girl", "unknown"), default="unknown")
    baby_name = Column(String(150))
    status = Column(SQLEnum("active", "ongoing", "completed", "miscarriage", "terminated", "high-risk"), default="active")
    complications = Column(JSON)
    delivery_date = Column(Date)
    delivery_type = Column(SQLEnum("normal", "c-section", "assisted"))
    notes = Column(Text)


# ============================================
# WOMEN PREGNANCY TRACKING
# ============================================
class WomenPregnancyTracking(Base, BaseModel):
    __tablename__ = "women_pregnancy_tracking"

    pregnancy_id = Column(CHAR(36), ForeignKey("women_pregnancies.id", ondelete="CASCADE"), nullable=False, index=True)
    week_number = Column(Integer, nullable=False)
    weight_kg = Column(DECIMAL(5, 1))
    blood_pressure_systolic = Column(Integer)
    blood_pressure_diastolic = Column(Integer)
    blood_sugar = Column(DECIMAL(5, 1))
    hemoglobin = Column(DECIMAL(4, 1))
    fetal_movement_count = Column(Integer)
    symptoms = Column(JSON)
    notes = Column(Text)
    recorded_at = Column(Date, nullable=False)


# ============================================
# BABY VACCINES
# ============================================
class BabyVaccine(Base, BaseModel):
    __tablename__ = "baby_vaccines"

    baby_name = Column(String(150), nullable=False)
    mother_id = Column(CHAR(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    date_of_birth = Column(Date, nullable=False)
    gender = Column(SQLEnum("boy", "girl"))
    blood_group = Column(SQLEnum("A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"))


# ============================================
# BABY VACCINE RECORDS
# ============================================
class BabyVaccineRecord(Base, BaseModel):
    __tablename__ = "baby_vaccine_records"

    baby_id = Column(CHAR(36), ForeignKey("baby_vaccines.id", ondelete="CASCADE"), nullable=False, index=True)
    vaccine_name = Column(String(255), nullable=False)
    disease = Column(String(255))
    dose_number = Column(Integer, default=1)
    scheduled_date = Column(Date, nullable=False)
    administered_date = Column(Date)
    administered_by = Column(String(255))
    hospital_name = Column(String(255))
    batch_number = Column(String(100))
    status = Column(SQLEnum("scheduled", "completed", "missed", "delayed"), default="scheduled")
    next_dose_date = Column(Date)
    side_effects = Column(Text)
    certificate_url = Column(String(500))


# ============================================
# BABY GROWTH RECORDS
# ============================================
class BabyGrowthRecord(Base, BaseModel):
    __tablename__ = "baby_growth_records"

    baby_id = Column(CHAR(36), ForeignKey("baby_vaccines.id", ondelete="CASCADE"), nullable=False, index=True)
    record_date = Column(Date, nullable=False)
    age_months = Column(Integer, nullable=False)
    weight_kg = Column(DECIMAL(5, 2))
    height_cm = Column(DECIMAL(5, 1))
    head_circumference_cm = Column(DECIMAL(4, 1))
    bmi = Column(DECIMAL(5, 2))
    percentile = Column(DECIMAL(5, 2))
    notes = Column(Text)


# ============================================
# BABY HEALTH RECORDS
# ============================================
class BabyHealthRecord(Base, BaseModel):
    __tablename__ = "baby_health_records"

    baby_id = Column(CHAR(36), ForeignKey("baby_vaccines.id", ondelete="CASCADE"), nullable=False, index=True)
    date = Column(Date, nullable=False)
    age_months = Column(Integer)
    type = Column(SQLEnum("checkup", "illness", "vaccination", "emergency"), nullable=False)
    description = Column(Text, nullable=False)
    diagnosis = Column(Text)
    treatment = Column(Text)
    doctor_name = Column(String(150))
    hospital_name = Column(String(255))
    attachments = Column(JSON)


# ============================================
# GYNECOLOGIST CONSULTATIONS
# ============================================
class GynecologistConsultation(Base, BaseModel):
    __tablename__ = "gynecologist_consultations"

    user_id = Column(CHAR(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    doctor_name = Column(String(150), nullable=False)
    doctor_specialization = Column(String(100))
    hospital_name = Column(String(255))
    date = Column(Date, nullable=False)
    time = Column(String(10))
    type = Column(SQLEnum("in-person", "video", "phone"), default="in-person")
    reason = Column(Text)
    diagnosis = Column(Text)
    prescription = Column(Text)
    reports = Column(JSON)
    follow_up_date = Column(Date)
    status = Column(SQLEnum("scheduled", "completed", "cancelled"), default="scheduled")
    notes = Column(Text)
