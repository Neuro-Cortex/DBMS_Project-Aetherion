"""
Women health models for pregnancy, menstrual tracking, and child care
"""
from datetime import datetime, date
from typing import Optional, List, Dict
import uuid
from sqlalchemy import String, Integer, Text, Float, Boolean, Enum, JSON, ForeignKey, Date, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base, TimestampMixin, UUIDMixin

class WomenHealthProfile(Base, UUIDMixin, TimestampMixin):
    """Women health profile"""
    
    __tablename__ = "women_health_profiles"
    
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), unique=True, nullable=False
    )
    
    # General Information
    last_menstrual_period: Mapped[Optional[datetime]] = mapped_column(Date, nullable=True)
    cycle_length_days: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    period_duration_days: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    
    # Pregnancy Status
    is_pregnant: Mapped[bool] = mapped_column(Boolean, default=False)
    expected_delivery_date: Mapped[Optional[datetime]] = mapped_column(Date, nullable=True)
    pregnancy_week: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    
    # Medical History
    previous_pregnancies: Mapped[int] = mapped_column(Integer, default=0)
    previous_deliveries: Mapped[int] = mapped_column(Integer, default=0)
    complications_history: Mapped[Optional[List[str]]] = mapped_column(JSON, nullable=True)
    
    # Current Medications
    prenatal_vitamins: Mapped[Optional[bool]] = mapped_column(Boolean, default=False)
    medications: Mapped[Optional[List[str]]] = mapped_column(JSON, nullable=True)
    
    # Relationships
    pregnancy_records: Mapped[List["PregnancyRecord"]] = relationship(
        "PregnancyRecord", back_populates="profile", lazy="dynamic"
    )
    menstrual_logs: Mapped[List["MenstrualLog"]] = relationship(
        "MenstrualLog", back_populates="profile", lazy="dynamic"
    )
    gynecologist_visits: Mapped[List["GynecologistVisit"]] = relationship(
        "GynecologistVisit", back_populates="profile", lazy="dynamic"
    )
    baby_records: Mapped[List["BabyRecord"]] = relationship(
        "BabyRecord", back_populates="mother_profile", lazy="dynamic"
    )

class PregnancyRecord(Base, UUIDMixin, TimestampMixin):
    """Pregnancy tracking record"""
    
    __tablename__ = "pregnancy_records"
    
    profile_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("women_health_profiles.id"), nullable=False
    )
    
    # Pregnancy Details
    pregnancy_number: Mapped[int] = mapped_column(Integer, nullable=False)
    start_date: Mapped[datetime] = mapped_column(Date, nullable=False)
    expected_delivery_date: Mapped[datetime] = mapped_column(Date, nullable=False)
    actual_delivery_date: Mapped[Optional[datetime]] = mapped_column(Date, nullable=True)
    
    # Status
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    trimester: Mapped[int] = mapped_column(Integer, default=1)
    
    # Health Metrics
    weight_gain_kg: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    blood_pressure_readings: Mapped[Optional[List[Dict]]] = mapped_column(JSON, nullable=True)
    
    # Appointments
    next_appointment: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    total_appointments: Mapped[int] = mapped_column(Integer, default=0)
    missed_appointments: Mapped[int] = mapped_column(Integer, default=0)
    
    # Delivery Info
    delivery_type: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    delivery_complications: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    # Relationships
    profile: Mapped["WomenHealthProfile"] = relationship(
        "WomenHealthProfile", back_populates="pregnancy_records"
    )
    appointments: Mapped[List["PregnancyAppointment"]] = relationship(
        "PregnancyAppointment", back_populates="pregnancy", lazy="dynamic"
    )

class PregnancyAppointment(Base, UUIDMixin, TimestampMixin):
    """Pregnancy appointment tracking"""
    
    __tablename__ = "pregnancy_appointments"
    
    pregnancy_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("pregnancy_records.id"), nullable=False
    )
    doctor_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=True
    )
    
    appointment_date: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    appointment_type: Mapped[str] = mapped_column(String(100), nullable=False)
    status: Mapped[str] = mapped_column(String(50), default="scheduled")
    
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    test_results: Mapped[Optional[Dict]] = mapped_column(JSON, nullable=True)
    
    # Relationships
    pregnancy: Mapped["PregnancyRecord"] = relationship(
        "PregnancyRecord", back_populates="appointments"
    )

class MenstrualLog(Base, UUIDMixin, TimestampMixin):
    """Menstrual cycle tracking"""
    
    __tablename__ = "menstrual_logs"
    
    profile_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("women_health_profiles.id"), nullable=False
    )
    
    # Cycle Information
    period_start: Mapped[datetime] = mapped_column(Date, nullable=False)
    period_end: Mapped[Optional[datetime]] = mapped_column(Date, nullable=True)
    flow_intensity: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    
    # Symptoms
    symptoms: Mapped[Optional[List[str]]] = mapped_column(JSON, nullable=True)
    pain_level: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)  # 1-10
    mood: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    
    # Additional
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    is_fertile_window: Mapped[Optional[bool]] = mapped_column(Boolean, nullable=True)
    ovulation_date: Mapped[Optional[datetime]] = mapped_column(Date, nullable=True)
    
    # Relationships
    profile: Mapped["WomenHealthProfile"] = relationship(
        "WomenHealthProfile", back_populates="menstrual_logs"
    )
    
    @property
    def cycle_length(self) -> Optional[int]:
        """Calculate cycle length"""
        if self.period_start:
            # This would need previous period start to calculate
            return None
        return None

class GynecologistVisit(Base, UUIDMixin, TimestampMixin):
    """Gynecologist consultation records"""
    
    __tablename__ = "gynecologist_visits"
    
    profile_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("women_health_profiles.id"), nullable=False
    )
    doctor_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=True
    )
    
    visit_date: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    visit_type: Mapped[str] = mapped_column(String(200), nullable=False)
    diagnosis: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    prescription: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    next_visit: Mapped[Optional[datetime]] = mapped_column(Date, nullable=True)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    # Relationships
    profile: Mapped["WomenHealthProfile"] = relationship(
        "WomenHealthProfile", back_populates="gynecologist_visits"
    )

class BabyRecord(Base, UUIDMixin, TimestampMixin):
    """Baby/Child health records"""
    
    __tablename__ = "baby_records"
    
    mother_profile_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("women_health_profiles.id"), nullable=False
    )
    
    # Baby Information
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    date_of_birth: Mapped[datetime] = mapped_column(Date, nullable=False)
    gender: Mapped[str] = mapped_column(String(20), nullable=False)
    birth_weight_kg: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    birth_height_cm: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    
    # Growth Records
    growth_records: Mapped[Optional[List[Dict]]] = mapped_column(JSON, nullable=True)
    
    # Vaccination
    vaccination_records: Mapped[Optional[List[Dict]]] = mapped_column(JSON, nullable=True)
    next_vaccination_date: Mapped[Optional[datetime]] = mapped_column(Date, nullable=True)
    
    # Relationships
    mother_profile: Mapped["WomenHealthProfile"] = relationship(
        "WomenHealthProfile", back_populates="baby_records"
    )