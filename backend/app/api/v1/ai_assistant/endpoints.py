"""
AI Assistant endpoints
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.services.ai_service import AIService
from app.api.v1.ai_assistant.schemas import (
    SymptomCheckRequest, HealthRecommendationRequest,
    MedicineRecommendationRequest, DrugInteractionCheck,
    ChatbotMessage
)

router = APIRouter()

@router.post("/symptom-checker")
async def check_symptoms(
    data: SymptomCheckRequest,
    current_user: Optional[User] = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    """AI symptom checker"""
    service = AIService(session)
    return await service.check_symptoms(data.dict())

@router.post("/health-recommendations")
async def get_health_recommendations(
    data: HealthRecommendationRequest,
    current_user: Optional[User] = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    """Get AI health recommendations"""
    service = AIService(session)
    return await service.get_health_recommendations(
        current_user.id if current_user else None,
        data.dict()
    )

@router.post("/medicine-recommendation")
async def recommend_medicine(
    data: MedicineRecommendationRequest,
    current_user: Optional[User] = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    """AI medicine recommendation"""
    service = AIService(session)
    return await service.recommend_medicine(data.dict())

@router.post("/drug-interaction-check")
async def check_drug_interactions(
    data: DrugInteractionCheck,
    session: AsyncSession = Depends(get_db)
):
    """Check drug interactions"""
    service = AIService(session)
    return await service.check_drug_interactions(data.medicines)

@router.post("/chatbot")
async def ai_chatbot(
    data: ChatbotMessage,
    current_user: Optional[User] = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    """AI health assistant chatbot"""
    service = AIService(session)
    return await service.chatbot_response(
        current_user.id if current_user else None,
        data.dict()
    )

@router.get("/recovery-prediction/{condition}")
async def predict_recovery(
    condition: str,
    age: Optional[int] = None,
    severity: Optional[str] = "moderate",
    session: AsyncSession = Depends(get_db)
):
    """Predict recovery time"""
    service = AIService(session)
    return await service.predict_recovery(condition, age, severity)

@router.post("/dosage-reminder")
async def set_dosage_reminder(
    medicine_name: str,
    dosage: str,
    frequency: str,
    duration_days: int,
    start_date: Optional[str] = None,
    notes: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    """Set AI dosage reminder"""
    service = AIService(session)
    return await service.set_dosage_reminder(
        current_user.id,
        medicine_name, dosage, frequency,
        duration_days, start_date, notes
    )

@router.get("/health-tips")
async def get_daily_health_tips(
    category: Optional[str] = None,
    session: AsyncSession = Depends(get_db)
):
    """Get AI-generated health tips"""
    service = AIService(session)
    return await service.get_health_tips(category)

@router.post("/emergency-chatbot")
async def emergency_chatbot(
    data: ChatbotMessage,
    session: AsyncSession = Depends(get_db)
):
    """Emergency AI support chatbot"""
    service = AIService(session)
    return await service.emergency_chatbot(data.dict())