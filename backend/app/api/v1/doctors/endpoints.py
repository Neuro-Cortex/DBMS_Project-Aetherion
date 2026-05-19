"""
Doctor API endpoints
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.api.deps import get_current_user, require_doctor
from app.models.user import User
from app.services.doctor_service import DoctorService
from app.api.v1.doctors.schemas import (
    DoctorProfileCreate, DoctorProfileUpdate,
    DoctorScheduleCreate, DoctorScheduleUpdate,
    ScheduleExceptionCreate, HospitalAffiliationCreate,
    DoctorSearchFilters
)
import uuid

router = APIRouter()

@router.post("/profile")
async def create_doctor_profile(
    data: DoctorProfileCreate,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    """Create doctor profile"""
    service = DoctorService(session)
    return await service.create_profile(current_user.id, data.dict())

@router.get("/profile/{doctor_id}")
async def get_doctor_profile(
    doctor_id: uuid.UUID,
    session: AsyncSession = Depends(get_db)
):
    """Get doctor profile"""
    service = DoctorService(session)
    return await service.get_profile(doctor_id)

@router.put("/profile")
async def update_doctor_profile(
    data: DoctorProfileUpdate,
    current_user: User = Depends(require_doctor),
    session: AsyncSession = Depends(get_db)
):
    """Update doctor profile"""
    service = DoctorService(session)
    return await service.update_profile(current_user.id, data.dict(exclude_unset=True))

@router.get("/search")
async def search_doctors(
    specialization: Optional[str] = None,
    city: Optional[str] = None,
    min_experience: Optional[int] = None,
    max_fee: Optional[float] = None,
    min_rating: Optional[float] = None,
    available_today: Optional[bool] = None,
    latitude: Optional[float] = None,
    longitude: Optional[float] = None,
    radius_km: float = 10,
    skip: int = 0,
    limit: int = 20,
    session: AsyncSession = Depends(get_db)
):
    """Search doctors with filters"""
    service = DoctorService(session)
    
    filters = {
        "specialization": specialization,
        "city": city,
        "min_experience": min_experience,
        "max_fee": max_fee,
        "min_rating": min_rating,
        "available_today": available_today
    }
    
    if latitude and longitude:
        return await service.search_nearby_doctors(
            latitude, longitude, radius_km, filters, skip, limit
        )
    
    return await service.search_doctors(filters, skip, limit)

@router.post("/schedule")
async def add_schedule(
    data: DoctorScheduleCreate,
    current_user: User = Depends(require_doctor),
    session: AsyncSession = Depends(get_db)
):
    """Add doctor schedule"""
    service = DoctorService(session)
    return await service.add_schedule(current_user.id, data.dict())

@router.get("/schedule/{doctor_id}")
async def get_doctor_schedule(
    doctor_id: uuid.UUID,
    session: AsyncSession = Depends(get_db)
):
    """Get doctor schedule"""
    service = DoctorService(session)
    return await service.get_schedule(doctor_id)

@router.put("/schedule/{schedule_id}")
async def update_schedule(
    schedule_id: uuid.UUID,
    data: DoctorScheduleUpdate,
    current_user: User = Depends(require_doctor),
    session: AsyncSession = Depends(get_db)
):
    """Update schedule"""
    service = DoctorService(session)
    return await service.update_schedule(
        current_user.id, schedule_id, data.dict(exclude_unset=True)
    )

@router.delete("/schedule/{schedule_id}")
async def delete_schedule(
    schedule_id: uuid.UUID,
    current_user: User = Depends(require_doctor),
    session: AsyncSession = Depends(get_db)
):
    """Delete schedule"""
    service = DoctorService(session)
    return await service.delete_schedule(current_user.id, schedule_id)

@router.post("/schedule/exceptions")
async def add_schedule_exception(
    data: ScheduleExceptionCreate,
    current_user: User = Depends(require_doctor),
    session: AsyncSession = Depends(get_db)
):
    """Add schedule exception"""
    service = DoctorService(session)
    return await service.add_schedule_exception(current_user.id, data.dict())

@router.post("/hospital-affiliations")
async def add_hospital_affiliation(
    data: HospitalAffiliationCreate,
    current_user: User = Depends(require_doctor),
    session: AsyncSession = Depends(get_db)
):
    """Add hospital affiliation"""
    service = DoctorService(session)
    return await service.add_hospital_affiliation(current_user.id, data.dict())

@router.get("/{doctor_id}/patients")
async def get_doctor_patients(
    doctor_id: uuid.UUID,
    skip: int = 0,
    limit: int = 20,
    current_user: User = Depends(require_doctor),
    session: AsyncSession = Depends(get_db)
):
    """Get doctor's patients"""
    service = DoctorService(session)
    return await service.get_patients(doctor_id, skip, limit)

@router.get("/{doctor_id}/reviews")
async def get_doctor_reviews(
    doctor_id: uuid.UUID,
    skip: int = 0,
    limit: int = 20,
    session: AsyncSession = Depends(get_db)
):
    """Get doctor reviews"""
    service = DoctorService(session)
    return await service.get_reviews(doctor_id, skip, limit)

@router.get("/dashboard")
async def doctor_dashboard(
    current_user: User = Depends(require_doctor),
    session: AsyncSession = Depends(get_db)
):
    """Get doctor dashboard"""
    service = DoctorService(session)
    return await service.get_dashboard(current_user.id)

@router.put("/toggle-online-status")
async def toggle_online_status(
    is_online: bool = Query(...),
    current_user: User = Depends(require_doctor),
    session: AsyncSession = Depends(get_db)
):
    """Toggle online status"""
    service = DoctorService(session)
    return await service.toggle_online_status(current_user.id, is_online)

@router.get("/ranking")
async def get_doctor_ranking(
    specialization: Optional[str] = None,
    limit: int = 10,
    session: AsyncSession = Depends(get_db)
):
    """Get doctor rankings"""
    service = DoctorService(session)
    return await service.get_rankings(specialization, limit)

@router.post("/compare")
async def compare_doctors(
    doctor_ids: List[uuid.UUID],
    session: AsyncSession = Depends(get_db)
):
    """Compare multiple doctors"""
    service = DoctorService(session)
    return await service.compare_doctors(doctor_ids)