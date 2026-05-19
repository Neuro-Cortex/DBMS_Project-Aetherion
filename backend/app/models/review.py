"""
Review and rating models for doctors, hospitals, and medicines
"""
from datetime import datetime
from typing import Optional
import uuid
from sqlalchemy import String, Integer, Text, Float, Boolean, Enum, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base, TimestampMixin, UUIDMixin

class Review(Base, UUIDMixin, TimestampMixin):
    """Generic review system"""
    
    __tablename__ = "reviews"
    
    reviewer_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=False
    )
    
    # Review Target
    review_type: Mapped[str] = mapped_column(String(50), nullable=False)  # doctor, hospital, medicine
    target_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), nullable=False)
    
    # Rating
    rating: Mapped[float] = mapped_column(Float, nullable=False)  # 1-5
    title: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    comment: Mapped[str] = mapped_column(Text, nullable=False)
    
    # Status
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False)
    is_anonymous: Mapped[bool] = mapped_column(Boolean, default=False)
    is_edited: Mapped[bool] = mapped_column(Boolean, default=False)
    
    # Helpfulness
    helpful_count: Mapped[int] = mapped_column(Integer, default=0)
    not_helpful_count: Mapped[int] = mapped_column(Integer, default=0)
    
    # Response
    response_text: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    responded_by: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=True
    )
    responded_at: Mapped[Optional[datetime]] = mapped_column(nullable=True)
    
    # Relationships
    reviewer: Mapped["User"] = relationship("User", back_populates="reviews")