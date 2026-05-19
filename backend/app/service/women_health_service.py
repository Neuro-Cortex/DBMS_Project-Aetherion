"""
Women health service with pregnancy and menstrual tracking
"""
from typing import Optional, List, Dict, Any
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from app.models.women_health import (
    WomenHealthProfile, PregnancyRecord, PregnancyAppointment,
    MenstrualLog, GynecologistVisit, BabyRecord
)
from app.utils.date_utils import DateUtils
from datetime import datetime, date, timedelta
import uuid
import logging

logger = logging.getLogger(__name__)

class WomenHealthService:
    """Women health management service"""
    
    def __init__(self, session: AsyncSession):
        self.session = session
    
    async def create_profile(
        self, user_id: uuid.UUID, data: Dict[str, Any]
    ) -> WomenHealthProfile:
        """Create women health profile"""
        query = select(WomenHealthProfile).where(
            WomenHealthProfile.user_id == user_id
        )
        result = await self.session.execute(query)
        existing = result.scalar_one_or_none()
        
        if existing:
            raise HTTPException(status_code=400, detail="Profile already exists")
        
        profile = WomenHealthProfile(user_id=user_id, **data)
        self.session.add(profile)
        await self.session.commit()
        return profile
    
    async def get_profile(self, user_id: uuid.UUID) -> Dict:
        """Get women health profile"""
        query = select(WomenHealthProfile).where(
            WomenHealthProfile.user_id == user_id
        )
        result = await self.session.execute(query)
        profile = result.scalar_one_or_none()
        
        if not profile:
            raise HTTPException(status_code=404, detail="Profile not found")
        
        return {
            "id": str(profile.id),
            "is_pregnant": profile.is_pregnant,
            "expected_delivery_date": profile.expected_delivery_date.isoformat() if profile.expected_delivery_date else None,
            "pregnancy_week": profile.pregnancy_week,
            "cycle_length_days": profile.cycle_length_days,
            "previous_pregnancies": profile.previous_pregnancies
        }
    
    async def update_profile(
        self, user_id: uuid.UUID, data: Dict[str, Any]
    ) -> WomenHealthProfile:
        """Update women health profile"""
        query = select(WomenHealthProfile).where(
            WomenHealthProfile.user_id == user_id
        )
        result = await self.session.execute(query)
        profile = result.scalar_one_or_none()
        
        if not profile:
            raise HTTPException(status_code=404, detail="Profile not found")
        
        for key, value in data.items():
            if hasattr(profile, key) and value is not None:
                setattr(profile, key, value)
        
        await self.session.commit()
        return profile
    
    async def start_pregnancy(
        self, user_id: uuid.UUID, data: Dict[str, Any]
    ) -> PregnancyRecord:
        """Start pregnancy tracking"""
        query = select(WomenHealthProfile).where(
            WomenHealthProfile.user_id == user_id
        )
        result = await self.session.execute(query)
        profile = result.scalar_one_or_none()
        
        if not profile:
            raise HTTPException(status_code=404, detail="Profile not found")
        
        pregnancy = PregnancyRecord(
            profile_id=profile.id,
            **data
        )
        
        self.session.add(pregnancy)
        
        # Update profile
        profile.is_pregnant = True
        profile.expected_delivery_date = data['expected_delivery_date']
        profile.pregnancy_week = (
            (date.today() - data['start_date']).days // 7
        )
        
        await self.session.commit()
        return pregnancy
    
    async def get_current_pregnancy(self, user_id: uuid.UUID) -> Dict:
        """Get current pregnancy record"""
        query = select(WomenHealthProfile).where(
            WomenHealthProfile.user_id == user_id
        )
        result = await self.session.execute(query)
        profile = result.scalar_one_or_none()
        
        if not profile:
            raise HTTPException(status_code=404, detail="Profile not found")
        
        query = select(PregnancyRecord).where(
            and_(
                PregnancyRecord.profile_id == profile.id,
                PregnancyRecord.is_active == True
            )
        )
        result = await self.session.execute(query)
        pregnancy = result.scalar_one_or_none()
        
        if not pregnancy:
            raise HTTPException(status_code=404, detail="No active pregnancy")
        
        return {
            "id": str(pregnancy.id),
            "pregnancy_number": pregnancy.pregnancy_number,
            "start_date": pregnancy.start_date.isoformat(),
            "expected_delivery_date": pregnancy.expected_delivery_date.isoformat(),
            "trimester": pregnancy.trimester,
            "week": (
                date.today() - pregnancy.start_date
            ).days // 7 if pregnancy.is_active else None,
            "days_remaining": (
                pregnancy.expected_delivery_date - date.today()
            ).days,
            "weight_gain_kg": pregnancy.weight_gain_kg,
            "next_appointment": pregnancy.next_appointment.isoformat() if pregnancy.next_appointment else None
        }
    
    async def update_pregnancy(
        self,
        user_id: uuid.UUID,
        pregnancy_id: uuid.UUID,
        data: Dict[str, Any]
    ) -> PregnancyRecord:
        """Update pregnancy record"""
        query = select(WomenHealthProfile).where(
            WomenHealthProfile.user_id == user_id
        )
        result = await self.session.execute(query)
        profile = result.scalar_one_or_none()
        
        if not profile:
            raise HTTPException(status_code=404, detail="Profile not found")
        
        pregnancy = await self.session.get(PregnancyRecord, pregnancy_id)
        if not pregnancy or pregnancy.profile_id != profile.id:
            raise HTTPException(status_code=404, detail="Pregnancy record not found")
        
        for key, value in data.items():
            if hasattr(pregnancy, key) and value is not None:
                setattr(pregnancy, key, value)
        
        if 'actual_delivery_date' in data:
            pregnancy.is_active = False
            profile.is_pregnant = False
        
        await self.session.commit()
        return pregnancy
    
    async def get_pregnancy_history(self, user_id: uuid.UUID) -> List[Dict]:
        """Get pregnancy history"""
        query = select(WomenHealthProfile).where(
            WomenHealthProfile.user_id == user_id
        )
        result = await self.session.execute(query)
        profile = result.scalar_one_or_none()
        
        if not profile:
            return []
        
        query = select(PregnancyRecord).where(
            PregnancyRecord.profile_id == profile.id
        ).order_by(PregnancyRecord.start_date.desc())
        
        result = await self.session.execute(query)
        
        return [
            {
                "id": str(p.id),
                "pregnancy_number": p.pregnancy_number,
                "start_date": p.start_date.isoformat(),
                "delivery_date": p.actual_delivery_date.isoformat() if p.actual_delivery_date else None,
                "delivery_type": p.delivery_type,
                "complications": p.delivery_complications
            }
            for p in result.scalars().all()
        ]
    
    async def log_menstrual_cycle(
        self, user_id: uuid.UUID, data: Dict[str, Any]
    ) -> MenstrualLog:
        """Log menstrual cycle"""
        query = select(WomenHealthProfile).where(
            WomenHealthProfile.user_id == user_id
        )
        result = await self.session.execute(query)
        profile = result.scalar_one_or_none()
        
        if not profile:
            raise HTTPException(status_code=404, detail="Profile not found")
        
        log = MenstrualLog(profile_id=profile.id, **data)
        self.session.add(log)
        
        # Update profile
        profile.last_menstrual_period = data['period_start']
        
        await self.session.commit()
        return log
    
    async def get_menstrual_logs(
        self, user_id: uuid.UUID, skip: int = 0, limit: int = 12
    ) -> List[Dict]:
        """Get menstrual logs"""
        query = select(WomenHealthProfile).where(
            WomenHealthProfile.user_id == user_id
        )
        result = await self.session.execute(query)
        profile = result.scalar_one_or_none()
        
        if not profile:
            return []
        
        query = select(MenstrualLog).where(
            MenstrualLog.profile_id == profile.id
        ).order_by(MenstrualLog.period_start.desc()).offset(skip).limit(limit)
        
        result = await self.session.execute(query)
        
        return [
            {
                "id": str(log.id),
                "period_start": log.period_start.isoformat(),
                "period_end": log.period_end.isoformat() if log.period_end else None,
                "flow_intensity": log.flow_intensity,
                "symptoms": log.symptoms,
                "pain_level": log.pain_level,
                "mood": log.mood
            }
            for log in result.scalars().all()
        ]
    
    async def predict_next_period(self, user_id: uuid.UUID) -> Dict:
        """Predict next period date"""
        query = select(WomenHealthProfile).where(
            WomenHealthProfile.user_id == user_id
        )
        result = await self.session.execute(query)
        profile = result.scalar_one_or_none()
        
        if not profile or not profile.last_menstrual_period:
            return {"prediction_available": False}
        
        cycle_length = profile.cycle_length_days or 28
        next_period = profile.last_menstrual_period + timedelta(days=cycle_length)
        
        return {
            "prediction_available": True,
            "next_period_date": next_period.isoformat(),
            "days_until": (next_period - date.today()).days,
            "cycle_length_days": cycle_length
        }
    
    async def get_fertility_window(self, user_id: uuid.UUID) -> Dict:
        """Get fertility window"""
        prediction = await self.predict_next_period(user_id)
        
        if not prediction.get('prediction_available'):
            return {"available": False}
        
        next_period = date.fromisoformat(prediction['next_period_date'])
        ovulation = next_period - timedelta(days=14)
        fertile_start = ovulation - timedelta(days=5)
        fertile_end = ovulation + timedelta(days=1)
        
        return {
            "available": True,
            "ovulation_date": ovulation.isoformat(),
            "fertile_window_start": fertile_start.isoformat(),
            "fertile_window_end": fertile_end.isoformat(),
            "is_fertile_today": fertile_start <= date.today() <= fertile_end
        }
    
    async def log_gynecologist_visit(
        self, user_id: uuid.UUID, data: Dict[str, Any]
    ) -> GynecologistVisit:
        """Log gynecologist visit"""
        query = select(WomenHealthProfile).where(
            WomenHealthProfile.user_id == user_id
        )
        result = await self.session.execute(query)
        profile = result.scalar_one_or_none()
        
        if not profile:
            raise HTTPException(status_code=404, detail="Profile not found")
        
        visit = GynecologistVisit(profile_id=profile.id, **data)
        self.session.add(visit)
        await self.session.commit()
        return visit
    
    async def get_gynecologist_visits(
        self, user_id: uuid.UUID, skip: int = 0, limit: int = 20
    ) -> List[GynecologistVisit]:
        """Get gynecologist visits"""
        query = select(WomenHealthProfile).where(
            WomenHealthProfile.user_id == user_id
        )
        result = await self.session.execute(query)
        profile = result.scalar_one_or_none()
        
        if not profile:
            return []
        
        query = select(GynecologistVisit).where(
            GynecologistVisit.profile_id == profile.id
        ).order_by(GynecologistVisit.visit_date.desc()).offset(skip).limit(limit)
        
        result = await self.session.execute(query)
        return result.scalars().all()
    
    async def add_baby_record(
        self, user_id: uuid.UUID, data: Dict[str, Any]
    ) -> BabyRecord:
        """Add baby record"""
        query = select(WomenHealthProfile).where(
            WomenHealthProfile.user_id == user_id
        )
        result = await self.session.execute(query)
        profile = result.scalar_one_or_none()
        
        if not profile:
            raise HTTPException(status_code=404, detail="Profile not found")
        
        baby = BabyRecord(mother_profile_id=profile.id, **data)
        self.session.add(baby)
        await self.session.commit()
        return baby
    
    async def get_baby_records(self, user_id: uuid.UUID) -> List[BabyRecord]:
        """Get baby records"""
        query = select(WomenHealthProfile).where(
            WomenHealthProfile.user_id == user_id
        )
        result = await self.session.execute(query)
        profile = result.scalar_one_or_none()
        
        if not profile:
            return []
        
        query = select(BabyRecord).where(
            BabyRecord.mother_profile_id == profile.id
        ).order_by(BabyRecord.date_of_birth.desc())
        
        result = await self.session.execute(query)
        return result.scalars().all()
    
    async def add_growth_record(
        self,
        user_id: uuid.UUID,
        baby_id: uuid.UUID,
        data: Dict[str, Any]
    ) -> Dict:
        """Add baby growth record"""
        baby = await self.session.get(BabyRecord, baby_id)
        if not baby:
            raise HTTPException(status_code=404, detail="Baby record not found")
        
        if not baby.growth_records:
            baby.growth_records = []
        
        baby.growth_records.append(data)
        await self.session.commit()
        
        return {"message": "Growth record added"}
    
    async def get_growth_records(
        self, user_id: uuid.UUID, baby_id: uuid.UUID
    ) -> List[Dict]:
        """Get baby growth records"""
        baby = await self.session.get(BabyRecord, baby_id)
        if not baby:
            raise HTTPException(status_code=404, detail="Baby record not found")
        
        return baby.growth_records or []
    
    async def add_vaccine_schedule(
        self,
        user_id: uuid.UUID,
        baby_id: uuid.UUID,
        data: Dict[str, Any]
    ) -> Dict:
        """Add baby vaccine schedule"""
        baby = await self.session.get(BabyRecord, baby_id)
        if not baby:
            raise HTTPException(status_code=404, detail="Baby record not found")
        
        if not baby.vaccination_records:
            baby.vaccination_records = []
        
        baby.vaccination_records.append(data)
        baby.next_vaccination_date = data.get('due_date')
        
        await self.session.commit()
        return {"message": "Vaccine schedule added"}
    
    async def get_vaccine_schedule(
        self, user_id: uuid.UUID, baby_id: uuid.UUID
    ) -> List[Dict]:
        """Get baby vaccine schedule"""
        baby = await self.session.get(BabyRecord, baby_id)
        if not baby:
            raise HTTPException(status_code=404, detail="Baby record not found")
        
        return baby.vaccination_records or []
    
    async def get_dashboard(self, user_id: uuid.UUID) -> Dict:
        """Get women health dashboard"""
        profile = await self.get_profile(user_id)
        
        dashboard = {"profile": profile}
        
        if profile.get('is_pregnant'):
            pregnancy = await self.get_current_pregnancy(user_id)
            dashboard['pregnancy'] = pregnancy
        
        period_prediction = await self.predict_next_period(user_id)
        dashboard['period_prediction'] = period_prediction
        
        fertility = await self.get_fertility_window(user_id)
        dashboard['fertility_window'] = fertility
        
        babies = await self.get_baby_records(user_id)
        dashboard['babies'] = [
            {
                "id": str(b.id),
                "name": b.name,
                "date_of_birth": b.date_of_birth.isoformat(),
                "next_vaccination": b.next_vaccination_date.isoformat() if b.next_vaccination_date else None
            }
            for b in babies
        ]
        
        return dashboard
    
    async def get_emergency_support(
        self, latitude: float, longitude: float
    ) -> List[Dict]:
        """Get emergency pregnancy support nearby"""
        from app.repositories.hospital_repository import HospitalRepository
        
        hospital_repo = HospitalRepository(self.session)
        hospitals = await hospital_repo.get_nearby_hospitals(
            latitude, longitude, radius_km=20, emergency_only=True
        )
        
        return [
            {
                "hospital_id": str(h.id),
                "name": h.name,
                "distance_km": round(d, 2),
                "emergency_phone": h.emergency_phone,
                "has_icu": h.available_icu_beds > 0
            }
            for h, d in hospitals
        ]