"""
Hospital API endpoints
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.api.deps import get_current_user, require_hospital_admin
from app.models.user import User
from app.services.hospital_service import HospitalService
from app.api.v1.hospitals.schemas import (
    HospitalProfileCreate, HospitalProfileUpdate,
    DepartmentCreate, BloodStockUpdate, OxygenStockUpdate,
    BedStatusUpdate, EmergencyAnnouncement
)
import uuid

router = APIRouter()

@router.post("/profile")
async def create_hospital_profile(
    data: HospitalProfileCreate,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    """Create hospital profile"""
    service = HospitalService(session)
    return await service.create_profile(current_user.id, data.dict())

@router.get("/profile/{hospital_id}")
async def get_hospital_profile(
    hospital_id: uuid.UUID,
    session: AsyncSession = Depends(get_db)
):
    """Get hospital profile"""
    service = HospitalService(session)
    return await service.get_profile(hospital_id)

@router.put("/profile")
async def update_hospital_profile(
    data: HospitalProfileUpdate,
    current_user: User = Depends(require_hospital_admin),
    session: AsyncSession = Depends(get_db)
):
    """Update hospital profile"""
    service = HospitalService(session)
    return await service.update_profile(current_user.id, data.dict(exclude_unset=True))

@router.get("/search")
async def search_hospitals(
    city: Optional[str] = None,
    specialization: Optional[str] = None,
    emergency_services: Optional[bool] = None,
    has_icu_beds: Optional[bool] = None,
    has_blood_bank: Optional[bool] = None,
    accepts_insurance: Optional[bool] = None,
    latitude: Optional[float] = None,
    longitude: Optional[float] = None,
    radius_km: float = 20,
    skip: int = 0,
    limit: int = 20,
    session: AsyncSession = Depends(get_db)
):
    """Search hospitals"""
    service = HospitalService(session)
    
    filters = {
        "city": city,
        "specialization": specialization,
        "emergency_services": emergency_services,
        "has_icu_beds": has_icu_beds,
        "has_blood_bank": has_blood_bank,
        "accepts_insurance": accepts_insurance
    }
    
    if latitude and longitude:
        return await service.search_nearby_hospitals(
            latitude, longitude, radius_km, filters, skip, limit
        )
    
    return await service.search_hospitals(filters, skip, limit)

@router.get("/icu-network")
async def get_icu_network(
    latitude: float = Query(...),
    longitude: float = Query(...),
    radius_km: float = Query(50),
    session: AsyncSession = Depends(get_db)
):
    """Get ICU bed network"""
    service = HospitalService(session)
    return await service.get_icu_network(latitude, longitude, radius_km)

@router.post("/departments")
async def add_department(
    data: DepartmentCreate,
    current_user: User = Depends(require_hospital_admin),
    session: AsyncSession = Depends(get_db)
):
    """Add hospital department"""
    service = HospitalService(session)
    return await service.add_department(current_user.id, data.dict())

@router.get("/departments/{hospital_id}")
async def get_departments(
    hospital_id: uuid.UUID,
    session: AsyncSession = Depends(get_db)
):
    """Get hospital departments"""
    service = HospitalService(session)
    return await service.get_departments(hospital_id)

@router.put("/beds")
async def update_bed_status(
    data: BedStatusUpdate,
    current_user: User = Depends(require_hospital_admin),
    session: AsyncSession = Depends(get_db)
):
    """Update bed availability"""
    service = HospitalService(session)
    return await service.update_bed_status(current_user.id, data.dict(exclude_unset=True))

@router.put("/blood-stock")
async def update_blood_stock(
    data: BloodStockUpdate,
    current_user: User = Depends(require_hospital_admin),
    session: AsyncSession = Depends(get_db)
):
    """Update blood stock"""
    service = HospitalService(session)
    return await service.update_blood_stock(current_user.id, data.dict())

@router.get("/blood-stock/{hospital_id}")
async def get_blood_stock(
    hospital_id: uuid.UUID,
    blood_group: Optional[str] = None,
    session: AsyncSession = Depends(get_db)
):
    """Get blood stock levels"""
    service = HospitalService(session)
    return await service.get_blood_stock(hospital_id, blood_group)

@router.put("/oxygen-stock")
async def update_oxygen_stock(
    data: OxygenStockUpdate,
    current_user: User = Depends(require_hospital_admin),
    session: AsyncSession = Depends(get_db)
):
    """Update oxygen stock"""
    service = HospitalService(session)
    return await service.update_oxygen_stock(current_user.id, data.dict())

@router.get("/oxygen-stock/{hospital_id}")
async def get_oxygen_stock(
    hospital_id: uuid.UUID,
    session: AsyncSession = Depends(get_db)
):
    """Get oxygen stock"""
    service = HospitalService(session)
    return await service.get_oxygen_stock(hospital_id)

@router.post("/emergency-announcement")
async def create_emergency_announcement(
    data: EmergencyAnnouncement,
    current_user: User = Depends(require_hospital_admin),
    session: AsyncSession = Depends(get_db)
):
    """Create emergency announcement"""
    service = HospitalService(session)
    return await service.create_announcement(current_user.id, data.dict())

@router.get("/dashboard")
async def hospital_dashboard(
    current_user: User = Depends(require_hospital_admin),
    session: AsyncSession = Depends(get_db)
):
    """Get hospital dashboard"""
    service = HospitalService(session)
    return await service.get_dashboard(current_user.id)

@router.get("/{hospital_id}/doctors")
async def get_hospital_doctors(
    hospital_id: uuid.UUID,
    skip: int = 0,
    limit: int = 20,
    session: AsyncSession = Depends(get_db)
):
    """Get hospital doctors"""
    service = HospitalService(session)
    return await service.get_doctors(hospital_id, skip, limit)

@router.get("/{hospital_id}/reviews")
async def get_hospital_reviews(
    hospital_id: uuid.UUID,
    skip: int = 0,
    limit: int = 20,
    session: AsyncSession = Depends(get_db)
):
    """Get hospital reviews"""
    service = HospitalService(session)
    return await service.get_reviews(hospital_id, skip, limit)

@router.get("/analytics")
async def hospital_analytics(
    current_user: User = Depends(require_hospital_admin),
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    session: AsyncSession = Depends(get_db)
):
    """Get hospital analytics"""
    service = HospitalService(session)
    return await service.get_analytics(current_user.id, start_date, end_date)