from fastapi import APIRouter, Depends, Query, Body
from sqlalchemy.orm import Session
from typing import Optional

from ...core.database import get_db
from ...schemas.common import APIResponse
from ...schemas.patient import HealthRecordCreateRequest
from ...services.patient_service import PatientService
from ...middleware.auth_middleware import get_current_user, get_current_user_optional
from ...core.permissions import CurrentUser, require_role

router = APIRouter(prefix="/patients", tags=["Patients"])


# ============================================
# LIST PATIENTS (public - paginated search)
# ============================================
@router.get("/", response_model=APIResponse)
async def list_patients(
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    search: Optional[str] = Query(None),
    sort_by: str = Query("created_at"),
    sort_order: str = Query("desc"),
    current_user: Optional[CurrentUser] = Depends(get_current_user_optional),
    db: Session = Depends(get_db),
):
    """List patients with pagination and search."""
    service = PatientService(db)
    result = service.list_patients(page=page, size=size, search=search, sort_by=sort_by, sort_order=sort_order)
    return APIResponse(success=True, message="Patients list retrieved", data=result)


# ============================================
# GET MY PATIENT PROFILE
# ============================================
@router.get("/me/profile", response_model=APIResponse)
async def get_my_profile(
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get current authenticated user's patient profile."""
    service = PatientService(db)
    profile = service.get_patient_profile(current_user.id, current_user.id)
    return APIResponse(success=True, message="Patient profile retrieved", data=profile)


# ============================================
# UPDATE MY PATIENT PROFILE
# ============================================
@router.put("/me/profile", response_model=APIResponse)
async def update_my_profile(
    data: dict = Body(...),
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update current user's patient profile."""
    service = PatientService(db)
    profile = service.update_patient_profile(current_user.id, data)
    return APIResponse(success=True, message="Profile updated", data=profile)


# ============================================
# GET PATIENT PROFILE (by ID)
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
# SEARCH PATIENTS
# ============================================
@router.get("/search", response_model=APIResponse)
async def search_patients(
    q: str = Query(..., min_length=1, max_length=100),
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    current_user: Optional[CurrentUser] = Depends(get_current_user_optional),
    db: Session = Depends(get_db),
):
    """Search for patients by name, email, or phone."""
    service = PatientService(db)
    result = service.search_patients(q, page=page, size=size)
    return APIResponse(success=True, message="Search results retrieved", data=result)


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
    """Get patient health records with pagination and filtering."""
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
# UPDATE HEALTH RECORD
# ============================================
@router.put("/{patient_id}/health-records/{record_id}", response_model=APIResponse)
async def update_health_record(
    patient_id: str,
    record_id: str,
    data: dict = Body(...),
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update a patient's health record."""
    service = PatientService(db)
    record = service.update_health_record(patient_id, record_id, data)
    return APIResponse(success=True, message="Health record updated", data=record)


# ============================================
# DELETE HEALTH RECORD
# ============================================
@router.delete("/{patient_id}/health-records/{record_id}", response_model=APIResponse)
async def delete_health_record(
    patient_id: str,
    record_id: str,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Delete a patient's health record."""
    service = PatientService(db)
    service.delete_health_record(patient_id, record_id)
    return APIResponse(success=True, message="Health record deleted")


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
    """Get patient prescriptions with pagination."""
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
    """Get patient appointments with pagination."""
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
# ADD VACCINATION
# ============================================
@router.post("/{patient_id}/vaccinations", response_model=APIResponse)
async def add_vaccination(
    patient_id: str,
    data: dict = Body(...),
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Add a vaccination record for a patient."""
    service = PatientService(db)
    result = service.add_vaccination(patient_id, data)
    return APIResponse(success=True, message="Vaccination added", data=result)


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
    """Get patient medications with filtering."""
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
# ADD SURGERY
# ============================================
@router.post("/{patient_id}/surgeries", response_model=APIResponse)
async def add_surgery(
    patient_id: str,
    data: dict = Body(...),
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Add a surgery record for a patient."""
    service = PatientService(db)
    result = service.add_surgery(patient_id, data)
    return APIResponse(success=True, message="Surgery added", data=result)


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
    """Get patient health timeline (chronological events)."""
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


# ============================================
# FITNESS TRACKING
# ============================================
@router.get("/{patient_id}/fitness", response_model=APIResponse)
async def get_fitness_data(
    patient_id: str,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get patient fitness data."""
    service = PatientService(db)
    result = service.get_fitness_data(patient_id)
    return APIResponse(success=True, message="Fitness data retrieved", data=result)


@router.post("/{patient_id}/fitness", response_model=APIResponse)
async def add_fitness_record(
    patient_id: str,
    data: dict = Body(...),
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Add fitness record for a patient."""
    service = PatientService(db)
    result = service.add_fitness_record(patient_id, data)
    return APIResponse(success=True, message="Fitness record added", data=result)


# ============================================
# NUTRITION TRACKING
# ============================================
@router.get("/{patient_id}/nutrition", response_model=APIResponse)
async def get_nutrition_data(
    patient_id: str,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get patient nutrition data."""
    service = PatientService(db)
    result = service.get_nutrition_data(patient_id)
    return APIResponse(success=True, message="Nutrition data retrieved", data=result)


@router.post("/{patient_id}/nutrition", response_model=APIResponse)
async def add_nutrition_record(
    patient_id: str,
    data: dict = Body(...),
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Add nutrition record for a patient."""
    service = PatientService(db)
    result = service.add_nutrition_record(patient_id, data)
    return APIResponse(success=True, message="Nutrition record added", data=result)


# ============================================
# SLEEP TRACKING
# ============================================
@router.get("/{patient_id}/sleep", response_model=APIResponse)
async def get_sleep_data(
    patient_id: str,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get patient sleep data."""
    service = PatientService(db)
    result = service.get_sleep_data(patient_id)
    return APIResponse(success=True, message="Sleep data retrieved", data=result)


@router.post("/{patient_id}/sleep", response_model=APIResponse)
async def add_sleep_record(
    patient_id: str,
    data: dict = Body(...),
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Add sleep record for a patient."""
    service = PatientService(db)
    result = service.add_sleep_record(patient_id, data)
    return APIResponse(success=True, message="Sleep record added", data=result)


# ============================================
# MENTAL HEALTH TRACKING
# ============================================
@router.get("/{patient_id}/mental-health", response_model=APIResponse)
async def get_mental_health_data(
    patient_id: str,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get patient mental health data."""
    service = PatientService(db)
    result = service.get_mental_health_data(patient_id)
    return APIResponse(success=True, message="Mental health data retrieved", data=result)


@router.post("/{patient_id}/mental-health", response_model=APIResponse)
async def add_mental_health_record(
    patient_id: str,
    data: dict = Body(...),
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Add mental health record for a patient."""
    service = PatientService(db)
    result = service.add_mental_health_record(patient_id, data)
    return APIResponse(success=True, message="Mental health record added", data=result)

