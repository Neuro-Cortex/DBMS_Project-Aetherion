from sqlalchemy.orm import Session
from sqlalchemy import or_, and_, func
from typing import Optional, List
from datetime import date, datetime, timedelta

from ..models.doctor import (
    DoctorProfile, DoctorAvailability, DoctorEarning,
    DoctorPatient, DoctorNotification, DoctorActivity,
)
from ..models.user import User
from ..models.appointment import Appointment
from ..schemas.doctor import (
    DoctorProfileResponse, DoctorProfileUpdateRequest,
    DoctorListItemResponse, DoctorAvailabilityResponse,
    DoctorAvailabilityCreateRequest, WeeklyScheduleUpdateRequest,
    DoctorDashboardResponse, DoctorPatientResponse,
    DoctorNotificationResponse, DoctorEarningsResponse,
    DoctorActivityResponse,
)
from ..core.exceptions import NotFoundException, ForbiddenException, BadRequestException
from ..utils.helpers import build_pagination_meta


class DoctorService:
    """Handles all doctor-related business logic."""

    def __init__(self, db: Session):
        self.db = db

    # ============================================
    # GET DOCTOR PROFILE BY USER ID
    # ============================================
    def get_profile_by_user_id(self, user_id: str) -> DoctorProfile:
        profile = self.db.query(DoctorProfile).filter(
            DoctorProfile.user_id == user_id
        ).first()
        if not profile:
            raise NotFoundException("Doctor profile not found")
        return profile

    # ============================================
    # GET DOCTOR PROFILE (with user info)
    # ============================================
    def get_doctor_profile(self, user_id: str) -> DoctorProfileResponse:
        profile = self.get_profile_by_user_id(user_id)
        user = self.db.query(User).filter(User.id == user_id).first()
        return self._build_profile_response(profile, user)

    # ============================================
    # UPDATE DOCTOR PROFILE
    # ============================================
    def update_doctor_profile(self, user_id: str, data: DoctorProfileUpdateRequest) -> DoctorProfileResponse:
        profile = self.get_profile_by_user_id(user_id)
        update_fields = data.model_dump(exclude_unset=True)
        for field, value in update_fields.items():
            setattr(profile, field, value)
        self.db.commit()
        self.db.refresh(profile)
        user = self.db.query(User).filter(User.id == user_id).first()
        return self._build_profile_response(profile, user)

    # ============================================
    # LIST DOCTORS (public browse/search)
    # ============================================
    def list_doctors(
        self,
        page: int = 1,
        size: int = 20,
        search: Optional[str] = None,
        specialization: Optional[str] = None,
        city: Optional[str] = None,
        is_verified: Optional[bool] = None,
        sort_by: str = "rating",
        sort_order: str = "desc",
    ) -> dict:
        query = (
            self.db.query(DoctorProfile, User)
            .join(User, User.id == DoctorProfile.user_id)
            .filter(DoctorProfile.is_active == True, User.is_active == True)
        )

        if search:
            search_term = f"%{search}%"
            query = query.filter(
                or_(
                    User.full_name.ilike(search_term),
                    DoctorProfile.specialization.ilike(search_term),
                    DoctorProfile.hospital_affiliation.ilike(search_term),
                    DoctorProfile.about.ilike(search_term),
                )
            )

        if specialization:
            query = query.filter(DoctorProfile.specialization.ilike(f"%{specialization}%"))

        if is_verified is not None:
            query = query.filter(DoctorProfile.is_verified == is_verified)

        # Sorting
        sort_column = DoctorProfile.rating
        if sort_by == "experience":
            sort_column = DoctorProfile.experience_years
        elif sort_by == "consultation_fee":
            sort_column = DoctorProfile.consultation_fee
        elif sort_by == "total_patients":
            sort_column = DoctorProfile.total_patients
        elif sort_by == "created_at":
            sort_column = DoctorProfile.created_at

        if sort_order == "desc":
            query = query.order_by(sort_column.desc())
        else:
            query = query.order_by(sort_column.asc())

        total = query.count()
        results = query.offset((page - 1) * size).limit(size).all()

        items = []
        for profile, user in results:
            items.append(DoctorListItemResponse(
                id=profile.id,
                user_id=profile.user_id,
                specialization=profile.specialization,
                experience_years=profile.experience_years or 0,
                consultation_fee=float(profile.consultation_fee or 0),
                hospital_affiliation=profile.hospital_affiliation,
                rating=float(profile.rating or 0),
                review_count=profile.review_count or 0,
                total_patients=profile.total_patients or 0,
                about=profile.about,
                profile_image=profile.profile_image or (user.profile_image if user else None),
                status=profile.status or "offline",
                is_online=profile.is_online or False,
                is_verified=profile.is_verified or False,
                full_name=user.full_name if user else None,
                gender=user.gender if user else None,
                created_at=profile.created_at,
            ))

        return {
            "items": items,
            **build_pagination_meta(total, page, size),
        }

    # ============================================
    # GET DOCTOR BY ID (public)
    # ============================================
    def get_doctor_by_id(self, doctor_id: str) -> DoctorProfileResponse:
        profile = self.db.query(DoctorProfile).filter(DoctorProfile.id == doctor_id).first()
        if not profile:
            raise NotFoundException("Doctor not found")
        user = self.db.query(User).filter(User.id == profile.user_id).first()
        return self._build_profile_response(profile, user)

    # ============================================
    # GET SPECIALTIES
    # ============================================
    def get_specialties(self) -> List[str]:
        results = (
            self.db.query(DoctorProfile.specialization)
            .filter(DoctorProfile.is_active == True)
            .distinct()
            .all()
        )
        return sorted([r[0] for r in results if r[0]])

    # ============================================
    # DOCTOR DASHBOARD
    # ============================================
    def get_dashboard(self, user_id: str) -> DoctorDashboardResponse:
        profile = self.get_profile_by_user_id(user_id)
        doctor_id = profile.id
        today = date.today()

        # Appointment counts
        today_appts = self.db.query(Appointment).filter(
            Appointment.doctor_id == doctor_id,
            Appointment.appointment_date == today,
        ).count()

        upcoming_appts = self.db.query(Appointment).filter(
            Appointment.doctor_id == doctor_id,
            Appointment.appointment_date >= today,
            Appointment.status.in_(["scheduled", "confirmed"]),
        ).count()

        completed = self.db.query(Appointment).filter(
            Appointment.doctor_id == doctor_id,
            Appointment.status == "completed",
        ).count()

        cancelled = self.db.query(Appointment).filter(
            Appointment.doctor_id == doctor_id,
            Appointment.status == "cancelled",
        ).count()

        # Earnings
        today_earnings = self._get_earnings_for_date(doctor_id, today)
        week_start = today - timedelta(days=today.weekday())
        month_start = today.replace(day=1)

        week_earnings = self._sum_earnings(doctor_id, week_start, today)
        month_earnings = self._sum_earnings(doctor_id, month_start, today)
        total_earnings = self._sum_earnings(doctor_id, None, None)

        # Recent activities
        activities = (
            self.db.query(DoctorActivity)
            .filter(DoctorActivity.doctor_id == doctor_id)
            .order_by(DoctorActivity.created_at.desc())
            .limit(10)
            .all()
        )

        # Notifications
        notifications = (
            self.db.query(DoctorNotification)
            .filter(DoctorNotification.doctor_id == doctor_id)
            .order_by(DoctorNotification.created_at.desc())
            .limit(10)
            .all()
        )

        return DoctorDashboardResponse(
            today_appointments=today_appts,
            upcoming_appointments=upcoming_appts,
            total_patients=profile.total_patients or 0,
            total_consultations=profile.total_consultations or 0,
            completed_appointments=completed,
            cancelled_appointments=cancelled,
            average_rating=float(profile.rating or 0),
            total_reviews=profile.review_count or 0,
            today_earnings=today_earnings,
            this_week_earnings=week_earnings,
            this_month_earnings=month_earnings,
            total_earnings=total_earnings,
            recent_activities=[self._activity_to_dict(a) for a in activities],
            notifications=[self._notification_to_dict(n) for n in notifications],
        )

    # ============================================
    # DOCTOR APPOINTMENTS
    # ============================================
    def get_doctor_appointments(
        self, user_id: str, date_filter: Optional[str] = None,
        status: Optional[str] = None, page: int = 1, size: int = 20,
    ) -> dict:
        profile = self.get_profile_by_user_id(user_id)
        query = self.db.query(Appointment).filter(Appointment.doctor_id == profile.id)

        if date_filter:
            try:
                appt_date = date.fromisoformat(date_filter)
                query = query.filter(Appointment.appointment_date == appt_date)
            except ValueError:
                pass

        if status:
            query = query.filter(Appointment.status == status)

        query = query.order_by(Appointment.appointment_date.desc(), Appointment.start_time)
        total = query.count()
        appointments = query.offset((page - 1) * size).limit(size).all()

        return {
            "items": [self._appointment_to_dict(a) for a in appointments],
            **build_pagination_meta(total, page, size),
        }

    # ============================================
    # UPDATE APPOINTMENT STATUS
    # ============================================
    def update_appointment_status(self, user_id: str, appointment_id: str, status: str) -> dict:
        profile = self.get_profile_by_user_id(user_id)
        appointment = self.db.query(Appointment).filter(
            Appointment.id == appointment_id,
            Appointment.doctor_id == profile.id,
        ).first()
        if not appointment:
            raise NotFoundException("Appointment not found")

        valid_statuses = ["confirmed", "in-progress", "completed", "cancelled", "no-show"]
        if status not in valid_statuses:
            raise BadRequestException(f"Invalid status. Must be one of: {valid_statuses}")

        appointment.status = status

        # Log activity
        activity = DoctorActivity(
            doctor_id=profile.id,
            type="appointment",
            description=f"Appointment status updated to {status}",
            status="completed",
        )
        self.db.add(activity)
        self.db.commit()

        return self._appointment_to_dict(appointment)

    # ============================================
    # DOCTOR PATIENTS
    # ============================================
    def get_doctor_patients(
        self, user_id: str, page: int = 1, size: int = 20, search: Optional[str] = None,
    ) -> dict:
        profile = self.get_profile_by_user_id(user_id)
        query = (
            self.db.query(DoctorPatient, User)
            .join(User, User.id == DoctorPatient.patient_id)
            .filter(DoctorPatient.doctor_id == profile.id, DoctorPatient.is_active == True)
        )

        if search:
            search_term = f"%{search}%"
            query = query.filter(User.full_name.ilike(search_term))

        total = query.count()
        results = query.offset((page - 1) * size).limit(size).all()

        items = []
        for dp, user in results:
            items.append(DoctorPatientResponse(
                id=dp.id,
                doctor_id=dp.doctor_id,
                patient_id=dp.patient_id,
                total_visits=dp.total_visits or 0,
                last_visit=dp.last_visit,
                is_active=dp.is_active,
                full_name=user.full_name,
                email=user.email,
                phone=user.phone,
                gender=user.gender,
                profile_image=user.profile_image,
                blood_group=user.blood_group,
            ))

        return {
            "items": items,
            **build_pagination_meta(total, page, size),
        }

    # ============================================
    # GET PATIENT DETAILS (for doctor view)
    # ============================================
    def get_patient_details(self, user_id: str, patient_id: str) -> dict:
        profile = self.get_profile_by_user_id(user_id)
        # Verify doctor-patient relationship
        dp = self.db.query(DoctorPatient).filter(
            DoctorPatient.doctor_id == profile.id,
            DoctorPatient.patient_id == patient_id,
        ).first()
        if not dp:
            raise ForbiddenException("You do not have access to this patient's details")

        patient = self.db.query(User).filter(User.id == patient_id).first()
        if not patient:
            raise NotFoundException("Patient not found")

        # Get patient health records
        from ..models.patient import PatientHealthRecord, PatientMedication, PatientMedicalHistory
        health_records = self.db.query(PatientHealthRecord).filter(
            PatientHealthRecord.patient_id == patient_id
        ).all()
        medications = self.db.query(PatientMedication).filter(
            PatientMedication.patient_id == patient_id, PatientMedication.is_active == True
        ).all()
        medical_history = self.db.query(PatientMedicalHistory).filter(
            PatientMedicalHistory.patient_id == patient_id
        ).all()

        return {
            "patient": {
                "id": patient.id,
                "full_name": patient.full_name,
                "email": patient.email,
                "phone": patient.phone,
                "gender": patient.gender,
                "date_of_birth": str(patient.date_of_birth) if patient.date_of_birth else None,
                "blood_group": patient.blood_group,
                "profile_image": patient.profile_image,
            },
            "total_visits": dp.total_visits,
            "last_visit": str(dp.last_visit) if dp.last_visit else None,
            "health_records": [self._health_record_to_dict(r) for r in health_records],
            "medications": [self._medication_to_dict(m) for m in medications],
            "medical_history": [self._medical_history_to_dict(h) for h in medical_history],
        }

    # ============================================
    # SCHEDULE MANAGEMENT
    # ============================================
    def get_schedule(self, user_id: str) -> List[DoctorAvailabilityResponse]:
        profile = self.get_profile_by_user_id(user_id)
        availabilities = (
            self.db.query(DoctorAvailability)
            .filter(DoctorAvailability.doctor_id == profile.id)
            .order_by(DoctorAvailability.day_of_week)
            .all()
        )
        return [DoctorAvailabilityResponse.model_validate(a) for a in availabilities]

    def update_schedule(self, user_id: str, data: WeeklyScheduleUpdateRequest) -> List[DoctorAvailabilityResponse]:
        profile = self.get_profile_by_user_id(user_id)
        # Remove existing schedule
        self.db.query(DoctorAvailability).filter(
            DoctorAvailability.doctor_id == profile.id
        ).delete()

        # Add new schedule entries
        for slot in data.schedule:
            availability = DoctorAvailability(
                doctor_id=profile.id,
                day_of_week=slot.day_of_week,
                start_time=slot.start_time,
                end_time=slot.end_time,
                max_patients=slot.max_patients,
                is_available=slot.is_available,
            )
            self.db.add(availability)

        self.db.commit()
        return self.get_schedule(user_id)

    # ============================================
    # TOGGLE ONLINE STATUS
    # ============================================
    def toggle_online_status(self, user_id: str, is_online: bool) -> dict:
        profile = self.get_profile_by_user_id(user_id)
        profile.is_online = is_online
        profile.status = "online" if is_online else "offline"
        self.db.commit()
        return {"is_online": is_online, "status": profile.status}

    # ============================================
    # NOTIFICATIONS
    # ============================================
    def get_notifications(self, user_id: str, page: int = 1, size: int = 20) -> dict:
        profile = self.get_profile_by_user_id(user_id)
        query = self.db.query(DoctorNotification).filter(
            DoctorNotification.doctor_id == profile.id
        ).order_by(DoctorNotification.created_at.desc())

        total = query.count()
        notifications = query.offset((page - 1) * size).limit(size).all()

        return {
            "items": [DoctorNotificationResponse.model_validate(n) for n in notifications],
            **build_pagination_meta(total, page, size),
        }

    def mark_notification_read(self, user_id: str, notification_id: str) -> None:
        profile = self.get_profile_by_user_id(user_id)
        notification = self.db.query(DoctorNotification).filter(
            DoctorNotification.id == notification_id,
            DoctorNotification.doctor_id == profile.id,
        ).first()
        if not notification:
            raise NotFoundException("Notification not found")
        notification.is_read = True
        self.db.commit()

    # ============================================
    # EARNINGS
    # ============================================
    def get_earnings(self, user_id: str, period: str = "month") -> dict:
        profile = self.get_profile_by_user_id(user_id)
        today = date.today()

        if period == "day":
            start_date = today
        elif period == "week":
            start_date = today - timedelta(days=today.weekday())
        elif period == "year":
            start_date = today.replace(month=1, day=1)
        else:
            start_date = today.replace(day=1)

        earnings = self.db.query(DoctorEarning).filter(
            DoctorEarning.doctor_id == profile.id,
            DoctorEarning.earning_date >= start_date,
        ).order_by(DoctorEarning.earning_date.desc()).all()

        total_amount = sum(float(e.total_amount or 0) for e in earnings)
        total_consultations = sum(e.consultations or 0 for e in earnings)
        total_video = sum(e.video_consultations or 0 for e in earnings)
        total_follow_ups = sum(e.follow_ups or 0 for e in earnings)

        return {
            "period": period,
            "start_date": str(start_date),
            "total_amount": total_amount,
            "breakdown": {
                "consultations": total_consultations,
                "video_consultations": total_video,
                "follow_ups": total_follow_ups,
            },
            "daily_earnings": [
                {
                    "date": str(e.earning_date),
                    "consultations": e.consultations,
                    "video_consultations": e.video_consultations,
                    "follow_ups": e.follow_ups,
                    "total_amount": float(e.total_amount or 0),
                }
                for e in earnings
            ],
        }

    # ============================================
    # REVIEWS
    # ============================================
    def get_reviews(self, user_id: str, page: int = 1, size: int = 20) -> dict:
        profile = self.get_profile_by_user_id(user_id)
        from ..models.review import UserReview
        query = self.db.query(UserReview).filter(
            UserReview.reviewed_entity_id == profile.id,
            UserReview.entity_type == "doctor",
        ).order_by(UserReview.created_at.desc())

        total = query.count()
        reviews = query.offset((page - 1) * size).limit(size).all()

        items = []
        for r in reviews:
            reviewer = self.db.query(User).filter(User.id == r.reviewer_id).first()
            items.append({
                "id": r.id,
                "rating": float(r.rating or 0),
                "comment": r.comment,
                "reviewer_name": reviewer.full_name if reviewer else "Anonymous",
                "reviewer_image": reviewer.profile_image if reviewer else None,
                "created_at": str(r.created_at) if r.created_at else None,
            })

        return {
            "items": items,
            **build_pagination_meta(total, page, size),
        }

    # ============================================
    # CREATE PRESCRIPTION
    # ============================================
    def create_prescription(self, user_id: str, data: dict) -> dict:
        profile = self.get_profile_by_user_id(user_id)

        from ..models.appointment import Prescription, PrescriptionItem, PrescriptionTest
        prescription = Prescription(
            appointment_id=data.get("appointment_id"),
            doctor_id=profile.id,
            patient_id=data.get("patient_id"),
            hospital_id=data.get("hospital_id"),
            diagnosis=data.get("diagnosis"),
            symptoms=data.get("symptoms"),
            advice=data.get("advice"),
            notes=data.get("notes"),
            follow_up_date=data.get("follow_up_date"),
            valid_until=data.get("valid_until"),
            is_digital=True,
            status="active",
        )
        self.db.add(prescription)
        self.db.flush()

        # Add medications
        medications = data.get("medications", [])
        for med in medications:
            item = PrescriptionItem(
                prescription_id=prescription.id,
                medicine_name=med.get("name", ""),
                dosage=med.get("dosage", ""),
                frequency=med.get("frequency", ""),
                duration=med.get("duration"),
                timing=med.get("timing"),
                route=med.get("route", "oral"),
                quantity=med.get("quantity", 1),
                refills=med.get("refills", 0),
                instructions=med.get("instructions"),
            )
            self.db.add(item)

        # Add tests
        tests = data.get("tests", [])
        for test in tests:
            t = PrescriptionTest(
                prescription_id=prescription.id,
                test_name=test.get("name", ""),
                test_type=test.get("type"),
                instructions=test.get("instructions"),
                is_urgent=test.get("is_urgent", False),
            )
            self.db.add(t)

        # Log activity
        activity = DoctorActivity(
            doctor_id=profile.id,
            type="prescription",
            description="Created a new prescription",
            patient_name=data.get("patient_name"),
            status="completed",
        )
        self.db.add(activity)
        self.db.commit()

        return {"id": prescription.id, "status": "created"}

    # ============================================
    # GET PRESCRIPTIONS
    # ============================================
    def get_prescriptions(self, user_id: str, patient_id: Optional[str] = None) -> list:
        profile = self.get_profile_by_user_id(user_id)
        from ..models.appointment import Prescription
        query = self.db.query(Prescription).filter(Prescription.doctor_id == profile.id)
        if patient_id:
            query = query.filter(Prescription.patient_id == patient_id)
        prescriptions = query.order_by(Prescription.created_at.desc()).all()

        return [
            {
                "id": p.id,
                "patient_id": p.patient_id,
                "appointment_id": p.appointment_id,
                "diagnosis": p.diagnosis,
                "advice": p.advice,
                "status": p.status,
                "created_at": str(p.created_at) if p.created_at else None,
            }
            for p in prescriptions
        ]

    # ============================================
    # AVAILABLE TIME SLOTS
    # ============================================
    def get_available_slots(self, doctor_id: str, date_str: str) -> List[dict]:
        profile = self.db.query(DoctorProfile).filter(DoctorProfile.id == doctor_id).first()
        if not profile:
            raise NotFoundException("Doctor not found")

        try:
            target_date = date.fromisoformat(date_str)
        except ValueError:
            raise BadRequestException("Invalid date format. Use YYYY-MM-DD.")

        day_of_week = target_date.weekday()
        # Convert to our 0=Sun format
        day_of_week = (day_of_week + 1) % 7

        availability = self.db.query(DoctorAvailability).filter(
            DoctorAvailability.doctor_id == doctor_id,
            DoctorAvailability.day_of_week == day_of_week,
            DoctorAvailability.is_available == True,
        ).all()

        # Get existing appointments for that date
        booked = self.db.query(Appointment).filter(
            Appointment.doctor_id == doctor_id,
            Appointment.appointment_date == target_date,
            Appointment.status.in_(["scheduled", "confirmed", "in-progress"]),
        ).all()

        booked_times = {a.start_time.strftime("%H:%M") if hasattr(a.start_time, 'strftime') else str(a.start_time) for a in booked}

        slots = []
        for avail in availability:
            start = avail.start_time
            end = avail.end_time
            duration = profile.consultation_duration or 15

            # Generate time slots
            try:
                start_h, start_m = map(int, start.split(":"))
                end_h, end_m = map(int, end.split(":"))
            except (ValueError, AttributeError):
                continue

            current_minutes = start_h * 60 + start_m
            end_minutes = end_h * 60 + end_m

            while current_minutes + duration <= end_minutes:
                slot_h = current_minutes // 60
                slot_m = current_minutes % 60
                slot_time = f"{slot_h:02d}:{slot_m:02d}"

                is_booked = slot_time in booked_times
                slots.append({
                    "time": slot_time,
                    "duration": duration,
                    "is_available": not is_booked,
                })
                current_minutes += duration

        return slots

    # ============================================
    # HELPER METHODS
    # ============================================
    def _build_profile_response(self, profile: DoctorProfile, user: Optional[User]) -> DoctorProfileResponse:
        return DoctorProfileResponse(
            id=profile.id,
            user_id=profile.user_id,
            specialization=profile.specialization,
            sub_specializations=profile.sub_specializations,
            license_number=profile.license_number,
            medical_council=profile.medical_council,
            experience_years=profile.experience_years or 0,
            qualifications=profile.qualifications,
            consultation_fee=float(profile.consultation_fee or 0),
            follow_up_fee=float(profile.follow_up_fee or 0),
            video_consultation_fee=float(profile.video_consultation_fee or 0),
            hospital_affiliation=profile.hospital_affiliation,
            department=profile.department,
            designation=profile.designation,
            languages=profile.languages,
            is_verified=profile.is_verified or False,
            rating=float(profile.rating or 0),
            review_count=profile.review_count or 0,
            total_patients=profile.total_patients or 0,
            total_consultations=profile.total_consultations or 0,
            success_rate=float(profile.success_rate or 0),
            about=profile.about,
            profile_image=profile.profile_image or (user.profile_image if user else None),
            cover_image=profile.cover_image,
            achievements=profile.achievements,
            awards=profile.awards,
            publications=profile.publications,
            memberships=profile.memberships,
            status=profile.status or "offline",
            is_online=profile.is_online or False,
            is_active=profile.is_active or True,
            max_patients_per_day=profile.max_patients_per_day or 30,
            consultation_duration=profile.consultation_duration or 15,
            consultation_modes=profile.consultation_modes,
            full_name=user.full_name if user else None,
            email=user.email if user else None,
            phone=user.phone if user else None,
            gender=user.gender if user else None,
            date_of_birth=user.date_of_birth if user else None,
            created_at=profile.created_at,
        )

    def _get_earnings_for_date(self, doctor_id: str, target_date: date) -> float:
        earning = self.db.query(DoctorEarning).filter(
            DoctorEarning.doctor_id == doctor_id,
            DoctorEarning.earning_date == target_date,
        ).first()
        return float(earning.total_amount or 0) if earning else 0.0

    def _sum_earnings(self, doctor_id: str, start: Optional[date], end: Optional[date]) -> float:
        query = self.db.query(func.sum(DoctorEarning.total_amount)).filter(
            DoctorEarning.doctor_id == doctor_id,
        )
        if start:
            query = query.filter(DoctorEarning.earning_date >= start)
        if end:
            query = query.filter(DoctorEarning.earning_date <= end)
        result = query.scalar()
        return float(result or 0)

    def _appointment_to_dict(self, a: Appointment) -> dict:
        # Get patient name
        patient = self.db.query(User).filter(User.id == a.patient_id).first()
        return {
            "id": a.id,
            "patient_id": a.patient_id,
            "patient_name": patient.full_name if patient else None,
            "patient_phone": patient.phone if patient else None,
            "patient_email": patient.email if patient else None,
            "doctor_id": a.doctor_id,
            "hospital_id": a.hospital_id,
            "appointment_date": str(a.appointment_date) if a.appointment_date else None,
            "start_time": str(a.start_time) if a.start_time else None,
            "end_time": str(a.end_time) if a.end_time else None,
            "duration_minutes": a.duration_minutes,
            "type": a.type,
            "status": a.status,
            "location": a.location,
            "priority": a.priority,
            "reason": a.reason,
            "symptoms": a.symptoms,
            "notes": a.notes,
            "is_emergency": a.is_emergency,
            "is_first_visit": a.is_first_visit,
            "meeting_link": a.meeting_link or a.video_call_url,
            "fee": float(a.fee or 0),
            "payment_status": a.payment_status,
            "cancellation_reason": a.cancellation_reason,
            "created_at": str(a.created_at) if a.created_at else None,
            "updated_at": str(a.updated_at) if a.updated_at else None,
        }

    def _activity_to_dict(self, a: DoctorActivity) -> dict:
        return {
            "id": a.id,
            "type": a.type,
            "description": a.description,
            "patient_name": a.patient_name,
            "status": a.status,
            "created_at": str(a.created_at) if a.created_at else None,
        }

    def _notification_to_dict(self, n: DoctorNotification) -> dict:
        return {
            "id": n.id,
            "type": n.type,
            "title": n.title,
            "message": n.message,
            "is_read": n.is_read,
            "action_url": n.action_url,
            "priority": n.priority,
            "created_at": str(n.created_at) if n.created_at else None,
        }

    def _health_record_to_dict(self, r) -> dict:
        return {
            "id": r.id,
            "record_type": r.record_type,
            "title": r.title,
            "description": r.description,
            "file_url": r.file_url,
            "created_at": str(r.created_at) if r.created_at else None,
        }

    def _medication_to_dict(self, m) -> dict:
        return {
            "id": m.id,
            "medicine_name": m.medicine_name,
            "dosage": m.dosage,
            "frequency": m.frequency,
            "start_date": str(m.start_date) if m.start_date else None,
            "end_date": str(m.end_date) if m.end_date else None,
            "is_active": m.is_active,
        }

    def _medical_history_to_dict(self, h) -> dict:
        return {
            "id": h.id,
            "condition_name": h.condition_name,
            "status": h.status,
            "diagnosed_date": str(h.diagnosed_date) if h.diagnosed_date else None,
            "notes": h.notes,
        }
