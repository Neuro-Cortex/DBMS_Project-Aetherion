"""
Oxygen network model for tracking oxygen supply
"""
from datetime import datetime
from typing import Optional, List
import uuid
from sqlalchemy import String, Integer, Text, Float, Boolean, Enum, JSON, ForeignKey, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base, TimestampMixin, UUIDMixin

class OxygenStock(Base, UUIDMixin, TimestampMixin):
    """Oxygen stock tracking"""
    
    __tablename__ = "oxygen_stock"
    
    hospital_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("hospital_profiles.id"), nullable=False
    )
    
    # Stock Information
    total_capacity_liters: Mapped[int] = mapped_column(Integer, nullable=False)
    available_liters: Mapped[int] = mapped_column(Integer, nullable=False)
    total_cylinders: Mapped[int] = mapped_column(Integer, default=0)
    available_cylinders: Mapped[int] = mapped_column(Integer, default=0)
    
    # Cylinder Types
    large_cylinders: Mapped[int] = mapped_column(Integer, default=0)
    medium_cylinders: Mapped[int] = mapped_column(Integer, default=0)
    small_cylinders: Mapped[int] = mapped_column(Integer, default=0)
    portable_cylinders: Mapped[int] = mapped_column(Integer, default=0)
    
    # Status
    is_critical_low: Mapped[bool] = mapped_column(Boolean, default=False)
    last_refill_date: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    next_refill_due: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    
    # Thresholds
    minimum_threshold_liters: Mapped[int] = mapped_column(Integer, default=1000)
    emergency_reserve_liters: Mapped[int] = mapped_column(Integer, default=500)
    
    @property
    def available_percentage(self) -> float:
        """Calculate available percentage"""
        if self.total_capacity_liters > 0:
            return (self.available_liters / self.total_capacity_liters) * 100
        return 0
    
    @property
    def needs_refill(self) -> bool:
        """Check if refill is needed"""
        return self.available_liters <= self.minimum_threshold_liters

class OxygenRequest(Base, UUIDMixin, TimestampMixin):
    """Oxygen request management"""
    
    __tablename__ = "oxygen_requests"
    
    requester_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=False
    )
    hospital_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True), ForeignKey("hospital_profiles.id"), nullable=True
    )
    
    # Request Details
    oxygen_type: Mapped[str] = mapped_column(String(100), nullable=False)
    quantity_liters: Mapped[int] = mapped_column(Integer, nullable=False)
    cylinders_count: Mapped[int] = mapped_column(Integer, default=0)
    is_emergency: Mapped[bool] = mapped_column(Boolean, default=False)
    
    # Location
    latitude: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    longitude: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    address: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    # Status
    status: Mapped[str] = mapped_column(String(50), default="pending")
    fulfilled_by: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True), ForeignKey("oxygen_stock.id"), nullable=True
    )
    fulfilled_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    
    # Delivery
    delivery_required: Mapped[bool] = mapped_column(Boolean, default=False)
    delivery_address: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    delivery_status: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    
    # Notes
    patient_condition: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    # Relationships
    hospital: Mapped["HospitalProfile"] = relationship(
        "HospitalProfile", back_populates="oxygen_requests"
    )

class OxygenSupplier(Base, UUIDMixin, TimestampMixin):
    """Oxygen supplier management"""
    
    __tablename__ = "oxygen_suppliers"
    
    name: Mapped[str] = mapped_column(String(500), nullable=False)
    contact_person: Mapped[str] = mapped_column(String(200), nullable=False)
    phone: Mapped[str] = mapped_column(String(20), nullable=False)
    email: Mapped[str] = mapped_column(String(255), nullable=False)
    
    # Address
    address: Mapped[str] = mapped_column(Text, nullable=False)
    city: Mapped[str] = mapped_column(String(100), nullable=False)
    country: Mapped[str] = mapped_column(String(100), nullable=False)
    
    # Location
    latitude: Mapped[float] = mapped_column(Float, nullable=False)
    longitude: Mapped[float] = mapped_column(Float, nullable=False)
    
    # Capacity
    daily_capacity_liters: Mapped[int] = mapped_column(Integer, nullable=False)
    minimum_order_liters: Mapped[int] = mapped_column(Integer, default=100)
    
    # Status
    is_operational: Mapped[bool] = mapped_column(Boolean, default=True)
    delivery_available: Mapped[bool] = mapped_column(Boolean, default=False)
    delivery_radius_km: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    
    # Pricing
    price_per_liter: Mapped[float] = mapped_column(Float, nullable=False)
    emergency_surcharge_percentage: Mapped[float] = mapped_column(Float, default=0)