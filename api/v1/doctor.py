from fastapi import APIRouter, Depends, Query, Body
from sqlalchemy.orm import Session
from typing import Optional

from ...core.database import get_db
from ...schemas.common import APIResponse
from ...schemas.doctor import (
    DoctorProfileResponse, DoctorProfileUpdateRequest,
    DoctorListItemResponse, DoctorAvailabilityResponse,
    WeeklyScheduleUpdateRequest, DoctorDashboardResponse,
    DoctorNotificationResponse, DoctorEarningsResponse,
)
from ...services.doctor_service import DoctorService
from ...middleware.auth_middleware import get_current_user
from ...core.permissions import CurrentUser, require_role

router = APIRouter(prefix="/doctor", tags=["Doctor"])
public_router = APIRouter(prefix="/doctors", tags=["Doctors (Public)"])


# ============================================
# PUBLIC: LIST DOCTORS (no auth required)
# ============================================
@public_router.get("/", response_model=APIResponse)
async def list_doctors(
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    search: Optional[str] = Query(None),
    specialization: Optional[str] = Query(None),
    is_verified: Optional[bool] = Query(None),
    sort_by: str = Query("rating"),
    sort_order: str = Query("desc"),
    db: Session = Depends(get_db),
):
    """Public endpoint to browse and search doctors."""
    service = DoctorService(db)
    result = service.list_doctors(
        page=page, size=size, search=search,
        specialization=specialization, is_verified=is_verified,
        sort_by=sort_by, sort_order=sort_order,
    )
    return APIResponse(success=True, message="Doctors retrieved", data=result)


# ============================================
# PUBLIC: GET DOCTOR BY ID
# ============================================
@public_router.get("/{doctor_id}", response_model=APIResponse)
async def get_doctor_by_id(doctor_id: str, db: Session = Depends(get_db)):
    """Public endpoint to get doctor details."""
    service = DoctorService(db)
    profile = service.get_doctor_by_id(doctor_id)
    return APIResponse(success=True, message="Doctor retrieved", data=profile)


# ============================================
# PUBLIC: GET SPECIALTIES
# ============================================
@public_router.get("/meta/specialties", response_model=APIResponse)
async def get_specialties(db: Session = Depends(get_db)):
    """Get all unique doctor specialties."""
    service = DoctorService(db)
    specialties = service.get_specialties()
    return APIResponse(success=True, message="Specialties retrieved", data=specialties)


# ============================================
# PUBLIC: GET AVAILABLE SLOTS
# ============================================
@public_router.get("/{doctor_id}/available-slots", response_model=APIResponse)
async def get_available_slots(
    doctor_id: str,
    date: str = Query(..., description="Date in YYYY-MM-DD format"),
    db: Session = Depends(get_db),
):
    """Get available time slots for a doctor on a specific date."""
    service = DoctorService(db)
    slots = service.get_available_slots(doctor_id, date)
    return APIResponse(success=True, message="Available slots retrieved", data=slots)


# ============================================
# AUTHENTICATED: GET DOCTOR PROFILE
# ============================================
@router.get("/profile", response_model=APIResponse, dependencies=[Depends(require_role("doctor"))])
async def get_doctor_profile(
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get the authenticated doctor's profile."""
    service = DoctorService(db)
    profile = service.get_doctor_profile(current_user.id)
    return APIResponse(success=True, message="Profile retrieved", data=profile)


# ============================================
# AUTHENTICATED: UPDATE DOCTOR PROFILE
# ============================================
@router.put("/profile", response_model=APIResponse, dependencies=[Depends(require_role("doctor"))])
async def update_doctor_profile(
    data: DoctorProfileUpdateRequest,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update the authenticated doctor's profile."""
    service = DoctorService(db)
    profile = service.update_doctor_profile(current_user.id, data)
    return APIResponse(success=True, message="Profile updated", data=profile)


# ============================================
# AUTHENTICATED: DOCTOR DASHBOARD
# ============================================
@router.get("/dashboard", response_model=APIResponse, dependencies=[Depends(require_role("doctor"))])
async def get_doctor_dashboard(
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get doctor dashboard data."""
    service = DoctorService(db)
    dashboard = service.get_dashboard(current_user.id)
    return APIResponse(success=True, message="Dashboard data retrieved", data=dashboard)


# ============================================
# AUTHENTICATED: DOCTOR APPOINTMENTS
# ============================================
@router.get("/appointments", response_model=APIResponse, dependencies=[Depends(require_role("doctor"))])
async def get_doctor_appointments(
    date: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get appointments for the authenticated doctor."""
    service = DoctorService(db)
    result = service.get_doctor_appointments(
        current_user.id, date_filter=date, status=status, page=page, size=size,
    )
    return APIResponse(success=True, message="Appointments retrieved", data=result)


# ============================================
# AUTHENTICATED: UPDATE APPOINTMENT STATUS
# ============================================
@router.put("/appointments/{appointment_id}/status", response_model=APIResponse, dependencies=[Depends(require_role("doctor"))])
async def update_appointment_status(
    appointment_id: str,
    status: str = Body(..., embed=True),
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update an appointment's status (doctor only)."""
    service = DoctorService(db)
    result = service.update_appointment_status(current_user.id, appointment_id, status)
    return APIResponse(success=True, message="Appointment status updated", data=result)


# ============================================
# AUTHENTICATED: DOCTOR PATIENTS
# ============================================
@router.get("/patients", response_model=APIResponse, dependencies=[Depends(require_role("doctor"))])
async def get_doctor_patients(
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    search: Optional[str] = Query(None),
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get patients for the authenticated doctor."""
    service = DoctorService(db)
    result = service.get_doctor_patients(current_user.id, page=page, size=size, search=search)
    return APIResponse(success=True, message="Patients retrieved", data=result)


# ============================================
# AUTHENTICATED: GET PATIENT DETAILS
# ============================================
@router.get("/patients/{patient_id}", response_model=APIResponse, dependencies=[Depends(require_role("doctor"))])
async def get_patient_details(
    patient_id: str,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get a specific patient's details (doctor only, must have relationship)."""
    service = DoctorService(db)
    result = service.get_patient_details(current_user.id, patient_id)
    return APIResponse(success=True, message="Patient details retrieved", data=result)


# ============================================
# AUTHENTICATED: SCHEDULE
# ============================================
@router.get("/schedule", response_model=APIResponse, dependencies=[Depends(require_role("doctor"))])
async def get_doctor_schedule(
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get the authenticated doctor's weekly schedule."""
    service = DoctorService(db)
    schedule = service.get_schedule(current_user.id)
    return APIResponse(success=True, message="Schedule retrieved", data=schedule)


@router.put("/schedule", response_model=APIResponse, dependencies=[Depends(require_role("doctor"))])
async def update_doctor_schedule(
    data: WeeklyScheduleUpdateRequest,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update the authenticated doctor's weekly schedule."""
    service = DoctorService(db)
    schedule = service.update_schedule(current_user.id, data)
    return APIResponse(success=True, message="Schedule updated", data=schedule)


# ============================================
# AUTHENTICATED: TOGGLE ONLINE STATUS
# ============================================
@router.put("/status", response_model=APIResponse, dependencies=[Depends(require_role("doctor"))])
async def toggle_online_status(
    isOnline: bool = Body(..., embed=True),
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Toggle doctor's online/offline status."""
    service = DoctorService(db)
    result = service.toggle_online_status(current_user.id, isOnline)
    return APIResponse(success=True, message="Status updated", data=result)


# ============================================
# AUTHENTICATED: NOTIFICATIONS
# ============================================
@router.get("/notifications", response_model=APIResponse, dependencies=[Depends(require_role("doctor"))])
async def get_doctor_notifications(
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get doctor notifications."""
    service = DoctorService(db)
    result = service.get_notifications(current_user.id, page=page, size=size)
    return APIResponse(success=True, message="Notifications retrieved", data=result)


@router.put("/notifications/{notification_id}/read", response_model=APIResponse, dependencies=[Depends(require_role("doctor"))])
async def mark_notification_read(
    notification_id: str,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Mark a notification as read."""
    service = DoctorService(db)
    service.mark_notification_read(current_user.id, notification_id)
    return APIResponse(success=True, message="Notification marked as read")


# ============================================
# AUTHENTICATED: EARNINGS
# ============================================
@router.get("/earnings", response_model=APIResponse, dependencies=[Depends(require_role("doctor"))])
async def get_doctor_earnings(
    period: str = Query("month", description="day, week, month, or year"),
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get doctor earnings data."""
    service = DoctorService(db)
    result = service.get_earnings(current_user.id, period)
    return APIResponse(success=True, message="Earnings retrieved", data=result)


# ============================================
# AUTHENTICATED: REVIEWS
# ============================================
@router.get("/reviews", response_model=APIResponse, dependencies=[Depends(require_role("doctor"))])
async def get_doctor_reviews(
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get doctor reviews."""
    service = DoctorService(db)
    result = service.get_reviews(current_user.id, page=page, size=size)
    return APIResponse(success=True, message="Reviews retrieved", data=result)


# ============================================
# AUTHENTICATED: PRESCRIPTIONS
# ============================================
@router.post("/prescriptions", response_model=APIResponse, dependencies=[Depends(require_role("doctor"))])
async def create_prescription(
    data: dict,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create a new prescription."""
    service = DoctorService(db)
    result = service.create_prescription(current_user.id, data)
    return APIResponse(success=True, message="Prescription created", data=result)


@router.get("/prescriptions", response_model=APIResponse, dependencies=[Depends(require_role("doctor"))])
async def get_doctor_prescriptions(
    patientId: Optional[str] = Query(None),
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get prescriptions written by the authenticated doctor."""
    service = DoctorService(db)
    result = service.get_prescriptions(current_user.id, patient_id=patientId)
    return APIResponse(success=True, message="Prescriptions retrieved", data=result)


# ============================================
# AUTHENTICATED: BLOOD REQUESTS
# ============================================
@router.get("/blood-requests", response_model=APIResponse, dependencies=[Depends(require_role("doctor"))])
async def get_blood_requests(
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get blood requests visible to the doctor."""
    from ..models.blood_donation import BloodRequest
    requests = db.query(BloodRequest).order_by(BloodRequest.created_at.desc()).limit(50).all()
    items = [
        {
            "id": r.id,
            "patient_id": r.patient_id,
            "blood_group": r.blood_group,
            "units": r.units,
            "urgency": r.urgency,
            "status": r.status,
            "required_date": str(r.required_date) if r.required_date else None,
            "reason": r.reason,
        }
        for r in requests
    ]
    return APIResponse(success=True, message="Blood requests retrieved", data=items)


@router.post("/blood-requests/{request_id}/approve", response_model=APIResponse, dependencies=[Depends(require_role("doctor"))])
async def approve_blood_request(
    request_id: str,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Approve a blood request."""
    from ..models.blood_donation import BloodRequest
    blood_req = db.query(BloodRequest).filter(BloodRequest.id == request_id).first()
    if not blood_req:
        from ...core.exceptions import NotFoundException
        raise NotFoundException("Blood request not found")
    blood_req.status = "approved"
    db.commit()
    return APIResponse(success=True, message="Blood request approved")
