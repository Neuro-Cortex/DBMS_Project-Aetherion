"""
Appointment repository with specialized queries
"""
from typing import Optional, List, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, func
from app.models.appointment import Appointment, Prescription
from app.repositories.base import BaseRepository
from datetime import datetime, date
import uuid

class AppointmentRepository(BaseRepository[Appointment]):
    """Appointment-specific repository"""
    
    def __init__(self, session: AsyncSession):
        super().__init__(Appointment, session)
    
    async def get_upcoming_appointments(
        self, user_id: uuid.UUID, skip: int = 0, limit: int = 20
    ) -> List[Appointment]:
        """Get upcoming appointments for user"""
        query = (
            select(Appointment)
            .where(
                and_(
                    Appointment.patient_id == user_id,
                    Appointment.appointment_date >= func.current_date(),
                    Appointment.status.in_(['scheduled', 'confirmed'])
                )
            )
            .order_by(Appointment.appointment_date.asc())
            .offset(skip)
            .limit(limit)
        )
        result = await self.session.execute(query)
        return result.scalars().all()
    
    async def get_appointment_history(
        self,
        user_id: uuid.UUID,
        status: Optional[str] = None,
        skip: int = 0,
        limit: int = 20
    ) -> List[Appointment]:
        """Get appointment history"""
        conditions = [Appointment.patient_id == user_id]
        
        if status:
            conditions.append(Appointment.status == status)
        
        query = (
            select(Appointment)
            .where(and_(*conditions))
            .order_by(Appointment.appointment_date.desc())
            .offset(skip)
            .limit(limit)
        )
        result = await self.session.execute(query)
        return result.scalars().all()
    
    async def get_doctor_appointments(
        self,
        doctor_id: uuid.UUID,
        appointment_date: Optional[date] = None,
        skip: int = 0,
        limit: int = 20
    ) -> List[Appointment]:
        """Get appointments for doctor"""
        conditions = [Appointment.doctor_id == doctor_id]
        
        if appointment_date:
            conditions.append(
                Appointment.appointment_date == appointment_date
            )
        
        query = (
            select(Appointment)
            .where(and_(*conditions))
            .order_by(Appointment.start_time.asc())
            .offset(skip)
            .limit(limit)
        )
        result = await self.session.execute(query)
        return result.scalars().all()
    
    async def get_today_appointments(
        self, doctor_id: uuid.UUID
    ) -> List[Appointment]:
        """Get today's appointments for doctor"""
        query = (
            select(Appointment)
            .where(
                and_(
                    Appointment.doctor_id == doctor_id,
                    Appointment.appointment_date == func.current_date(),
                    Appointment.status.in_(['scheduled', 'confirmed'])
                )
            )
            .order_by(Appointment.start_time.asc())
        )
        result = await self.session.execute(query)
        return result.scalars().all()
    
    async def check_slot_availability(
        self,
        doctor_id: uuid.UUID,
        appointment_date: date,
        start_time: str
    ) -> bool:
        """Check if appointment slot is available"""
        query = select(func.count()).where(
            and_(
                Appointment.doctor_id == doctor_id,
                Appointment.appointment_date == appointment_date,
                Appointment.start_time == start_time,
                Appointment.status.notin_(['cancelled', 'no_show'])
            )
        )
        result = await self.session.execute(query)
        count = result.scalar()
        
        return count == 0
    
    async def get_prescription(
        self, appointment_id: uuid.UUID
    ) -> Optional[Prescription]:
        """Get prescription for appointment"""
        query = select(Prescription).where(
            Prescription.appointment_id == appointment_id
        )
        result = await self.session.execute(query)
        return result.scalar_one_or_none()
    
    async def get_appointment_statistics(
        self, doctor_id: Optional[uuid.UUID] = None
    ) -> Dict:
        """Get appointment statistics"""
        conditions = []
        if doctor_id:
            conditions.append(Appointment.doctor_id == doctor_id)
        
        total = await self.session.scalar(
            select(func.count()).where(and_(*conditions))
        )
        
        completed = await self.session.scalar(
            select(func.count()).where(
                and_(*conditions, Appointment.status == 'completed')
            )
        )
        
        cancelled = await self.session.scalar(
            select(func.count()).where(
                and_(*conditions, Appointment.status == 'cancelled')
            )
        )
        
        return {
            "total": total or 0,
            "completed": completed or 0,
            "cancelled": cancelled or 0
        }