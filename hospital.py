from fastapi import APIRouter, Depends, Query, Body
from sqlalchemy.orm import Session
from typing import Optional

from ...core.database import get_db
from ...schemas.common import APIResponse
from ...schemas.hospital import (
    HospitalUpdateRequest, HospitalDoctorCreateRequest,
    HospitalDepartmentCreateRequest, BloodStockUpdateRequest,
    OxygenStockUpdateRequest, AmbulanceStatusUpdateRequest,
    AmbulanceCreateRequest,
)
from ...services.hospital_service import HospitalService
from ...middleware.auth_middleware import get_current_user
from ...core.permissions import CurrentUser, require_role

router = APIRouter(prefix="/hospital", tags=["Hospital"])
public_router = APIRouter(prefix="/hospitals", tags=["Hospitals (Public)"])


# ============================================
# PUBLIC: LIST HOSPITALS
# ============================================
@public_router.get("/", response_model=APIResponse)
async def list_hospitals(
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    search: Optional[str] = Query(None),
    city: Optional[str] = Query(None),
    state: Optional[str] = Query(None),
    type: Optional[str] = Query(None),
    is_verified: Optional[bool] = Query(None),
    sortBy: str = Query("rating"),
    sortOrder: str = Query("desc"),
    db: Session = Depends(get_db),
):
    """Public endpoint to browse and search hospitals."""
    service = HospitalService(db)
    result = service.list_hospitals(
        page=page, size=size, search=search, city=city,
        state=state, hospital_type=type, is_verified=is_verified,
        sort_by=sortBy, sort_order=sortOrder,
    )
    return APIResponse(success=True, message="Hospitals retrieved", data=result)


# ============================================
# PUBLIC: GET HOSPITAL BY ID
# ============================================
@public_router.get("/{hospital_id}", response_model=APIResponse)
async def get_hospital_by_id(hospital_id: str, db: Session = Depends(get_db)):
    """Public endpoint to get hospital details."""
    service = HospitalService(db)
    hospital = service.get_hospital_by_id(hospital_id)
    return APIResponse(success=True, message="Hospital retrieved", data=hospital)


# ============================================
# PUBLIC: HOSPITAL STATS
# ============================================
@public_router.get("/meta/stats", response_model=APIResponse)
async def get_hospital_stats(db: Session = Depends(get_db)):
    """Get aggregate hospital statistics."""
    service = HospitalService(db)
    stats = service.get_hospital_stats()
    return APIResponse(success=True, message="Stats retrieved", data=stats)


# ============================================
# AUTHENTICATED: HOSPITAL PROFILE
# ============================================
@router.get("/profile", response_model=APIResponse, dependencies=[Depends(require_role("hospital", "hospital_admin"))])
async def get_hospital_profile(
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get the authenticated hospital's profile."""
    service = HospitalService(db)
    profile = service.get_hospital_profile(current_user.id)
    return APIResponse(success=True, message="Profile retrieved", data=profile)


@router.put("/profile", response_model=APIResponse, dependencies=[Depends(require_role("hospital", "hospital_admin"))])
async def update_hospital_profile(
    data: HospitalUpdateRequest,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update the authenticated hospital's profile."""
    service = HospitalService(db)
    profile = service.update_hospital_profile(current_user.id, data)
    return APIResponse(success=True, message="Profile updated", data=profile)


# ============================================
# AUTHENTICATED: HOSPITAL DASHBOARD
# ============================================
@router.get("/dashboard", response_model=APIResponse, dependencies=[Depends(require_role("hospital", "hospital_admin"))])
async def get_hospital_dashboard(
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get hospital dashboard data."""
    service = HospitalService(db)
    dashboard = service.get_dashboard(current_user.id)
    return APIResponse(success=True, message="Dashboard retrieved", data=dashboard)


# ============================================
# AUTHENTICATED: HOSPITAL DOCTORS
# ============================================
@router.get("/doctors", response_model=APIResponse, dependencies=[Depends(require_role("hospital", "hospital_admin"))])
async def get_hospital_doctors(
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get doctors affiliated with the hospital."""
    service = HospitalService(db)
    result = service.get_hospital_doctors(current_user.id, page=page, size=size)
    return APIResponse(success=True, message="Doctors retrieved", data=result)


@router.post("/doctors", response_model=APIResponse, dependencies=[Depends(require_role("hospital", "hospital_admin"))])
async def add_hospital_doctor(
    data: HospitalDoctorCreateRequest,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Add a doctor to the hospital."""
    service = HospitalService(db)
    result = service.add_hospital_doctor(current_user.id, data)
    return APIResponse(success=True, message="Doctor added", data=result)


@router.delete("/doctors/{doctor_id}", response_model=APIResponse, dependencies=[Depends(require_role("hospital", "hospital_admin"))])
async def remove_hospital_doctor(
    doctor_id: str,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Remove a doctor from the hospital."""
    service = HospitalService(db)
    service.remove_hospital_doctor(current_user.id, doctor_id)
    return APIResponse(success=True, message="Doctor removed")


# ============================================
# AUTHENTICATED: DEPARTMENTS
# ============================================
@router.get("/departments", response_model=APIResponse, dependencies=[Depends(require_role("hospital", "hospital_admin"))])
async def get_departments(
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get hospital departments."""
    service = HospitalService(db)
    departments = service.get_departments(current_user.id)
    return APIResponse(success=True, message="Departments retrieved", data=departments)


@router.post("/departments", response_model=APIResponse, dependencies=[Depends(require_role("hospital", "hospital_admin"))])
async def add_department(
    data: HospitalDepartmentCreateRequest,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Add a new department."""
    service = HospitalService(db)
    dept = service.add_department(current_user.id, data)
    return APIResponse(success=True, message="Department added", data=dept)


# ============================================
# AUTHENTICATED: BEDS
# ============================================
@router.get("/beds", response_model=APIResponse, dependencies=[Depends(require_role("hospital", "hospital_admin"))])
async def get_hospital_beds(
    bed_type: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    size: int = Query(50, ge=1, le=200),
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get hospital beds with optional filters."""
    service = HospitalService(db)
    result = service.get_beds(current_user.id, bed_type=bed_type, status=status, page=page, size=size)
    return APIResponse(success=True, message="Beds retrieved", data=result)


@router.get("/beds/summary", response_model=APIResponse, dependencies=[Depends(require_role("hospital", "hospital_admin"))])
async def get_beds_summary(
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get bed availability summary by type."""
    service = HospitalService(db)
    result = service.get_beds_by_type_summary(current_user.id)
    return APIResponse(success=True, message="Bed summary retrieved", data=result)


# ============================================
# AUTHENTICATED: ICU BEDS
# ============================================
@router.get("/icu-beds", response_model=APIResponse, dependencies=[Depends(require_role("hospital", "hospital_admin"))])
async def get_icu_beds(
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get ICU beds for the hospital."""
    service = HospitalService(db)
    result = service.get_beds(current_user.id, bed_type="icu", size=200)
    return APIResponse(success=True, message="ICU beds retrieved", data=result)


# ============================================
# AUTHENTICATED: BLOOD BANK
# ============================================
@router.get("/blood-bank", response_model=APIResponse, dependencies=[Depends(require_role("hospital", "hospital_admin"))])
async def get_blood_bank(
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get hospital blood bank data."""
    service = HospitalService(db)
    result = service.get_blood_bank(current_user.id)
    return APIResponse(success=True, message="Blood bank retrieved", data=result)


@router.get("/blood-stock", response_model=APIResponse, dependencies=[Depends(require_role("hospital", "hospital_admin"))])
async def get_blood_stock(
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get hospital blood stock."""
    service = HospitalService(db)
    result = service.get_blood_stock(current_user.id)
    return APIResponse(success=True, message="Blood stock retrieved", data=result)


@router.put("/blood-stock", response_model=APIResponse, dependencies=[Depends(require_role("hospital", "hospital_admin"))])
async def update_blood_stock(
    data: BloodStockUpdateRequest,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update blood stock for a blood group."""
    service = HospitalService(db)
    result = service.update_blood_stock(current_user.id, data)
    return APIResponse(success=True, message="Blood stock updated", data=result)


# ============================================
# AUTHENTICATED: OXYGEN
# ============================================
@router.get("/oxygen", response_model=APIResponse, dependencies=[Depends(require_role("hospital", "hospital_admin"))])
async def get_oxygen_stock(
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get hospital oxygen stock."""
    service = HospitalService(db)
    result = service.get_oxygen_stock(current_user.id)
    return APIResponse(success=True, message="Oxygen stock retrieved", data=result)


@router.put("/oxygen-stock", response_model=APIResponse, dependencies=[Depends(require_role("hospital", "hospital_admin"))])
async def update_oxygen_stock(
    data: OxygenStockUpdateRequest,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update hospital oxygen stock."""
    service = HospitalService(db)
    result = service.update_oxygen_stock(current_user.id, data)
    return APIResponse(success=True, message="Oxygen stock updated", data=result)


# ============================================
# AUTHENTICATED: AMBULANCES
# ============================================
@router.get("/ambulances", response_model=APIResponse, dependencies=[Depends(require_role("hospital", "hospital_admin"))])
async def get_ambulances(
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get hospital ambulances."""
    service = HospitalService(db)
    result = service.get_ambulances(current_user.id)
    return APIResponse(success=True, message="Ambulances retrieved", data=result)


@router.post("/ambulances", response_model=APIResponse, dependencies=[Depends(require_role("hospital", "hospital_admin"))])
async def add_ambulance(
    data: AmbulanceCreateRequest,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Add a new ambulance."""
    service = HospitalService(db)
    result = service.add_ambulance(current_user.id, data)
    return APIResponse(success=True, message="Ambulance added", data=result)


@router.put("/ambulances/{ambulance_id}/status", response_model=APIResponse, dependencies=[Depends(require_role("hospital", "hospital_admin"))])
async def update_ambulance_status(
    ambulance_id: str,
    data: AmbulanceStatusUpdateRequest,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update ambulance status."""
    service = HospitalService(db)
    service.update_ambulance_status(current_user.id, ambulance_id, data.status)
    return APIResponse(success=True, message="Ambulance status updated")
