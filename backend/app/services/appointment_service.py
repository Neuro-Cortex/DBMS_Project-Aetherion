from sqlalchemy.orm import Session
from sqlalchemy import or_, and_, func
from typing import Optional, List
from datetime import date, datetime, timedelta

from ..models.appointment import Appointment
from ..models.doctor import DoctorProfile
from ..models.hospital import Hospital
from ..models.user import User
from ..schemas.appointment import (
    BookAppointmentRequest, CancelAppointmentRequest,
    RescheduleAppointmentRequest, AppointmentResponse,
    AppointmentStatsResponse,
)
from ..core.exceptions import NotFoundException, ConflictException, BadRequestException
from ..utils.helpers import build_pagination_meta


class AppointmentService:
    """Handles all appointment-related business logic."""

    def __init__(self, db: Session):
        self.db = db

    # ============================================
    # BOOK APPOINTMENT
    # ============================================
    def book_appointment(self, data: BookAppointmentRequest) -> AppointmentResponse:
        # Verify doctor exists
        doctor = self.db.query(DoctorProfile).filter(DoctorProfile.id == data.doctor_id).first()
        if not doctor:
            raise NotFoundException("Doctor not found")

        # Verify patient exists
        patient = self.db.query(User).filter(User.id == data.patient_id).first()
        if not patient:
            raise NotFoundException("Patient not found")

        # Validate appointment type
        valid_types = ["consultation", "follow-up", "emergency", "checkup", "surgery", "lab-review"]
        if data.type not in valid_types:
            raise BadRequestException(f"Invalid appointment type. Must be one of: {valid_types}")

        # Validate location
        valid_locations = ["in-person", "video", "phone"]
        if data.location not in valid_locations:
            raise BadRequestException(f"Invalid location type. Must be one of: {valid_locations}")

        # Check for time slot conflicts
        existing = self.db.query(Appointment).filter(
            Appointment.doctor_id == data.doctor_id,
            Appointment.appointment_date == data.appointment_date,
            Appointment.start_time == data.start_time,
            Appointment.status.in_(["scheduled", "confirmed"]),
        ).first()
        if existing:
            raise ConflictException("This time slot is already booked. Please choose a different time.")

        # Determine end time
        duration = doctor.consultation_duration or 15
        try:
            start_h, start_m = map(int, data.start_time.split(":"))
            end_minutes = start_h * 60 + start_m + duration
            end_h = end_minutes // 60
            end_m = end_minutes % 60
            end_time = f"{end_h:02d}:{end_m:02d}"
        except (ValueError, AttributeError):
            end_time = None

        # Check if first visit
        is_first_visit = not self.db.query(Appointment).filter(
            Appointment.doctor_id == data.doctor_id,
            Appointment.patient_id == data.patient_id,
        ).first()

        # Determine fee
        fee = float(doctor.consultation_fee or 0)
        if data.type == "follow-up":
            fee = float(doctor.follow_up_fee or fee)
        elif data.location == "video":
            fee = float(doctor.video_consultation_fee or fee)

        # Create appointment
        appointment = Appointment(
            patient_id=data.patient_id,
            doctor_id=data.doctor_id,
            hospital_id=data.hospital_id,
            department_id=data.department_id,
            appointment_date=data.appointment_date,
            start_time=data.start_time,
            end_time=end_time,
            duration_minutes=duration,
            type=data.type,
            status="scheduled",
            location=data.location,
            priority=data.priority,
            reason=data.reason,
            symptoms=data.symptoms,
            notes=data.notes,
            is_emergency=data.is_emergency,
            is_first_visit=is_first_visit,
            fee=fee,
            payment_status="pending",
        )
        self.db.add(appointment)

        # Update or create doctor-patient relationship
        from ..models.doctor import DoctorPatient
        dp = self.db.query(DoctorPatient).filter(
            DoctorPatient.doctor_id == data.doctor_id,
            DoctorPatient.patient_id == data.patient_id,
        ).first()
        if dp:
            dp.total_visits = (dp.total_visits or 0) + 1
            dp.last_visit = data.appointment_date
        else:
            dp = DoctorPatient(
                doctor_id=data.doctor_id,
                patient_id=data.patient_id,
                total_visits=1,
                last_visit=data.appointment_date,
            )
            self.db.add(dp)

        self.db.commit()
        self.db.refresh(appointment)

        return self._build_response(appointment)

    # ============================================
    # GET APPOINTMENT BY ID
    # ============================================
    def get_appointment_by_id(self, appointment_id: str) -> AppointmentResponse:
        appointment = self.db.query(Appointment).filter(Appointment.id == appointment_id).first()
        if not appointment:
            raise NotFoundException("Appointment not found")
        return self._build_response(appointment)

    # ============================================
    # GET APPOINTMENTS BY USER (PATIENT)
    # ============================================
    def get_user_appointments(
        self, user_id: str, page: int = 1, size: int = 20,
        status: Optional[str] = None, date_from: Optional[str] = None,
        date_to: Optional[str] = None, sort_by: str = "date", sort_order: str = "desc",
    ) -> dict:
        query = self.db.query(Appointment).filter(Appointment.patient_id == user_id)

        if status:
            query = query.filter(Appointment.status == status)
        if date_from:
            try:
                query = query.filter(Appointment.appointment_date >= date.fromisoformat(date_from))
            except ValueError:
                pass
        if date_to:
            try:
                query = query.filter(Appointment.appointment_date <= date.fromisoformat(date_to))
            except ValueError:
                pass

        # Sorting
        if sort_by == "date":
            order_col = Appointment.appointment_date
        elif sort_by == "status":
            order_col = Appointment.status
        elif sort_by == "type":
            order_col = Appointment.type
        else:
            order_col = Appointment.appointment_date

        if sort_order == "desc":
            query = query.order_by(order_col.desc(), Appointment.start_time.desc())
        else:
            query = query.order_by(order_col.asc(), Appointment.start_time.asc())

        total = query.count()
        appointments = query.offset((page - 1) * size).limit(size).all()

        return {
            "items": [self._build_response(a) for a in appointments],
            **build_pagination_meta(total, page, size),
        }

    # ============================================
    # GET APPOINTMENTS BY DOCTOR
    # ============================================
    def get_doctor_appointments(
        self, doctor_id: str, page: int = 1, size: int = 20,
        status: Optional[str] = None, date_filter: Optional[str] = None,
    ) -> dict:
        query = self.db.query(Appointment).filter(Appointment.doctor_id == doctor_id)

        if status:
            query = query.filter(Appointment.status == status)
        if date_filter:
            try:
                query = query.filter(Appointment.appointment_date == date.fromisoformat(date_filter))
            except ValueError:
                pass

        query = query.order_by(Appointment.appointment_date.desc(), Appointment.start_time)
        total = query.count()
        appointments = query.offset((page - 1) * size).limit(size).all()

        return {
            "items": [self._build_response(a) for a in appointments],
            **build_pagination_meta(total, page, size),
        }

    # ============================================
    # CANCEL APPOINTMENT
    # ============================================
    def cancel_appointment(self, appointment_id: str, user_id: str, reason: str) -> AppointmentResponse:
        appointment = self.db.query(Appointment).filter(Appointment.id == appointment_id).first()
        if not appointment:
            raise NotFoundException("Appointment not found")

        # Verify user is the patient or doctor
        if appointment.patient_id != user_id and appointment.doctor_id != user_id:
            # Check if user is the doctor (via profile)
            doctor_profile = self.db.query(DoctorProfile).filter(
                DoctorProfile.user_id == user_id, DoctorProfile.id == appointment.doctor_id
            ).first()
            if not doctor_profile:
                raise BadRequestException("You can only cancel your own appointments")

        if appointment.status in ["completed", "cancelled"]:
            raise BadRequestException(f"Cannot cancel appointment with status: {appointment.status}")

        appointment.status = "cancelled"
        appointment.cancellation_reason = reason
        self.db.commit()
        self.db.refresh(appointment)

        return self._build_response(appointment)

    # ============================================
    # RESCHEDULE APPOINTMENT
    # ============================================
    def reschedule_appointment(
        self, appointment_id: str, user_id: str, new_date: date, new_time: str, reason: Optional[str] = None,
    ) -> AppointmentResponse:
        appointment = self.db.query(Appointment).filter(Appointment.id == appointment_id).first()
        if not appointment:
            raise NotFoundException("Appointment not found")

        # Verify ownership
        if appointment.patient_id != user_id:
            doctor_profile = self.db.query(DoctorProfile).filter(
                DoctorProfile.user_id == user_id, DoctorProfile.id == appointment.doctor_id
            ).first()
            if not doctor_profile:
                raise BadRequestException("You can only reschedule your own appointments")

        if appointment.status in ["completed", "cancelled"]:
            raise BadRequestException(f"Cannot reschedule appointment with status: {appointment.status}")

        # Check for conflicts at new time
        conflict = self.db.query(Appointment).filter(
            Appointment.doctor_id == appointment.doctor_id,
            Appointment.appointment_date == new_date,
            Appointment.start_time == new_time,
            Appointment.id != appointment_id,
            Appointment.status.in_(["scheduled", "confirmed"]),
        ).first()
        if conflict:
            raise ConflictException("The new time slot is already booked")

        # Store old schedule reference
        appointment.rescheduled_from = appointment.id
        appointment.appointment_date = new_date
        appointment.start_time = new_time
        appointment.status = "rescheduled"

        # Update end time based on doctor's consultation duration
        doctor = self.db.query(DoctorProfile).filter(DoctorProfile.id == appointment.doctor_id).first()
        duration = doctor.consultation_duration if doctor else 15
        try:
            start_h, start_m = map(int, new_time.split(":"))
            end_minutes = start_h * 60 + start_m + duration
            end_h = end_minutes // 60
            end_m = end_minutes % 60
            appointment.end_time = f"{end_h:02d}:{end_m:02d}"
        except (ValueError, AttributeError):
            pass

        self.db.commit()
        self.db.refresh(appointment)

        return self._build_response(appointment)

    # ============================================
    # GET APPOINTMENT STATISTICS
    # ============================================
    def get_appointment_stats(self, user_id: Optional[str] = None, doctor_id: Optional[str] = None) -> AppointmentStatsResponse:
        query = self.db.query(Appointment)

        if user_id:
            query = query.filter(Appointment.patient_id == user_id)
        elif doctor_id:
            query = query.filter(Appointment.doctor_id == doctor_id)

        total = query.count()
        if total == 0:
            return AppointmentStatsResponse()

        by_status = {}
        for status_val in ["scheduled", "confirmed", "in-progress", "completed", "cancelled", "no-show"]:
            count = self.db.query(Appointment).filter(
                Appointment.status == status_val,
            )
            if user_id:
                count = count.filter(Appointment.patient_id == user_id)
            elif doctor_id:
                count = count.filter(Appointment.doctor_id == doctor_id)
            by_status[status_val] = count.count()

        completed = by_status.get("completed", 0)
        cancelled = by_status.get("cancelled", 0)

        return AppointmentStatsResponse(
            total=total,
            scheduled=by_status.get("scheduled", 0),
            confirmed=by_status.get("confirmed", 0),
            in_progress=by_status.get("in-progress", 0),
            completed=completed,
            cancelled=cancelled,
            no_show=by_status.get("no-show", 0),
            completion_rate=round(completed / total * 100, 1) if total > 0 else 0,
            cancellation_rate=round(cancelled / total * 100, 1) if total > 0 else 0,
        )

    # ============================================
    # HELPER: BUILD RESPONSE WITH JOINED DATA
    # ============================================
    def _build_response(self, appointment: Appointment) -> AppointmentResponse:
        # Get doctor info
        doctor = self.db.query(DoctorProfile).filter(DoctorProfile.id == appointment.doctor_id).first()
        doctor_user = None
        if doctor:
            doctor_user = self.db.query(User).filter(User.id == doctor.user_id).first()

        # Get patient info
        patient = self.db.query(User).filter(User.id == appointment.patient_id).first()

        # Get hospital name
        hospital_name = None
        if appointment.hospital_id:
            hospital = self.db.query(Hospital).filter(Hospital.id == appointment.hospital_id).first()
            if hospital:
                hospital_name = hospital.name

        return AppointmentResponse(
            id=appointment.id,
            patient_id=appointment.patient_id,
            doctor_id=appointment.doctor_id,
            hospital_id=appointment.hospital_id,
            department_id=appointment.department_id,
            appointment_date=appointment.appointment_date,
            start_time=str(appointment.start_time) if appointment.start_time else None,
            end_time=str(appointment.end_time) if appointment.end_time else None,
            duration_minutes=appointment.duration_minutes,
            type=appointment.type,
            status=appointment.status,
            location=appointment.location,
            priority=appointment.priority,
            reason=appointment.reason,
            symptoms=appointment.symptoms,
            notes=appointment.notes,
            cancellation_reason=appointment.cancellation_reason,
            is_emergency=appointment.is_emergency or False,
            is_first_visit=appointment.is_first_visit or True,
            video_call_url=appointment.video_call_url,
            meeting_link=appointment.meeting_link,
            fee=float(appointment.fee or 0),
            payment_status=appointment.payment_status,
            created_at=appointment.created_at,
            updated_at=appointment.updated_at,
            doctor_name=doctor_user.full_name if doctor_user else None,
            doctor_specialty=doctor.specialization if doctor else None,
            doctor_avatar=doctor.profile_image if doctor else (doctor_user.profile_image if doctor_user else None),
            patient_name=patient.full_name if patient else None,
            patient_avatar=patient.profile_image if patient else None,
            hospital_name=hospital_name,
        )
