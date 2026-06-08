"""
Women's Health Service — Aetherion Healthcare

Handles menstrual cycle tracking, pregnancy management (Naegele's rule),
baby vaccines, growth records, and gynecologist consultations.
"""

from datetime import date, timedelta
from typing import Optional

from sqlalchemy.orm import Session
from sqlalchemy import desc

from ..models.women_health import (
    WomenMenstrualCycle,
    WomenPregnancy,
    WomenPregnancyTracking,
    BabyVaccine,
    BabyVaccineRecord,
    BabyGrowthRecord,
    BabyHealthRecord,
    GynecologistConsultation,
)
from ..models.user import User
from ..core.exceptions import NotFoundException, BadRequestException, ConflictException
from ..utils.helpers import build_pagination_meta


class WomenHealthService:
    """Service layer for women's health features."""

    def __init__(self, db: Session):
        self.db = db

    # ================================================================
    # MENSTRUAL CYCLE
    # ================================================================

    def get_menstrual_cycle(self, user_id: str) -> Optional[dict]:
        cycle = (
            self.db.query(WomenMenstrualCycle)
            .filter(WomenMenstrualCycle.user_id == user_id)
            .order_by(desc(WomenMenstrualCycle.created_at))
            .first()
        )
        if not cycle:
            return None
        return self._cycle_to_dict(cycle)

    def create_or_update_menstrual_cycle(self, user_id: str, data: dict) -> dict:
        existing = (
            self.db.query(WomenMenstrualCycle)
            .filter(WomenMenstrualCycle.user_id == user_id)
            .first()
        )

        start_date = data.get("start_date")
        if isinstance(start_date, str):
            start_date = date.fromisoformat(start_date)

        cycle_length = data.get("cycle_length", 28)
        period_length = data.get("period_length", 5)

        if existing:
            existing.start_date = start_date
            existing.cycle_length = cycle_length
            existing.period_length = period_length
            existing.flow_intensity = data.get("flow_intensity", existing.flow_intensity)
            existing.is_regular = data.get("is_regular", existing.is_regular)
            existing.symptoms = data.get("symptoms", existing.symptoms)
            existing.mood = data.get("mood", existing.mood)
            existing.notes = data.get("notes", existing.notes)
            existing.reminder_enabled = data.get("reminder_enabled", existing.reminder_enabled)
            existing.reminder_days = data.get("reminder_days", existing.reminder_days)
        else:
            existing = WomenMenstrualCycle(
                user_id=user_id,
                start_date=start_date,
                cycle_length=cycle_length,
                period_length=period_length,
                flow_intensity=data.get("flow_intensity", "medium"),
                is_regular=data.get("is_regular", True),
                symptoms=data.get("symptoms"),
                mood=data.get("mood"),
                notes=data.get("notes"),
                reminder_enabled=data.get("reminder_enabled", False),
                reminder_days=data.get("reminder_days", 2),
            )
            self.db.add(existing)

        # Predict next period, ovulation, fertile window
        if start_date and cycle_length:
            existing.next_period_date = start_date + timedelta(days=cycle_length)
            existing.ovulation_date = start_date + timedelta(days=cycle_length - 14)
            existing.fertile_window_start = start_date + timedelta(days=cycle_length - 18)
            existing.fertile_window_end = start_date + timedelta(days=cycle_length - 10)
            existing.is_prediction = False

        self.db.commit()
        self.db.refresh(existing)
        return self._cycle_to_dict(existing)

    def get_cycle_history(self, user_id: str, page: int = 1, size: int = 20) -> dict:
        query = (
            self.db.query(WomenMenstrualCycle)
            .filter(WomenMenstrualCycle.user_id == user_id)
            .order_by(desc(WomenMenstrualCycle.start_date))
        )
        total = query.count()
        results = query.offset((page - 1) * size).limit(size).all()
        return {
            "items": [self._cycle_to_dict(c) for c in results],
            **build_pagination_meta(total, page, size),
        }

    # ================================================================
    # PREGNANCY
    # ================================================================

    def get_pregnancy(self, user_id: str) -> Optional[dict]:
        pregnancy = (
            self.db.query(WomenPregnancy)
            .filter(WomenPregnancy.user_id == user_id, WomenPregnancy.status.in_(["active", "ongoing", "high-risk"]))
            .order_by(desc(WomenPregnancy.created_at))
            .first()
        )
        if not pregnancy:
            return None
        return self._pregnancy_to_dict(pregnancy)

    def create_pregnancy(self, user_id: str, data: dict) -> dict:
        # Check for existing active pregnancy
        existing = (
            self.db.query(WomenPregnancy)
            .filter(WomenPregnancy.user_id == user_id, WomenPregnancy.status.in_(["active", "ongoing", "high-risk"]))
            .first()
        )
        if existing:
            raise ConflictException("You already have an active pregnancy record")

        lmp_date = data.get("lmp_date")
        if isinstance(lmp_date, str):
            lmp_date = date.fromisoformat(lmp_date)

        if not lmp_date:
            raise BadRequestException("Last menstrual period date (lmp_date) is required")

        # Naegele's rule: EDD = LMP + 280 days (40 weeks)
        estimated_due_date = lmp_date + timedelta(days=280)
        current_week = max(0, (date.today() - lmp_date).days // 7)

        if current_week <= 13:
            trimester = "first"
        elif current_week <= 27:
            trimester = "second"
        else:
            trimester = "third"

        pregnancy = WomenPregnancy(
            user_id=user_id,
            lmp_date=lmp_date,
            estimated_due_date=estimated_due_date,
            current_week=current_week,
            current_trimester=trimester,
            pregnancy_number=data.get("pregnancy_number", 1),
            is_first_pregnancy=data.get("is_first_pregnancy", True),
            previous_pregnancies=data.get("previous_pregnancies", 0),
            high_risk=data.get("high_risk", False),
            risk_notes=data.get("risk_notes"),
            assigned_doctor_id=data.get("assigned_doctor_id"),
            notes=data.get("notes"),
        )
        self.db.add(pregnancy)
        self.db.commit()
        self.db.refresh(pregnancy)
        return self._pregnancy_to_dict(pregnancy)

    def update_pregnancy(self, user_id: str, data: dict) -> dict:
        pregnancy = (
            self.db.query(WomenPregnancy)
            .filter(WomenPregnancy.user_id == user_id, WomenPregnancy.status.in_(["active", "ongoing", "high-risk"]))
            .first()
        )
        if not pregnancy:
            raise NotFoundException("No active pregnancy record found")

        for field in ["high_risk", "risk_notes", "assigned_doctor_id", "baby_gender", "baby_name", "notes", "complications"]:
            if field in data:
                setattr(pregnancy, field, data[field])

        # Recalculate current week
        if pregnancy.lmp_date:
            pregnancy.current_week = max(0, (date.today() - pregnancy.lmp_date).days // 7)
            if pregnancy.current_week <= 13:
                pregnancy.current_trimester = "first"
            elif pregnancy.current_week <= 27:
                pregnancy.current_trimester = "second"
            else:
                pregnancy.current_trimester = "third"

        self.db.commit()
        self.db.refresh(pregnancy)
        return self._pregnancy_to_dict(pregnancy)

    def add_pregnancy_tracking(self, user_id: str, data: dict) -> dict:
        pregnancy = (
            self.db.query(WomenPregnancy)
            .filter(WomenPregnancy.user_id == user_id, WomenPregnancy.status.in_(["active", "ongoing", "high-risk"]))
            .first()
        )
        if not pregnancy:
            raise NotFoundException("No active pregnancy record found")

        recorded_at = data.get("recorded_at", date.today())
        if isinstance(recorded_at, str):
            recorded_at = date.fromisoformat(recorded_at)

        week_number = data.get("week_number", pregnancy.current_week)

        tracking = WomenPregnancyTracking(
            pregnancy_id=pregnancy.id,
            week_number=week_number,
            weight_kg=data.get("weight_kg"),
            blood_pressure_systolic=data.get("blood_pressure_systolic"),
            blood_pressure_diastolic=data.get("blood_pressure_diastolic"),
            blood_sugar=data.get("blood_sugar"),
            hemoglobin=data.get("hemoglobin"),
            fetal_movement_count=data.get("fetal_movement_count"),
            symptoms=data.get("symptoms"),
            notes=data.get("notes"),
            recorded_at=recorded_at,
        )
        self.db.add(tracking)
        self.db.commit()
        self.db.refresh(tracking)
        return {
            "id": tracking.id,
            "pregnancy_id": tracking.pregnancy_id,
            "week_number": tracking.week_number,
            "weight_kg": float(tracking.weight_kg) if tracking.weight_kg else None,
            "blood_pressure_systolic": tracking.blood_pressure_systolic,
            "blood_pressure_diastolic": tracking.blood_pressure_diastolic,
            "blood_sugar": float(tracking.blood_sugar) if tracking.blood_sugar else None,
            "hemoglobin": float(tracking.hemoglobin) if tracking.hemoglobin else None,
            "fetal_movement_count": tracking.fetal_movement_count,
            "symptoms": tracking.symptoms,
            "notes": tracking.notes,
            "recorded_at": str(tracking.recorded_at),
        }

    def get_pregnancy_tracking(self, pregnancy_id: str, page: int = 1, size: int = 20) -> dict:
        query = (
            self.db.query(WomenPregnancyTracking)
            .filter(WomenPregnancyTracking.pregnancy_id == pregnancy_id)
            .order_by(desc(WomenPregnancyTracking.week_number))
        )
        total = query.count()
        results = query.offset((page - 1) * size).limit(size).all()
        return {
            "items": [
                {
                    "id": t.id,
                    "week_number": t.week_number,
                    "weight_kg": float(t.weight_kg) if t.weight_kg else None,
                    "blood_pressure_systolic": t.blood_pressure_systolic,
                    "blood_pressure_diastolic": t.blood_pressure_diastolic,
                    "blood_sugar": float(t.blood_sugar) if t.blood_sugar else None,
                    "hemoglobin": float(t.hemoglobin) if t.hemoglobin else None,
                    "fetal_movement_count": t.fetal_movement_count,
                    "symptoms": t.symptoms,
                    "notes": t.notes,
                    "recorded_at": str(t.recorded_at),
                }
                for t in results
            ],
            **build_pagination_meta(total, page, size),
        }

    # ================================================================
    # BABY VACCINES
    # ================================================================

    def get_baby_vaccines(self, mother_id: str) -> list:
        babies = self.db.query(BabyVaccine).filter(BabyVaccine.mother_id == mother_id).all()
        result = []
        for baby in babies:
            vaccines = (
                self.db.query(BabyVaccineRecord)
                .filter(BabyVaccineRecord.baby_id == baby.id)
                .order_by(BabyVaccineRecord.scheduled_date)
                .all()
            )
            result.append({
                "id": baby.id,
                "baby_name": baby.baby_name,
                "date_of_birth": str(baby.date_of_birth),
                "gender": baby.gender,
                "blood_group": baby.blood_group,
                "vaccines": [
                    {
                        "id": v.id,
                        "vaccine_name": v.vaccine_name,
                        "disease": v.disease,
                        "dose_number": v.dose_number,
                        "scheduled_date": str(v.scheduled_date),
                        "administered_date": str(v.administered_date) if v.administered_date else None,
                        "status": v.status,
                        "next_dose_date": str(v.next_dose_date) if v.next_dose_date else None,
                    }
                    for v in vaccines
                ],
            })
        return result

    def add_baby_vaccine_record(self, mother_id: str, data: dict) -> dict:
        baby_id = data.get("baby_id")
        if not baby_id:
            raise BadRequestException("baby_id is required")

        baby = self.db.query(BabyVaccine).filter(BabyVaccine.id == baby_id, BabyVaccine.mother_id == mother_id).first()
        if not baby:
            raise NotFoundException("Baby not found")

        scheduled_date = data.get("scheduled_date", date.today())
        if isinstance(scheduled_date, str):
            scheduled_date = date.fromisoformat(scheduled_date)

        record = BabyVaccineRecord(
            baby_id=baby_id,
            vaccine_name=data["vaccine_name"],
            disease=data.get("disease"),
            dose_number=data.get("dose_number", 1),
            scheduled_date=scheduled_date,
            administered_date=data.get("administered_date"),
            administered_by=data.get("administered_by"),
            hospital_name=data.get("hospital_name"),
            batch_number=data.get("batch_number"),
            status=data.get("status", "scheduled"),
            next_dose_date=data.get("next_dose_date"),
            side_effects=data.get("side_effects"),
            certificate_url=data.get("certificate_url"),
        )
        self.db.add(record)
        self.db.commit()
        self.db.refresh(record)
        return {"id": record.id, "vaccine_name": record.vaccine_name, "status": record.status}

    def update_vaccine_status(self, record_id: str, data: dict) -> dict:
        record = self.db.query(BabyVaccineRecord).filter(BabyVaccineRecord.id == record_id).first()
        if not record:
            raise NotFoundException("Vaccine record not found")

        if "status" in data:
            record.status = data["status"]
        if data.get("status") == "completed" and not record.administered_date:
            record.administered_date = date.today()
        if "administered_date" in data:
            record.administered_date = data["administered_date"]
        if "next_dose_date" in data:
            record.next_dose_date = data["next_dose_date"]
        if "side_effects" in data:
            record.side_effects = data["side_effects"]

        self.db.commit()
        return {"id": record.id, "status": record.status}

    # ================================================================
    # BABY GROWTH RECORDS
    # ================================================================

    def add_growth_record(self, mother_id: str, data: dict) -> dict:
        baby_id = data.get("baby_id")
        baby = self.db.query(BabyVaccine).filter(BabyVaccine.id == baby_id, BabyVaccine.mother_id == mother_id).first()
        if not baby:
            raise NotFoundException("Baby not found")

        record_date = data.get("record_date", date.today())
        if isinstance(record_date, str):
            record_date = date.fromisoformat(record_date)

        weight_kg = data.get("weight_kg")
        height_cm = data.get("height_cm")
        head_cm = data.get("head_circumference_cm")

        # Calculate BMI if both weight and height available
        bmi = None
        if weight_kg and height_cm and height_cm > 0:
            height_m = height_cm / 100
            bmi = round(weight_kg / (height_m * height_m), 2)

        record = BabyGrowthRecord(
            baby_id=baby_id,
            record_date=record_date,
            age_months=data.get("age_months", 0),
            weight_kg=weight_kg,
            height_cm=height_cm,
            head_circumference_cm=head_cm,
            bmi=bmi,
            percentile=data.get("percentile"),
            notes=data.get("notes"),
        )
        self.db.add(record)
        self.db.commit()
        self.db.refresh(record)
        return {"id": record.id, "weight_kg": float(record.weight_kg) if record.weight_kg else None, "height_cm": float(record.height_cm) if record.height_cm else None}

    def get_growth_records(self, baby_id: str, page: int = 1, size: int = 20) -> dict:
        query = (
            self.db.query(BabyGrowthRecord)
            .filter(BabyGrowthRecord.baby_id == baby_id)
            .order_by(desc(BabyGrowthRecord.record_date))
        )
        total = query.count()
        results = query.offset((page - 1) * size).limit(size).all()
        return {
            "items": [
                {
                    "id": r.id,
                    "record_date": str(r.record_date),
                    "age_months": r.age_months,
                    "weight_kg": float(r.weight_kg) if r.weight_kg else None,
                    "height_cm": float(r.height_cm) if r.height_cm else None,
                    "head_circumference_cm": float(r.head_circumference_cm) if r.head_circumference_cm else None,
                    "bmi": float(r.bmi) if r.bmi else None,
                    "percentile": float(r.percentile) if r.percentile else None,
                    "notes": r.notes,
                }
                for r in results
            ],
            **build_pagination_meta(total, page, size),
        }

    # ================================================================
    # GYNECOLOGIST CONSULTATIONS
    # ================================================================

    def get_consultations(self, user_id: str, page: int = 1, size: int = 20) -> dict:
        query = (
            self.db.query(GynecologistConsultation)
            .filter(GynecologistConsultation.user_id == user_id)
            .order_by(desc(GynecologistConsultation.date))
        )
        total = query.count()
        results = query.offset((page - 1) * size).limit(size).all()
        return {
            "items": [self._consultation_to_dict(c) for c in results],
            **build_pagination_meta(total, page, size),
        }

    def create_consultation(self, user_id: str, data: dict) -> dict:
        consultation = GynecologistConsultation(
            user_id=user_id,
            doctor_name=data["doctor_name"],
            doctor_specialization=data.get("doctor_specialization"),
            hospital_name=data.get("hospital_name"),
            date=date.fromisoformat(data["date"]) if isinstance(data["date"], str) else data["date"],
            time=data.get("time"),
            type=data.get("type", "in-person"),
            reason=data.get("reason"),
            notes=data.get("notes"),
        )
        self.db.add(consultation)
        self.db.commit()
        self.db.refresh(consultation)
        return self._consultation_to_dict(consultation)

    def update_consultation(self, consultation_id: str, data: dict) -> dict:
        consultation = self.db.query(GynecologistConsultation).filter(GynecologistConsultation.id == consultation_id).first()
        if not consultation:
            raise NotFoundException("Consultation not found")

        for field in ["diagnosis", "prescription", "reports", "follow_up_date", "status", "notes"]:
            if field in data:
                setattr(consultation, field, data[field])

        self.db.commit()
        self.db.refresh(consultation)
        return self._consultation_to_dict(consultation)

    # ================================================================
    # DASHBOARD
    # ================================================================

    def get_dashboard(self, user_id: str) -> dict:
        pregnancy = self.get_pregnancy(user_id)
        cycle = self.get_menstrual_cycle(user_id)
        babies = self.db.query(BabyVaccine).filter(BabyVaccine.mother_id == user_id).all()

        upcoming_vaccines = []
        for baby in babies:
            records = (
                self.db.query(BabyVaccineRecord)
                .filter(BabyVaccineRecord.baby_id == baby.id, BabyVaccineRecord.status == "scheduled")
                .order_by(BabyVaccineRecord.scheduled_date)
                .limit(5)
                .all()
            )
            for r in records:
                upcoming_vaccines.append({
                    "baby_name": baby.baby_name,
                    "vaccine_name": r.vaccine_name,
                    "scheduled_date": str(r.scheduled_date),
                })

        return {
            "pregnancy": pregnancy,
            "menstrual_cycle": cycle,
            "baby_count": len(babies),
            "upcoming_vaccines": upcoming_vaccines[:10],
            "health_tips": [
                "Stay hydrated and eat a balanced diet rich in iron and calcium",
                "Take prenatal vitamins as prescribed by your doctor",
                "Exercise regularly with your doctor's approval",
                "Keep your vaccination schedule up to date",
            ],
        }

    # ================================================================
    # HELPERS
    # ================================================================

    def _cycle_to_dict(self, cycle: WomenMenstrualCycle) -> dict:
        return {
            "id": cycle.id,
            "start_date": str(cycle.start_date) if cycle.start_date else None,
            "end_date": str(cycle.end_date) if cycle.end_date else None,
            "cycle_length": cycle.cycle_length,
            "period_length": cycle.period_length,
            "flow_intensity": cycle.flow_intensity,
            "is_regular": cycle.is_regular,
            "symptoms": cycle.symptoms,
            "mood": cycle.mood,
            "notes": cycle.notes,
            "next_period_date": str(cycle.next_period_date) if cycle.next_period_date else None,
            "ovulation_date": str(cycle.ovulation_date) if cycle.ovulation_date else None,
            "fertile_window_start": str(cycle.fertile_window_start) if cycle.fertile_window_start else None,
            "fertile_window_end": str(cycle.fertile_window_end) if cycle.fertile_window_end else None,
            "reminder_enabled": cycle.reminder_enabled,
            "reminder_days": cycle.reminder_days,
        }

    def _pregnancy_to_dict(self, pregnancy: WomenPregnancy) -> dict:
        return {
            "id": pregnancy.id,
            "lmp_date": str(pregnancy.lmp_date) if pregnancy.lmp_date else None,
            "estimated_due_date": str(pregnancy.estimated_due_date) if pregnancy.estimated_due_date else None,
            "current_week": pregnancy.current_week,
            "current_trimester": pregnancy.current_trimester,
            "pregnancy_number": pregnancy.pregnancy_number,
            "is_first_pregnancy": pregnancy.is_first_pregnancy,
            "high_risk": pregnancy.high_risk,
            "risk_notes": pregnancy.risk_notes,
            "assigned_doctor_id": pregnancy.assigned_doctor_id,
            "baby_gender": pregnancy.baby_gender,
            "baby_name": pregnancy.baby_name,
            "status": pregnancy.status,
            "complications": pregnancy.complications,
            "notes": pregnancy.notes,
        }

    def _consultation_to_dict(self, c: GynecologistConsultation) -> dict:
        return {
            "id": c.id,
            "doctor_name": c.doctor_name,
            "doctor_specialization": c.doctor_specialization,
            "hospital_name": c.hospital_name,
            "date": str(c.date),
            "time": c.time,
            "type": c.type,
            "reason": c.reason,
            "diagnosis": c.diagnosis,
            "prescription": c.prescription,
            "reports": c.reports,
            "follow_up_date": str(c.follow_up_date) if c.follow_up_date else None,
            "status": c.status,
            "notes": c.notes,
        }
