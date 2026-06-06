from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional

from ...core.database import get_db
from ...schemas.common import APIResponse
from ...schemas.patient import HealthRecordCreateRequest
from ...services.patient_service import PatientService
from ...middleware.auth_middleware import get_current_user
from ...core.permissions import CurrentUser

router = APIRouter(prefix="/patients", tags=["Patients"])


# ============================================
# GET PATIENT PROFILE
# ============================================
@router.get("/{patient_id}/profile", response_model=APIResponse)
async def get_patient_profile(
    patient_id: str,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get a patient's full profile."""
    service = PatientService(db)
    profile = service.get_patient_profile(patient_id, current_user.id)
    return APIResponse(success=True, message="Patient profile retrieved", data=profile)


# ============================================
# GET HEALTH RECORDS
# ============================================
@router.get("/{patient_id}/health-records", response_model=APIResponse)
async def get_health_records(
    patient_id: str,
    record_type: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get patient health records."""
    service = PatientService(db)
    result = service.get_health_records(patient_id, record_type=record_type, page=page, size=size)
    return APIResponse(success=True, message="Health records retrieved", data=result)


# ============================================
# CREATE HEALTH RECORD
# ============================================
@router.post("/{patient_id}/health-records", response_model=APIResponse)
async def create_health_record(
    patient_id: str,
    data: HealthRecordCreateRequest,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create a new health record for a patient."""
    service = PatientService(db)
    record = service.create_health_record(patient_id, data)
    return APIResponse(success=True, message="Health record created", data=record)


# ============================================
# GET PRESCRIPTIONS
# ============================================
@router.get("/{patient_id}/prescriptions", response_model=APIResponse)
async def get_patient_prescriptions(
    patient_id: str,
    status: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get patient prescriptions."""
    service = PatientService(db)
    result = service.get_prescriptions(patient_id, status=status, page=page, size=size)
    return APIResponse(success=True, message="Prescriptions retrieved", data=result)


# ============================================
# GET APPOINTMENTS
# ============================================
@router.get("/{patient_id}/appointments", response_model=APIResponse)
async def get_patient_appointments(
    patient_id: str,
    status: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get patient appointments."""
    service = PatientService(db)
    result = service.get_patient_appointments(patient_id, status=status, page=page, size=size)
    return APIResponse(success=True, message="Appointments retrieved", data=result)


# ============================================
# GET VACCINATIONS
# ============================================
@router.get("/{patient_id}/vaccinations", response_model=APIResponse)
async def get_patient_vaccinations(
    patient_id: str,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get patient vaccination records."""
    service = PatientService(db)
    result = service.get_vaccinations(patient_id)
    return APIResponse(success=True, message="Vaccinations retrieved", data=result)


# ============================================
# GET MEDICATIONS
# ============================================
@router.get("/{patient_id}/medications", response_model=APIResponse)
async def get_patient_medications(
    patient_id: str,
    active_only: bool = Query(True),
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get patient medications."""
    service = PatientService(db)
    result = service.get_medications(patient_id, active_only=active_only)
    return APIResponse(success=True, message="Medications retrieved", data=result)


# ============================================
# GET MEDICAL HISTORY
# ============================================
@router.get("/{patient_id}/medical-history", response_model=APIResponse)
async def get_medical_history(
    patient_id: str,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get patient medical history."""
    service = PatientService(db)
    result = service.get_medical_history(patient_id)
    return APIResponse(success=True, message="Medical history retrieved", data=result)


# ============================================
# GET SURGERIES
# ============================================
@router.get("/{patient_id}/surgeries", response_model=APIResponse)
async def get_surgeries(
    patient_id: str,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get patient surgery history."""
    service = PatientService(db)
    result = service.get_surgeries(patient_id)
    return APIResponse(success=True, message="Surgeries retrieved", data=result)


# ============================================
# HEALTH TIMELINE
# ============================================
@router.get("/{patient_id}/timeline", response_model=APIResponse)
async def get_health_timeline(
    patient_id: str,
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get patient health timeline."""
    service = PatientService(db)
    result = service.get_health_timeline(patient_id, page=page, size=size)
    return APIResponse(success=True, message="Timeline retrieved", data=result)


# ============================================
# HEALTH STATS
# ============================================
@router.get("/{patient_id}/stats", response_model=APIResponse)
async def get_health_stats(
    patient_id: str,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get patient health statistics."""
    service = PatientService(db)
    result = service.get_health_stats(patient_id)
    return APIResponse(success=True, message="Stats retrieved", data=result)
