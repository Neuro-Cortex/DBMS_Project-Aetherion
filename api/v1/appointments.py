from fastapi import APIRouter, Depends, Query, Body, BackgroundTasks
from sqlalchemy.orm import Session
from typing import Optional

from ...core.database import get_db
from ...core.events import Event, EventType, get_event_bus
from ...schemas.common import APIResponse
from ...schemas.appointment import (
    BookAppointmentRequest, CancelAppointmentRequest,
    RescheduleAppointmentRequest,
)
from ...services.appointment_service import AppointmentService
from ...middleware.auth_middleware import get_current_user
from ...core.permissions import CurrentUser

router = APIRouter(prefix="/appointments", tags=["Appointments"])


# ============================================
# BOOK APPOINTMENT
# ============================================
@router.post("/", response_model=APIResponse)
async def book_appointment(
    data: BookAppointmentRequest,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
    background_tasks: BackgroundTasks = None,
):
    """Book a new appointment."""
    service = AppointmentService(db)
    appointment = service.book_appointment(data)
    event_bus = get_event_bus()
    await event_bus.dispatch(
        Event(type=EventType.APPOINTMENT_BOOKED, payload={"appointment_id": appointment.get("id") if isinstance(appointment, dict) else appointment.id, "patient_id": current_user.id, "doctor_id": data.doctor_id if hasattr(data, "doctor_id") else None}, user_id=current_user.id),
        bg_tasks=background_tasks,
    )
    return APIResponse(success=True, message="Appointment booked successfully", data=appointment)


# ============================================
# GET APPOINTMENT BY ID
# ============================================
@router.get("/{appointment_id}", response_model=APIResponse)
async def get_appointment(
    appointment_id: str,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get appointment details by ID."""
    service = AppointmentService(db)
    appointment = service.get_appointment_by_id(appointment_id)
    return APIResponse(success=True, message="Appointment retrieved", data=appointment)


# ============================================
# GET APPOINTMENTS BY USER (PATIENT)
# ============================================
@router.get("/user/{user_id}", response_model=APIResponse)
async def get_user_appointments(
    user_id: str,
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    status: Optional[str] = Query(None),
    dateFrom: Optional[str] = Query(None),
    dateTo: Optional[str] = Query(None),
    sortBy: str = Query("date"),
    sortOrder: str = Query("desc"),
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get all appointments for a specific user (patient)."""
    service = AppointmentService(db)
    result = service.get_user_appointments(
        user_id, page=page, size=size, status=status,
        date_from=dateFrom, date_to=dateTo,
        sort_by=sortBy, sort_order=sortOrder,
    )
    return APIResponse(success=True, message="Appointments retrieved", data=result)


# ============================================
# GET APPOINTMENTS BY DOCTOR
# ============================================
@router.get("/doctor/{doctor_id}", response_model=APIResponse)
async def get_doctor_appointments(
    doctor_id: str,
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    status: Optional[str] = Query(None),
    date: Optional[str] = Query(None),
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get all appointments for a specific doctor."""
    service = AppointmentService(db)
    result = service.get_doctor_appointments(
        doctor_id, page=page, size=size, status=status, date_filter=date,
    )
    return APIResponse(success=True, message="Appointments retrieved", data=result)


# ============================================
# CANCEL APPOINTMENT
# ============================================
@router.put("/{appointment_id}/cancel", response_model=APIResponse)
async def cancel_appointment(
    appointment_id: str,
    data: CancelAppointmentRequest,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
    background_tasks: BackgroundTasks = None,
):
    """Cancel an appointment."""
    service = AppointmentService(db)
    appointment = service.cancel_appointment(
        appointment_id, current_user.id, data.cancellation_reason,
    )
    event_bus = get_event_bus()
    await event_bus.dispatch(
        Event(type=EventType.APPOINTMENT_CANCELLED, payload={"appointment_id": appointment_id, "user_id": current_user.id, "reason": data.cancellation_reason}, user_id=current_user.id),
        bg_tasks=background_tasks,
    )
    return APIResponse(success=True, message="Appointment cancelled", data=appointment)


# ============================================
# RESCHEDULE APPOINTMENT
# ============================================
@router.put("/{appointment_id}/reschedule", response_model=APIResponse)
async def reschedule_appointment(
    appointment_id: str,
    data: RescheduleAppointmentRequest,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
    background_tasks: BackgroundTasks = None,
):
    """Reschedule an appointment."""
    service = AppointmentService(db)
    appointment = service.reschedule_appointment(
        appointment_id, current_user.id, data.new_date, data.new_time, data.reason,
    )
    event_bus = get_event_bus()
    await event_bus.dispatch(
        Event(type=EventType.APPOINTMENT_RESCHEDULED, payload={"appointment_id": appointment_id, "user_id": current_user.id, "new_date": str(data.new_date) if hasattr(data, "new_date") else None, "new_time": data.new_time if hasattr(data, "new_time") else None, "reason": data.reason if hasattr(data, "reason") else None}, user_id=current_user.id),
        bg_tasks=background_tasks,
    )
    return APIResponse(success=True, message="Appointment rescheduled", data=appointment)


# ============================================
# GET APPOINTMENT STATISTICS
# ============================================
@router.get("/statistics/summary", response_model=APIResponse)
async def get_appointment_statistics(
    userId: Optional[str] = Query(None),
    doctorId: Optional[str] = Query(None),
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get appointment statistics."""
    service = AppointmentService(db)
    stats = service.get_appointment_stats(user_id=userId, doctor_id=doctorId)
    return APIResponse(success=True, message="Statistics retrieved", data=stats)


# ============================================
# SEARCH APPOINTMENTS
# ============================================
@router.get("/search/results", response_model=APIResponse)
async def search_appointments(
    query: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    type: Optional[str] = Query(None),
    dateFrom: Optional[str] = Query(None),
    dateTo: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Search appointments with filters."""
    from ...models.appointment import Appointment
    from ...models.user import User
    from ...models.doctor import DoctorProfile
    from sqlalchemy import or_

    q = db.query(Appointment)

    # Filter by current user (patient or doctor)
    doctor_profile = db.query(DoctorProfile).filter(DoctorProfile.user_id == current_user.id).first()
    if doctor_profile:
        q = q.filter(or_(
            Appointment.patient_id == current_user.id,
            Appointment.doctor_id == doctor_profile.id,
        ))
    else:
        q = q.filter(Appointment.patient_id == current_user.id)

    if status:
        q = q.filter(Appointment.status == status)
    if type:
        q = q.filter(Appointment.type == type)
    if dateFrom:
        try:
            q = q.filter(Appointment.appointment_date >= __import__("datetime").date.fromisoformat(dateFrom))
        except ValueError:
            pass
    if dateTo:
        try:
            q = q.filter(Appointment.appointment_date <= __import__("datetime").date.fromisoformat(dateTo))
        except ValueError:
            pass

    q = q.order_by(Appointment.appointment_date.desc())
    total = q.count()
    appointments = q.offset((page - 1) * size).limit(size).all()

    from ...utils.helpers import build_pagination_meta
    service = AppointmentService(db)
    return APIResponse(
        success=True,
        message="Search results retrieved",
        data={
            "items": [service._build_response(a) for a in appointments],
            **build_pagination_meta(total, page, size),
        },
    )


# ============================================
# FILTER APPOINTMENTS (POST-based)
# ============================================
@router.post("/filter", response_model=APIResponse)
async def filter_appointments(
    filters: dict,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Filter appointments using POST body filters."""
    service = AppointmentService(db)
    # Reuse user appointments with provided filters
    result = service.get_user_appointments(
        current_user.id,
        page=filters.get("page", 1),
        size=filters.get("limit", 20),
        status=filters.get("status"),
        date_from=filters.get("dateFrom"),
        date_to=filters.get("dateTo"),
    )
    return APIResponse(success=True, message="Filtered appointments retrieved", data=result)


# ============================================
# GET APPOINTMENT DETAILS (with prescription)
# ============================================
@router.get("/{appointment_id}/details", response_model=APIResponse)
async def get_appointment_details(
    appointment_id: str,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get full appointment details including prescription if available."""
    service = AppointmentService(db)
    appointment = service.get_appointment_by_id(appointment_id)

    # Get associated prescription
    from ...models.appointment import Prescription, PrescriptionItem, PrescriptionTest
    prescription = db.query(Prescription).filter(
        Prescription.appointment_id == appointment_id,
    ).first()

    prescription_data = None
    if prescription:
        items = db.query(PrescriptionItem).filter(
            PrescriptionItem.prescription_id == prescription.id,
        ).all()
        tests = db.query(PrescriptionTest).filter(
            PrescriptionTest.prescription_id == prescription.id,
        ).all()
        prescription_data = {
            "id": prescription.id,
            "diagnosis": prescription.diagnosis,
            "advice": prescription.advice,
            "follow_up_date": str(prescription.follow_up_date) if prescription.follow_up_date else None,
            "status": prescription.status,
            "medications": [
                {
                    "name": i.medicine_name,
                    "dosage": i.dosage,
                    "frequency": i.frequency,
                    "duration": i.duration,
                    "timing": i.timing,
                    "instructions": i.instructions,
                }
                for i in items
            ],
            "tests": [
                {
                    "name": t.test_name,
                    "type": t.test_type,
                    "is_urgent": t.is_urgent,
                }
                for t in tests
            ],
        }

    result = appointment.model_dump() if hasattr(appointment, 'model_dump') else {}
    result["prescription"] = prescription_data
    return APIResponse(success=True, message="Appointment details retrieved", data=result)
