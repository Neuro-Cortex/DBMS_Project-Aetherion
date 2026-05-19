"""
Admin schemas
"""
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime, date
from app.models.base import AccountStatus

class UserVerificationAction(BaseModel):
    user_id: str
    is_approved: bool
    notes: Optional[str] = None

class UserBlockAction(BaseModel):
    user_id: str
    reason: Optional[str] = None

class UserStatusUpdate(BaseModel):
    status: AccountStatus
    reason: Optional[str] = None

class ReportRequest(BaseModel):
    report_type: str
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    format: str = "json"  # json, csv, pdf

class SystemSettingsUpdate(BaseModel):
    setting_key: str
    setting_value: str
    description: Optional[str] = None

class FeedbackResponse(BaseModel):
    feedback_id: str
    response: str
    status: str = "resolved"

class BlogPostCreate(BaseModel):
    title: str
    content: str
    category: str
    author: str
    tags: Optional[List[str]] = []
    image_url: Optional[str] = None
    is_published: bool = False

class HealthTipCreate(BaseModel):
    title: str
    content: str
    category: str
    target_audience: Optional[str] = None
    is_active: bool = True