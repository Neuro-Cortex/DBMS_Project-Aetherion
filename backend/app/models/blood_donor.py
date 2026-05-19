"""
Blood donor model with donation tracking and rewards
"""
from datetime import datetime, date
from typing import Optional, List, Dict
import uuid
from sqlalchemy import String, Integer, Text, Float, Boolean, Enum, JSON, ForeignKey, Date, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base, TimestampMixin, UUIDMixin, BloodGroup

class BloodDonorProfile(Base, UUIDMixin, TimestampMixin):
    """Blood donor profile"""
    
    __tablename__ = "blood_donor_profiles"
    
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), unique=True, nullable=False
    )
    
    # Donor Information
    blood_group: Mapped[BloodGroup] = mapped_column(Enum(BloodGroup), nullable=False)
    last_donation_date: Mapped[Optional[datetime]] = mapped_column(Date, nullable=True)
    total_donations: Mapped[int] = mapped_column(Integer, default=0)
    total_volume_donated_ml: Mapped[int] = mapped_column(Integer, default=0)
    
    # Eligibility
    is_eligible: Mapped[bool] = mapped_column(Boolean, default=True)
    temporary_deferral_until: Mapped[Optional[datetime]] = mapped_column(Date, nullable=True)
    permanent_deferral_reason: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    # Medical Information
    medical_conditions: Mapped[Optional[List[str]]] = mapped_column(JSON, nullable=True)
    current_medications: Mapped[Optional[List[str]]] = mapped_column(JSON, nullable=True)
    weight_kg: Mapped[float] = mapped_column(Float, nullable=False)
    
    # Donation Preferences
    is_willing_emergency_donor: Mapped[bool] = mapped_column(Boolean, default=False)
    preferred_donation_center: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    notification_radius_km: Mapped[float] = mapped_column(Float, default=20.0)
    
    # Rewards
    reward_points: Mapped[int] = mapped_column(Integer, default=0)
    donor_level: Mapped[str] = mapped_column(String(50), default="beginner")  # beginner, bronze, silver, gold, platinum
    
    # Privacy
    is_anonymous: Mapped[bool] = mapped_column(Boolean, default=False)
    show_contact_to_recipients: Mapped[bool] = mapped_column(Boolean, default=False)
    
    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="blood_donor_profile")
    donations: Mapped[List["BloodDonation"]] = relationship(
        "BloodDonation", back_populates="donor", lazy="dynamic"
    )
    rewards_history: Mapped[List["DonorReward"]] = relationship(
        "DonorReward", back_populates="donor", lazy="dynamic"
    )
    
    @property
    def next_eligible_date(self) -> Optional[date]:
        """Calculate next eligible donation date (90 days after last donation)"""
        if self.last_donation_date:
            return self.last_donation_date + timedelta(days=90)
        return None
    
    @property
    def days_until_eligible(self) -> int:
        """Calculate days until next eligible donation"""
        if self.next_eligible_date:
            delta = self.next_eligible_date - date.today()
            return max(0, delta.days)
        return 0
    
    def update_donor_level(self):
        """Update donor level based on total donations"""
        if self.total_donations >= 50:
            self.donor_level = "platinum"
        elif self.total_donations >= 25:
            self.donor_level = "gold"
        elif self.total_donations >= 10:
            self.donor_level = "silver"
        elif self.total_donations >= 3:
            self.donor_level = "bronze"
        else:
            self.donor_level = "beginner"

class BloodDonation(Base, UUIDMixin, TimestampMixin):
    """Blood donation record"""
    
    __tablename__ = "blood_donations"
    
    donor_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("blood_donor_profiles.id"), nullable=False
    )
    hospital_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True), ForeignKey("hospital_profiles.id"), nullable=True
    )
    
    # Donation Details
    donation_date: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    blood_group: Mapped[BloodGroup] = mapped_column(Enum(BloodGroup), nullable=False)
    volume_ml: Mapped[int] = mapped_column(Integer, default=450)
    donation_type: Mapped[str] = mapped_column(String(50), default="whole_blood")
    
    # Location
    donation_center: Mapped[str] = mapped_column(String(500), nullable=False)
    center_address: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    # Verification
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False)
    verified_by: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=True
    )
    
    # Medical Screening
    hemoglobin_level: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    blood_pressure: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    pulse_rate: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    temperature: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    
    # Notes
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    complications: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    # Certificate
    certificate_number: Mapped[Optional[str]] = mapped_column(String(100), unique=True, nullable=True)
    certificate_url: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    # Relationships
    donor: Mapped["BloodDonorProfile"] = relationship("BloodDonorProfile", back_populates="donations")

class DonorReward(Base, UUIDMixin, TimestampMixin):
    """Donor reward points and badges"""
    
    __tablename__ = "donor_rewards"
    
    donor_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("blood_donor_profiles.id"), nullable=False
    )
    
    reward_type: Mapped[str] = mapped_column(String(100), nullable=False)  # points, badge, certificate
    points_earned: Mapped[int] = mapped_column(Integer, default=0)
    badge_name: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    awarded_for_donation_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True), ForeignKey("blood_donations.id"), nullable=True
    )
    
    # Relationships
    donor: Mapped["BloodDonorProfile"] = relationship("BloodDonorProfile", back_populates="rewards_history")

class BloodRequest(Base, UUIDMixin, TimestampMixin):
    """Blood donation request"""
    
    __tablename__ = "blood_requests"
    
    requester_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=False
    )
    hospital_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True), ForeignKey("hospital_profiles.id"), nullable=True
    )
    
    # Request Details
    blood_group: Mapped[BloodGroup] = mapped_column(Enum(BloodGroup), nullable=False)
    quantity_units: Mapped[int] = mapped_column(Integer, nullable=False)
    is_emergency: Mapped[bool] = mapped_column(Boolean, default=False)
    urgency_level: Mapped[str] = mapped_column(String(50), default="normal")
    
    # Location
    latitude: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    longitude: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    address: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    # Status
    status: Mapped[str] = mapped_column(String(50), default="pending")
    fulfilled_by: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=True
    )
    fulfilled_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    
    # Notes
    patient_condition: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    # Relationships
    hospital: Mapped["HospitalProfile"] = relationship(
        "HospitalProfile", back_populates="blood_requests"
    )