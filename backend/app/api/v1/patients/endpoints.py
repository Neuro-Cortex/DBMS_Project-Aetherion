"""
Patient API endpoints
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.services.patient_service import PatientService
from app.api.v1.patients.schemas import (
    PatientProfileCreate, PatientProfileUpdate,
    VitalsRecord, VaccinationRecord, MedicalRecordCreate,
    HealthTimelineQuery
)
import uuid

router = APIRouter()

@router.post("/profile")
async def create_patient_profile(
    data: PatientProfileCreate,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    """Create patient profile"""
    service = PatientService(session)
    return await service.create_profile(current_user.id, data.dict())

@router.get("/profile")
async def get_patient_profile(
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    """Get patient profile"""
    service = PatientService(session)
    return await service.get_profile(current_user.id)

@router.put("/profile")
async def update_patient_profile(
    data: PatientProfileUpdate,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    """Update patient profile"""
    service = PatientService(session)
    return await service.update_profile(current_user.id, data.dict(exclude_unset=True))

@router.post("/vitals")
async def record_vitals(
    data: VitalsRecord,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    """Record patient vitals"""
    service = PatientService(session)
    return await service.record_vitals(current_user.id, data.dict())

@router.get("/vitals")
async def get_vitals_history(
    current_user: User = Depends(get_current_user),
    skip: int = 0,
    limit: int = 50,
    session: AsyncSession = Depends(get_db)
):
    """Get vitals history"""
    service = PatientService(session)
    return await service.get_vitals(current_user.id, skip, limit)

@router.post("/vaccinations")
async def add_vaccination(
    data: VaccinationRecord,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    """Add vaccination record"""
    service = PatientService(session)
    return await service.add_vaccination(current_user.id, data.dict())

@router.get("/vaccinations")
async def get_vaccinations(
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    """Get vaccination records"""
    service = PatientService(session)
    return await service.get_vaccinations(current_user.id)

@router.post("/medical-records")
async def add_medical_record(
    data: MedicalRecordCreate,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    """Add medical record"""
    service = PatientService(session)
    return await service.add_medical_record(current_user.id, data.dict())

@router.get("/medical-records")
async def get_medical_records(
    current_user: User = Depends(get_current_user),
    record_type: Optional[str] = None,
    skip: int = 0,
    limit: int = 20,
    session: AsyncSession = Depends(get_db)
):
    """Get medical records"""
    service = PatientService(session)
    return await service.get_medical_records(
        current_user.id, record_type, skip, limit
    )

@router.post("/medical-records/upload")
async def upload_medical_record_file(
    record_id: uuid.UUID = Query(...),
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    """Upload medical record file"""
    service = PatientService(session)
    return await service.upload_record_file(current_user.id, record_id, file)

@router.get("/health-timeline")
async def get_health_timeline(
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    """Get health timeline"""
    service = PatientService(session)
    return await service.get_health_timeline(current_user.id, start_date, end_date)

@router.get("/dashboard")
async def patient_dashboard(
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    """Get patient dashboard"""
    service = PatientService(session)
    return await service.get_dashboard(current_user.id)

@router.get("/blood-donation-history")
async def blood_donation_history(
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    """Get blood donation history"""
    service = PatientService(session)
    return await service.get_donation_history(current_user.id)

@router.get("/medicine-history")
async def medicine_history(
    current_user: User = Depends(get_current_user),
    skip: int = 0,
    limit: int = 20,
    session: AsyncSession = Depends(get_db)
):
    """Get medicine history"""
    service = PatientService(session)
    return await service.get_medicine_history(current_user.id, skip, limit)

@router.get("/connected-doctors")
async def connected_doctors(
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    """Get connected doctors"""
    service = PatientService(session)
    return await service.get_connected_doctors(current_user.id)

@router.get("/connected-hospitals")
async def connected_hospitals(
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    """Get connected hospitals"""
    service = PatientService(session)
    return await service.get_connected_hospitals(current_user.id)