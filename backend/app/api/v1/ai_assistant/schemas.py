"""
AI Assistant schemas
"""
from pydantic import BaseModel, Field
from typing import Optional, List, Dict

class SymptomCheckRequest(BaseModel):
    symptoms: List[str]
    duration_days: Optional[int] = None
    severity: Optional[str] = None
    additional_info: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None

class SymptomCheckResponse(BaseModel):
    possible_conditions: List[Dict]
    recommendations: List[str]
    urgency_level: str
    suggested_specialist: Optional[str]
    should_see_doctor: bool

class HealthRecommendationRequest(BaseModel):
    health_goals: Optional[List[str]] = []
    current_conditions: Optional[List[str]] = []
    preferences: Optional[Dict] = {}

class HealthRecommendationResponse(BaseModel):
    diet_recommendations: List[str]
    exercise_suggestions: List[str]
    lifestyle_tips: List[str]
    foods_to_eat: List[str]
    foods_to_avoid: List[str]

class MedicineRecommendationRequest(BaseModel):
    symptoms: List[str]
    allergies: Optional[List[str]] = []
    current_medications: Optional[List[str]] = []
    age: Optional[int] = None
    pregnancy_status: Optional[bool] = False

class MedicineRecommendationResponse(BaseModel):
    recommended_medicines: List[Dict]
    warnings: List[str]
    drug_interactions: List[str]
    disclaimer: str

class DrugInteractionCheck(BaseModel):
    medicines: List[str]

class DrugInteractionResponse(BaseModel):
    interactions: List[Dict]
    severity: str
    recommendations: List[str]

class ChatbotMessage(BaseModel):
    message: str
    context: Optional[Dict] = {}
    language: Optional[str] = "en"

class ChatbotResponse(BaseModel):
    reply: str
    suggestions: Optional[List[str]] = []
    actions: Optional[List[Dict]] = []
    confidence: float