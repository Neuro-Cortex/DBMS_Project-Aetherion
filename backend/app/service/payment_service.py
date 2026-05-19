"""
Payment service for handling transactions
"""
from typing import Optional, Dict, Any
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.payment import Payment, PaymentMethod, InsuranceClaim
import uuid
import logging

logger = logging.getLogger(__name__)

class PaymentService:
    """Payment processing service"""
    
    def __init__(self, session: AsyncSession):
        self.session = session
    
    async def create_payment(
        self,
        user_id: uuid.UUID,
        amount: float,
        payment_type: str,
        reference_id: uuid.UUID,
        payment_method: str = "card"
    ) -> Payment:
        """Create payment record"""
        payment = Payment(
            user_id=user_id,
            amount=amount,
            payment_method=payment_method,
            payment_type=payment_type,
            reference_id=reference_id,
            status='pending'
        )
        
        self.session.add(payment)
        await self.session.commit()
        return payment
    
    async def process_payment(self, payment_id: uuid.UUID) -> Payment:
        """Process payment"""
        payment = await self.session.get(Payment, payment_id)
        if not payment:
            raise HTTPException(status_code=404, detail="Payment not found")
        
        # Simulate payment processing
        payment.status = 'completed'
        payment.transaction_id = str(uuid.uuid4())
        payment.gateway_response = {"success": True}
        
        await self.session.commit()
        return payment
    
    async def refund_payment(
        self, payment_id: uuid.UUID, reason: str
    ) -> Payment:
        """Refund payment"""
        payment = await self.session.get(Payment, payment_id)
        if not payment:
            raise HTTPException(status_code=404, detail="Payment not found")
        
        if payment.status != 'completed':
            raise HTTPException(status_code=400, detail="Can only refund completed payments")
        
        payment.status = 'refunded'
        payment.refund_amount = payment.amount
        payment.refund_reason = reason
        payment.refunded_at = datetime.utcnow()
        
        await self.session.commit()
        return payment
    
    async def add_payment_method(
        self, user_id: uuid.UUID, data: Dict[str, Any]
    ) -> PaymentMethod:
        """Add payment method"""
        method = PaymentMethod(user_id=user_id, **data)
        self.session.add(method)
        await self.session.commit()
        return method
    
    async def get_payment_methods(
        self, user_id: uuid.UUID
    ) -> list:
        """Get user payment methods"""
        from sqlalchemy import select
        
        query = select(PaymentMethod).where(
            PaymentMethod.user_id == user_id
        )
        result = await self.session.execute(query)
        return result.scalars().all()
    
    async def create_insurance_claim(
        self, user_id: uuid.UUID, data: Dict[str, Any]
    ) -> InsuranceClaim:
        """Create insurance claim"""
        claim = InsuranceClaim(user_id=user_id, **data)
        self.session.add(claim)
        await self.session.commit()
        return claim