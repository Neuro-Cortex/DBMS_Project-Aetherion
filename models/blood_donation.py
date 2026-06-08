from sqlalchemy import (
    Column, String, Integer, Date, Text, Boolean, DECIMAL, JSON,
    Enum as SQLEnum, ForeignKey, Index
)
from sqlalchemy.dialects.mysql import CHAR
from ..core.database import Base
from .base import BaseModel


# ============================================
# BLOOD DONORS
# ============================================
class BloodDonor(Base, BaseModel):
    __tablename__ = "blood_donors"

    user_id = Column(CHAR(36), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    blood_group = Column(SQLEnum("A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"), nullable=False, index=True)
    age = Column(Integer)
    weight_kg = Column(DECIMAL(5, 1))
    gender = Column(SQLEnum("male", "female", "other"))
    last_donation_date = Column(Date)
    total_donations = Column(Integer, default=0)
    next_eligible_date = Column(Date)
    is_eligible = Column(Boolean, default=True)
    is_available = Column(Boolean, default=True)
    is_emergency_donor = Column(Boolean, default=False)
    medical_conditions = Column(JSON)
    is_on_medication = Column(Boolean, default=False)
    current_medications = Column(JSON)
    has_tattoo = Column(Boolean, default=False)
    has_piercing = Column(Boolean, default=False)
    has_traveled_abroad = Column(Boolean, default=False)
    status = Column(SQLEnum("pending", "approved", "rejected", "blocked", "active", "inactive", "temporary-deferred", "permanent-deferred"), default="pending", index=True)
    reward_points = Column(Integer, default=0)
    lives_saved = Column(Integer, default=0)
    donated_units = Column(Integer, default=0)
    deferral_reason = Column(Text)
    deferral_until = Column(Date)


# ============================================
# BLOOD DONATIONS
# ============================================
class BloodDonation(Base, BaseModel):
    __tablename__ = "blood_donations"

    donor_id = Column(CHAR(36), ForeignKey("blood_donors.id", ondelete="CASCADE"), nullable=False, index=True)
    donation_date = Column(Date, nullable=False, index=True)
    blood_group = Column(SQLEnum("A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"), nullable=False)
    units = Column(Integer, nullable=False)
    donation_type = Column(SQLEnum("whole-blood", "plasma", "platelets", "double-red-cells"), default="whole-blood")
    location = Column(String(255))
    hospital_name = Column(String(255))
    blood_bank_name = Column(String(255))
    certificate_id = Column(String(100))
    certificate_url = Column(String(500))
    reward_points_earned = Column(Integer, default=0)
    verified_by = Column(CHAR(36), ForeignKey("users.id"))
    notes = Column(Text)


# ============================================
# BLOOD REQUESTS
# ============================================
class BloodRequest(Base, BaseModel):
    __tablename__ = "blood_requests"

    request_number = Column(String(50), unique=True, nullable=False)
    requested_by = Column(CHAR(36), ForeignKey("users.id"), nullable=False, index=True)
    hospital_id = Column(CHAR(36), ForeignKey("hospitals.id"), nullable=True)
    patient_name = Column(String(150), nullable=False)
    patient_age = Column(Integer)
    blood_group = Column(SQLEnum("A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"), nullable=False, index=True)
    units_required = Column(Integer, nullable=False)
    urgency = Column(SQLEnum("normal", "urgent", "emergency"), default="normal", index=True)
    reason = Column(Text)
    doctor_name = Column(String(150))
    status = Column(SQLEnum("pending", "approved", "processing", "fulfilled", "rejected", "cancelled"), default="pending", index=True)
    approved_by = Column(CHAR(36), ForeignKey("users.id"), nullable=True)
    fulfilled_by = Column(CHAR(36), ForeignKey("users.id"), nullable=True)
    required_by_date = Column(Date)


# ============================================
# BLOOD DONATION CAMPS
# ============================================
class BloodDonationCamp(Base, BaseModel):
    __tablename__ = "blood_donation_camps"

    name = Column(String(255), nullable=False)
    organizer = Column(String(255))
    camp_date = Column(Date, nullable=False, index=True)
    start_time = Column(String(10))
    end_time = Column(String(10))
    location = Column(String(255))
    address = Column(Text)
    latitude = Column(DECIMAL(10, 7))
    longitude = Column(DECIMAL(10, 7))
    expected_donors = Column(Integer, default=0)
    registered_donors = Column(Integer, default=0)
    blood_groups_needed = Column(JSON)
    facilities = Column(JSON)
    contact_phone = Column(String(20))
    status = Column(SQLEnum("upcoming", "ongoing", "completed"), default="upcoming")


# ============================================
# DONOR REWARDS
# ============================================
class DonorReward(Base, BaseModel):
    __tablename__ = "donor_rewards"

    donor_id = Column(CHAR(36), ForeignKey("blood_donors.id", ondelete="CASCADE"), nullable=False, index=True)
    type = Column(SQLEnum("points", "badge", "certificate", "gift-card"), nullable=False)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    points = Column(Integer, default=0)
    earned_date = Column(Date, nullable=False)
    expiry_date = Column(Date, nullable=True)
    status = Column(SQLEnum("active", "used", "expired"), default="active")


# ============================================
# DONOR DOCUMENTS
# ============================================
class DonorDocument(Base, BaseModel):
    __tablename__ = "donor_documents"

    donor_id = Column(CHAR(36), ForeignKey("blood_donors.id", ondelete="CASCADE"), nullable=False, index=True)
    type = Column(SQLEnum("id-proof", "medical-certificate", "donation-certificate", "other"), nullable=False)
    name = Column(String(255), nullable=False)
    file_url = Column(String(500), nullable=False)
    verified = Column(Boolean, default=False)


# ============================================
# DONATION REMINDERS
# ============================================
class DonationReminder(Base, BaseModel):
    __tablename__ = "donation_reminders"

    donor_id = Column(CHAR(36), ForeignKey("blood_donors.id", ondelete="CASCADE"), nullable=False, index=True)
    next_eligible_date = Column(Date, nullable=False)
    reminder_date = Column(Date, nullable=False)
    status = Column(SQLEnum("pending", "sent", "cancelled"), default="pending")
    type = Column(SQLEnum("email", "sms", "push"), default="email")
    message = Column(Text)
