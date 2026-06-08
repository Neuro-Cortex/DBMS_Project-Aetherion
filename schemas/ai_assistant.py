from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class AIChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=5000)
    conversation_id: Optional[str] = None


class AIMessageResponse(BaseModel):
    id: str
    conversation_id: Optional[str] = None
    role: str
    content: str
    type: Optional[str] = None
    emotion: Optional[str] = None
    confidence: Optional[float] = None
    suggestions: Optional[List] = None
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class AIConversationResponse(BaseModel):
    id: str
    user_id: str
    title: Optional[str] = None
    status: Optional[str] = None
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class AIVoiceSessionResponse(BaseModel):
    id: str
    user_id: str
    transcript: Optional[str] = None
    audio_url: Optional[str] = None
    is_listening: bool = False
    is_speaking: bool = False
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}
