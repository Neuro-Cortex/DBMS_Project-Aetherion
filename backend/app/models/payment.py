"""
Payment and transaction models
"""
from datetime import datetime
from typing import Optional, Dict
import uuid
from sqlalchemy import String, Integer, Text, Float, Boolean, Enum, JSON, ForeignKey, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base, TimestampMixin, UUIDMixin, PaymentStatus

class Payment(Base, UUIDMixin, TimestampMixin):
    """Payment transactions"""
    
    __tablename__ = "payments"
    
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=False
    )
    
    # Payment Details
    amount: Mapped[float] = mapped_column(Float, nullable=False)
    currency: Mapped[str] = mapped_column(String(10), default="USD")
    payment_method: Mapped[str] = mapped_column(String(100), nullable=False)
    status: Mapped[PaymentStatus] = mapped_column(
        Enum(PaymentStatus), default=PaymentStatus.PENDING
    )
    
    # Transaction
    transaction_id: Mapped[Optional[str]] = mapped_column(
        String(255), unique=True, nullable=True
    )
    gateway_response: Mapped[Optional[Dict]] = mapped_column(JSON, nullable=True)
    
    # Payment For
    payment_type: Mapped[str] = mapped_column(String(100), nullable=False)
    reference_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), nullable=False)
    
    # Refund
    refund_amount: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    refund_reason: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    refunded_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)

class PaymentMethod(Base, UUIDMixin, TimestampMixin):
    """Saved payment methods"""
    
    __tablename__ = "payment_methods"
    
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=False
    )
    
    method_type: Mapped[str] = mapped_column(String(100), nullable=False)
    is_default: Mapped[bool] = mapped_column(Boolean, default=False)
    
    # Payment Details (encrypted)
    card_last_four: Mapped[Optional[str]] = mapped_column(String(4), nullable=True)
    card_brand: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    expiry_month: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    expiry_year: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    
    billing_address: Mapped[Optional[Dict]] = mapped_column(JSON, nullable=True)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False)

class InsuranceClaim(Base, UUIDMixin, TimestampMixin):
    """Insurance claims"""
    
    __tablename__ = "insurance_claims"
    
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=False
    )
    
    insurance_provider: Mapped[str] = mapped_column(String(500), nullable=False)
    policy_number: Mapped[str] = mapped_column(String(200), nullable=False)
    claim_amount: Mapped[float] = mapped_column(Float, nullable=False)
    approved_amount: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    
    status: Mapped[str] = mapped_column(String(50), default="submitted")
    claim_date: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    settlement_date: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    
    documents: Mapped[Optional[Dict]] = mapped_column(JSON, nullable=True)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)