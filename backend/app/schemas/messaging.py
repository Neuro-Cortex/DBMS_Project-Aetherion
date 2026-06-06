from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class MessageCreateRequest(BaseModel):
    receiver_id: str = Field(...)
    message_body: str = Field(..., min_length=1, max_length=5000)
    message_type: str = Field(default="text")
    appointment_id: Optional[str] = None
    file_url: Optional[str] = None
    file_name: Optional[str] = None


class MessageResponse(BaseModel):
    id: str
    sender_id: str
    receiver_id: str
    appointment_id: Optional[str] = None
    message_body: Optional[str] = None
    message_type: Optional[str] = None
    file_url: Optional[str] = None
    file_name: Optional[str] = None
    is_read: bool = False
    created_at: Optional[datetime] = None
    # Joined
    sender_name: Optional[str] = None
    receiver_name: Optional[str] = None

    model_config = {"from_attributes": True}


class NotificationResponse(BaseModel):
    id: str
    user_id: str
    type: Optional[str] = None
    title: str
    body: Optional[str] = None
    data: Optional[dict] = None
    action_url: Optional[str] = None
    priority: Optional[str] = None
    is_read: bool = False
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class NotificationCreateRequest(BaseModel):
    user_id: str = Field(...)
    type: str = Field(...)
    title: str = Field(..., max_length=255)
    body: Optional[str] = None
    data: Optional[dict] = None
    action_url: Optional[str] = None
    priority: str = Field(default="medium")
