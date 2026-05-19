"""
Women health endpoints
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.services.women_health_service import WomenHealthService
from app.api.v1.women_health.schemas import (
    WomenHealthProfileCreate, PregnancyRecordCreate, PregnancyRecordUpdate,
    MenstrualLogCreate, GynecologistVisitCreate,
    BabyRecordCreate, BabyGrowthRecord, VaccineSchedule
)
import uuid

router = APIRouter()

@router.post("/profile")
async def create_women_health_profile(
    data: WomenHealthProfileCreate,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    """Create women health profile"""
    service = WomenHealthService(session)
    return await service.create_profile(current_user.id, data.dict())

@router.get("/profile")
async def get_women_health_profile(
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    """Get women health profile"""
    service = WomenHealthService(session)
    return await service.get_profile(current_user.id)

@router.put("/profile")
async def update_women_health_profile(
    data: WomenHealthProfileCreate,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    """Update women health profile"""
    service = WomenHealthService(session)
    return await service.update_profile(current_user.id, data.dict(exclude_unset=True))

@router.post("/pregnancy")
async def start_pregnancy_tracking(
    data: PregnancyRecordCreate,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    """Start pregnancy tracking"""
    service = WomenHealthService(session)
    return await service.start_pregnancy(current_user.id, data.dict())

@router.get("/pregnancy/current")
async def get_current_pregnancy(
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    """Get current pregnancy record"""
    service = WomenHealthService(session)
    return await service.get_current_pregnancy(current_user.id)

@router.put("/pregnancy/{pregnancy_id}")
async def update_pregnancy_record(
    pregnancy_id: uuid.UUID,
    data: PregnancyRecordUpdate,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    """Update pregnancy record"""
    service = WomenHealthService(session)
    return await service.update_pregnancy(
        current_user.id, pregnancy_id, data.dict(exclude_unset=True)
    )

@router.get("/pregnancy/history")
async def pregnancy_history(
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    """Get pregnancy history"""
    service = WomenHealthService(session)
    return await service.get_pregnancy_history(current_user.id)

@router.post("/menstrual/log")
async def log_menstrual_cycle(
    data: MenstrualLogCreate,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    """Log menstrual cycle"""
    service = WomenHealthService(session)
    return await service.log_menstrual_cycle(current_user.id, data.dict())

@router.get("/menstrual/logs")
async def get_menstrual_logs(
    current_user: User = Depends(get_current_user),
    skip: int = 0,
    limit: int = 12,
    session: AsyncSession = Depends(get_db)
):
    """Get menstrual logs"""
    service = WomenHealthService(session)
    return await service.get_menstrual_logs(current_user.id, skip, limit)

@router.get("/menstrual/prediction")
async def predict_next_period(
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    """Predict next period date"""
    service = WomenHealthService(session)
    return await service.predict_next_period(current_user.id)

@router.get("/menstrual/fertility-window")
async def get_fertility_window(
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    """Get fertility window"""
    service = WomenHealthService(session)
    return await service.get_fertility_window(current_user.id)

@router.post("/gynecologist-visits")
async def log_gynecologist_visit(
    data: GynecologistVisitCreate,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    """Log gynecologist visit"""
    service = WomenHealthService(session)
    return await service.log_gynecologist_visit(current_user.id, data.dict())

@router.get("/gynecologist-visits")
async def get_gynecologist_visits(
    current_user: User = Depends(get_current_user),
    skip: int = 0,
    limit: int = 20,
    session: AsyncSession = Depends(get_db)
):
    """Get gynecologist visits"""
    service = WomenHealthService(session)
    return await service.get_gynecologist_visits(current_user.id, skip, limit)

@router.post("/baby")
async def add_baby_record(
    data: BabyRecordCreate,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    """Add baby record"""
    service = WomenHealthService(session)
    return await service.add_baby_record(current_user.id, data.dict())

@router.get("/babies")
async def get_baby_records(
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    """Get baby records"""
    service = WomenHealthService(session)
    return await service.get_baby_records(current_user.id)

@router.post("/baby/{baby_id}/growth")
async def add_growth_record(
    baby_id: uuid.UUID,
    data: BabyGrowthRecord,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    """Add baby growth record"""
    service = WomenHealthService(session)
    return await service.add_growth_record(current_user.id, baby_id, data.dict())

@router.get("/baby/{baby_id}/growth")
async def get_growth_records(
    baby_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    """Get baby growth records"""
    service = WomenHealthService(session)
    return await service.get_growth_records(current_user.id, baby_id)

@router.post("/baby/{baby_id}/vaccines")
async def add_vaccine_schedule(
    baby_id: uuid.UUID,
    data: VaccineSchedule,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    """Add baby vaccine schedule"""
    service = WomenHealthService(session)
    return await service.add_vaccine_schedule(current_user.id, baby_id, data.dict())

@router.get("/baby/{baby_id}/vaccines")
async def get_vaccine_schedule(
    baby_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    """Get baby vaccine schedule"""
    service = WomenHealthService(session)
    return await service.get_vaccine_schedule(current_user.id, baby_id)

@router.get("/dashboard")
async def women_health_dashboard(
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    """Get women health dashboard"""
    service = WomenHealthService(session)
    return await service.get_dashboard(current_user.id)

@router.get("/emergency-pregnancy-support")
async def emergency_pregnancy_support(
    latitude: float = Query(...),
    longitude: float = Query(...),
    session: AsyncSession = Depends(get_db)
):
    """Get emergency pregnancy support nearby"""
    service = WomenHealthService(session)
    return await service.get_emergency_support(latitude, longitude)