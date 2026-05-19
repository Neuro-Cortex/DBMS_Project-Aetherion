"""
Appointment API endpoints
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.api.deps import get_current_user, require_doctor
from app.models.user import User
from app.services.appointment_service import AppointmentService
from app.api.v1.appointments.schemas import (
    AppointmentCreate, AppointmentReschedule, AppointmentCancel,
    PrescriptionCreate, MedicinePrescription, TestPrescription,
    AppointmentNote, VideoConsultationSetup
)
import uuid

router = APIRouter()

@router.post("/book")
async def book_appointment(
    data: AppointmentCreate,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    """Book new appointment"""
    service = AppointmentService(session)
    return await service.book_appointment(current_user.id, data.dict())

@router.get("/{appointment_id}")
async def get_appointment(
    appointment_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    """Get appointment details"""
    service = AppointmentService(session)
    return await service.get_appointment(current_user.id, appointment_id)

@router.get("/upcoming")
async def upcoming_appointments(
    current_user: User = Depends(get_current_user),
    skip: int = 0,
    limit: int = 20,
    session: AsyncSession = Depends(get_db)
):
    """Get upcoming appointments"""
    service = AppointmentService(session)
    return await service.get_upcoming_appointments(current_user.id, skip, limit)

@router.get("/history")
async def appointment_history(
    current_user: User = Depends(get_current_user),
    skip: int = 0,
    limit: int = 20,
    status: Optional[str] = None,
    session: AsyncSession = Depends(get_db)
):
    """Get appointment history"""
    service = AppointmentService(session)
    return await service.get_appointment_history(
        current_user.id, status, skip, limit
    )

@router.put("/{appointment_id}/reschedule")
async def reschedule_appointment(
    appointment_id: uuid.UUID,
    data: AppointmentReschedule,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    """Reschedule appointment"""
    service = AppointmentService(session)
    return await service.reschedule_appointment(
        current_user.id, appointment_id, data.dict()
    )

@router.put("/{appointment_id}/cancel")
async def cancel_appointment(
    appointment_id: uuid.UUID,
    data: AppointmentCancel,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    """Cancel appointment"""
    service = AppointmentService(session)
    return await service.cancel_appointment(
        current_user.id, appointment_id, data.cancellation_reason
    )

@router.post("/{appointment_id}/prescription")
async def create_prescription(
    appointment_id: uuid.UUID,
    data: PrescriptionCreate,
    current_user: User = Depends(require_doctor),
    session: AsyncSession = Depends(get_db)
):
    """Create prescription"""
    service = AppointmentService(session)
    return await service.create_prescription(
        current_user.id, appointment_id, data.dict()
    )

@router.post("/{appointment_id}/prescription/medicines")
async def add_prescription_medicine(
    appointment_id: uuid.UUID,
    data: MedicinePrescription,
    current_user: User = Depends(require_doctor),
    session: AsyncSession = Depends(get_db)
):
    """Add medicine to prescription"""
    service = AppointmentService(session)
    return await service.add_prescription_medicine(
        current_user.id, appointment_id, data.dict()
    )

@router.post("/{appointment_id}/prescription/tests")
async def add_prescription_test(
    appointment_id: uuid.UUID,
    data: TestPrescription,
    current_user: User = Depends(require_doctor),
    session: AsyncSession = Depends(get_db)
):
    """Add test to prescription"""
    service = AppointmentService(session)
    return await service.add_prescription_test(
        current_user.id, appointment_id, data.dict()
    )

@router.post("/{appointment_id}/notes")
async def add_appointment_note(
    appointment_id: uuid.UUID,
    data: AppointmentNote,
    current_user: User = Depends(require_doctor),
    session: AsyncSession = Depends(get_db)
):
    """Add appointment note"""
    service = AppointmentService(session)
    return await service.add_note(current_user.id, appointment_id, data.dict())

@router.post("/{appointment_id}/video-setup")
async def setup_video_consultation(
    appointment_id: uuid.UUID,
    data: VideoConsultationSetup,
    current_user: User = Depends(require_doctor),
    session: AsyncSession = Depends(get_db)
):
    """Setup video consultation"""
    service = AppointmentService(session)
    return await service.setup_video_consultation(
        current_user.id, appointment_id, data.dict()
    )

@router.get("/{appointment_id}/prescription")
async def view_prescription(
    appointment_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    """View prescription"""
    service = AppointmentService(session)
    return await service.view_prescription(current_user.id, appointment_id)

@router.get("/doctor/{doctor_id}/available-slots")
async def get_available_slots(
    doctor_id: uuid.UUID,
    date: str = Query(..., description="Date in YYYY-MM-DD format"),
    session: AsyncSession = Depends(get_db)
):
    """Get available appointment slots for doctor"""
    service = AppointmentService(session)
    return await service.get_available_slots(doctor_id, date)

@router.get("/doctor/dashboard")
async def doctor_appointment_dashboard(
    current_user: User = Depends(require_doctor),
    session: AsyncSession = Depends(get_db)
):
    """Get doctor's appointment dashboard"""
    service = AppointmentService(session)
    return await service.get_doctor_dashboard(current_user.id)