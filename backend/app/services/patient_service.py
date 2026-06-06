from sqlalchemy.orm import Session
from typing import Optional, List
from datetime import date, datetime

from ..models.user import User, UserProfile, UserEmergencyContact, UserAddress
from ..models.patient import (
    PatientHealthRecord, PatientVaccination, PatientMedication,
    PatientMedicalHistory, PatientSurgery,
)
from ..models.appointment import Appointment, Prescription, PrescriptionItem, PrescriptionTest
from ..models.doctor import DoctorProfile
from ..models.hospital import Hospital
from ..schemas.patient import (
    PatientProfileResponse, HealthRecordResponse,
    HealthRecordCreateRequest, PatientPrescriptionResponse,
    VaccinationResponse, MedicationResponse,
    MedicalHistoryResponse, SurgeryResponse, HealthTimelineEvent,
)
from ..core.exceptions import NotFoundException, ForbiddenException
from ..utils.helpers import build_pagination_meta


class PatientService:
    """Handles all patient-related business logic."""

    def __init__(self, db: Session):
        self.db = db

    # ============================================
    # GET PATIENT PROFILE
    # ============================================
    def get_patient_profile(self, patient_id: str, current_user_id: Optional[str] = None) -> PatientProfileResponse:
        user = self.db.query(User).filter(User.id == patient_id).first()
        if not user:
            raise NotFoundException("Patient not found")

        profile = self.db.query(UserProfile).filter(UserProfile.user_id == patient_id).first()
        emergency_contacts = self.db.query(UserEmergencyContact).filter(
            UserEmergencyContact.user_id == patient_id
        ).all()
        addresses = self.db.query(UserAddress).filter(UserAddress.user_id == patient_id).all()

        return PatientProfileResponse(
            id=user.id,
            full_name=user.full_name,
            email=user.email,
            phone=user.phone,
            gender=user.gender,
            date_of_birth=user.date_of_birth,
            blood_group=user.blood_group,
            profile_image=user.profile_image,
            is_active=user.is_active,
            is_verified=user.is_verified,
            created_at=user.created_at,
            bio=profile.bio if profile else None,
            height_cm=profile.height_cm if profile else None,
            weight_kg=profile.weight_kg if profile else None,
            allergies=profile.allergies if profile else None,
            chronic_conditions=profile.chronic_conditions if profile else None,
            insurance_provider=profile.insurance_provider if profile else None,
            insurance_policy_number=profile.insurance_policy_number if profile else None,
            emergency_contacts=[
                {
                    "id": ec.id,
                    "name": ec.name,
                    "relationship": ec.relationship,
                    "phone": ec.phone,
                    "is_primary": ec.is_primary,
                }
                for ec in emergency_contacts
            ],
            addresses=[
                {
                    "id": a.id,
                    "label": a.label,
                    "street": a.street,
                    "city": a.city,
                    "state": a.state,
                    "zip_code": a.zip_code,
                    "is_primary": a.is_primary,
                }
                for a in addresses
            ],
        )

    # ============================================
    # GET HEALTH RECORDS
    # ============================================
    def get_health_records(
        self, patient_id: str, record_type: Optional[str] = None,
        page: int = 1, size: int = 20,
    ) -> dict:
        query = self.db.query(PatientHealthRecord).filter(
            PatientHealthRecord.patient_id == patient_id,
        )

        if record_type:
            query = query.filter(PatientHealthRecord.record_type == record_type)

        query = query.order_by(PatientHealthRecord.created_at.desc())
        total = query.count()
        records = query.offset((page - 1) * size).limit(size).all()

        return {
            "items": [HealthRecordResponse.model_validate(r) for r in records],
            **build_pagination_meta(total, page, size),
        }

    def create_health_record(self, patient_id: str, data: HealthRecordCreateRequest) -> HealthRecordResponse:
        record = PatientHealthRecord(
            patient_id=patient_id,
            **data.model_dump(),
        )
        self.db.add(record)
        self.db.commit()
        self.db.refresh(record)
        return HealthRecordResponse.model_validate(record)

    # ============================================
    # GET PRESCRIPTIONS
    # ============================================
    def get_prescriptions(
        self, patient_id: str, page: int = 1, size: int = 20,
        status: Optional[str] = None,
    ) -> dict:
        query = self.db.query(Prescription).filter(
            Prescription.patient_id == patient_id,
        )

        if status:
            query = query.filter(Prescription.status == status)

        query = query.order_by(Prescription.created_at.desc())
        total = query.count()
        prescriptions = query.offset((page - 1) * size).limit(size).all()

        items = []
        for p in prescriptions:
            # Get doctor name
            doctor = self.db.query(DoctorProfile).filter(DoctorProfile.id == p.doctor_id).first()
            doctor_user = self.db.query(User).filter(User.id == doctor.user_id).first() if doctor else None
            hospital_name = None
            if p.hospital_id:
                hospital = self.db.query(Hospital).filter(Hospital.id == p.hospital_id).first()
                hospital_name = hospital.name if hospital else None

            # Get medications and tests
            medications = self.db.query(PrescriptionItem).filter(
                PrescriptionItem.prescription_id == p.id,
            ).all()
            tests = self.db.query(PrescriptionTest).filter(
                PrescriptionTest.prescription_id == p.id,
            ).all()

            items.append(PatientPrescriptionResponse(
                id=p.id,
                doctor_id=p.doctor_id,
                patient_id=p.patient_id,
                appointment_id=p.appointment_id,
                diagnosis=p.diagnosis,
                advice=p.advice,
                follow_up_date=p.follow_up_date,
                valid_until=p.valid_until,
                status=p.status,
                is_digital=p.is_digital,
                pdf_url=p.pdf_url,
                created_at=p.created_at,
                doctor_name=doctor_user.full_name if doctor_user else None,
                hospital_name=hospital_name,
                medications=[
                    {
                        "name": m.medicine_name,
                        "dosage": m.dosage,
                        "frequency": m.frequency,
                        "duration": m.duration,
                        "timing": m.timing,
                        "instructions": m.instructions,
                    }
                    for m in medications
                ],
                tests=[
                    {
                        "name": t.test_name,
                        "type": t.test_type,
                        "is_urgent": t.is_urgent,
                    }
                    for t in tests
                ],
            ))

        return {
            "items": items,
            **build_pagination_meta(total, page, size),
        }

    # ============================================
    # GET APPOINTMENTS
    # ============================================
    def get_patient_appointments(
        self, patient_id: str, page: int = 1, size: int = 20,
        status: Optional[str] = None,
    ) -> dict:
        query = self.db.query(Appointment).filter(
            Appointment.patient_id == patient_id,
        )

        if status:
            query = query.filter(Appointment.status == status)

        query = query.order_by(Appointment.appointment_date.desc(), Appointment.start_time)
        total = query.count()
        appointments = query.offset((page - 1) * size).limit(size).all()

        items = []
        for a in appointments:
            doctor = self.db.query(DoctorProfile).filter(DoctorProfile.id == a.doctor_id).first()
            doctor_user = self.db.query(User).filter(User.id == doctor.user_id).first() if doctor else None
            hospital_name = None
            if a.hospital_id:
                hospital = self.db.query(Hospital).filter(Hospital.id == a.hospital_id).first()
                hospital_name = hospital.name if hospital else None

            items.append({
                "id": a.id,
                "doctor_id": a.doctor_id,
                "doctor_name": doctor_user.full_name if doctor_user else None,
                "doctor_specialty": doctor.specialization if doctor else None,
                "doctor_avatar": doctor.profile_image if doctor else None,
                "hospital_id": a.hospital_id,
                "hospital_name": hospital_name,
                "appointment_date": str(a.appointment_date) if a.appointment_date else None,
                "start_time": str(a.start_time) if a.start_time else None,
                "type": a.type,
                "status": a.status,
                "location": a.location,
                "reason": a.reason,
                "fee": float(a.fee or 0),
                "payment_status": a.payment_status,
                "meeting_link": a.meeting_link or a.video_call_url,
                "created_at": str(a.created_at) if a.created_at else None,
            })

        return {
            "items": items,
            **build_pagination_meta(total, page, size),
        }

    # ============================================
    # GET VACCINATIONS
    # ============================================
    def get_vaccinations(self, patient_id: str) -> List[VaccinationResponse]:
        vaccinations = self.db.query(PatientVaccination).filter(
            PatientVaccination.patient_id == patient_id,
        ).order_by(PatientVaccination.administered_at.desc()).all()
        return [VaccinationResponse.model_validate(v) for v in vaccinations]

    # ============================================
    # GET MEDICATIONS
    # ============================================
    def get_medications(self, patient_id: str, active_only: bool = True) -> List[MedicationResponse]:
        query = self.db.query(PatientMedication).filter(
            PatientMedication.patient_id == patient_id,
        )
        if active_only:
            query = query.filter(PatientMedication.is_active == True)
        medications = query.order_by(PatientMedication.start_date.desc()).all()
        return [MedicationResponse.model_validate(m) for m in medications]

    # ============================================
    # GET MEDICAL HISTORY
    # ============================================
    def get_medical_history(self, patient_id: str) -> List[MedicalHistoryResponse]:
        history = self.db.query(PatientMedicalHistory).filter(
            PatientMedicalHistory.patient_id == patient_id,
        ).order_by(PatientMedicalHistory.diagnosed_date.desc()).all()
        return [MedicalHistoryResponse.model_validate(h) for h in history]

    # ============================================
    # GET SURGERIES
    # ============================================
    def get_surgeries(self, patient_id: str) -> List[SurgeryResponse]:
        surgeries = self.db.query(PatientSurgery).filter(
            PatientSurgery.patient_id == patient_id,
        ).order_by(PatientSurgery.surgery_date.desc()).all()
        return [SurgeryResponse.model_validate(s) for s in surgeries]

    # ============================================
    # HEALTH TIMELINE
    # ============================================
    def get_health_timeline(self, patient_id: str, page: int = 1, size: int = 20) -> dict:
        events = []

        # Appointments
        appointments = self.db.query(Appointment).filter(
            Appointment.patient_id == patient_id,
            Appointment.status == "completed",
        ).order_by(Appointment.appointment_date.desc()).limit(50).all()

        for a in appointments:
            doctor = self.db.query(DoctorProfile).filter(DoctorProfile.id == a.doctor_id).first()
            doctor_user = self.db.query(User).filter(User.id == doctor.user_id).first() if doctor else None
            events.append({
                "id": a.id,
                "type": "appointment",
                "title": f"Consultation with Dr. {doctor_user.full_name}" if doctor_user else "Appointment",
                "description": a.reason or "Doctor consultation",
                "date": str(a.appointment_date) if a.appointment_date else "",
                "icon": "stethoscope",
                "color": "blue",
            })

        # Health records
        records = self.db.query(PatientHealthRecord).filter(
            PatientHealthRecord.patient_id == patient_id,
        ).order_by(PatientHealthRecord.created_at.desc()).limit(50).all()

        for r in records:
            events.append({
                "id": r.id,
                "type": "report",
                "title": r.title,
                "description": r.description or f"{r.record_type} report",
                "date": str(r.created_at.date()) if r.created_at else "",
                "icon": "file-medical",
                "color": "green",
            })

        # Vaccinations
        vaccinations = self.db.query(PatientVaccination).filter(
            PatientVaccination.patient_id == patient_id,
            PatientVaccination.status == "completed",
        ).all()

        for v in vaccinations:
            events.append({
                "id": v.id,
                "type": "vaccine",
                "title": f"{v.vaccine_name} - Dose {v.dose_number}",
                "description": v.disease or "Vaccination",
                "date": str(v.administered_at) if v.administered_at else "",
                "icon": "syringe",
                "color": "purple",
            })

        # Sort all events by date
        events.sort(key=lambda x: x["date"], reverse=True)

        total = len(events)
        paginated = events[(page - 1) * size: page * size]

        return {
            "items": paginated,
            **build_pagination_meta(total, page, size),
        }

    # ============================================
    # HEALTH STATS
    # ============================================
    def get_health_stats(self, patient_id: str) -> dict:
        upcoming_appointments = self.db.query(Appointment).filter(
            Appointment.patient_id == patient_id,
            Appointment.appointment_date >= date.today(),
            Appointment.status.in_(["scheduled", "confirmed"]),
        ).count()

        active_prescriptions = self.db.query(Prescription).filter(
            Prescription.patient_id == patient_id,
            Prescription.status == "active",
        ).count()

        health_records = self.db.query(PatientHealthRecord).filter(
            PatientHealthRecord.patient_id == patient_id,
        ).count()

        active_medications = self.db.query(PatientMedication).filter(
            PatientMedication.patient_id == patient_id,
            PatientMedication.is_active == True,
        ).count()

        return {
            "upcoming_appointments": upcoming_appointments,
            "active_prescriptions": active_prescriptions,
            "medical_reports": health_records,
            "active_medications": active_medications,
        }
