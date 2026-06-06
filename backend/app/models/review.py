from sqlalchemy import (
    Column, String, Integer, Text, Boolean,
    Enum as SQLEnum, ForeignKey, Index
)
from sqlalchemy.dialects.mysql import CHAR
from ..core.database import Base
from .base import BaseModel


# ============================================
# USER REVIEWS
# ============================================
class UserReview(Base, BaseModel):
    __tablename__ = "user_reviews"

    reviewer_id = Column(CHAR(36), ForeignKey("users.id"), nullable=False, index=True)
    reviewable_type = Column(SQLEnum("doctor", "hospital", "pharmacy", "medicine"), nullable=False, index=True)
    reviewable_id = Column(CHAR(36), nullable=False, index=True)
    rating = Column(Integer, nullable=False)
    title = Column(String(255))
    review_text = Column(Text)
    is_verified = Column(Boolean, default=False)

    __table_args__ = (Index("ix_review_entity", "reviewable_type", "reviewable_id"),)


# ============================================
# FEEDBACK
# ============================================
class Feedback(Base, BaseModel):
    __tablename__ = "feedback"

    user_id = Column(CHAR(36), ForeignKey("users.id"), nullable=False, index=True)
    user_name = Column(String(150))
    user_role = Column(String(50))
    type = Column(SQLEnum("complaint", "suggestion", "review", "bug-report"), nullable=False, index=True)
    subject = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    rating = Column(Integer)
    status = Column(SQLEnum("pending", "reviewed", "resolved", "closed"), default="pending", index=True)
    priority = Column(SQLEnum("low", "medium", "high", "urgent"), default="medium")
    resolved_by = Column(CHAR(36), ForeignKey("users.id"), nullable=True)
    response = Column(Text)
