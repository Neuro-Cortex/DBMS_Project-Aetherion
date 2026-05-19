"""
Twilio integration for SMS notifications
"""
from twilio.rest import Client
from typing import Optional
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

class TwilioClient:
    """Twilio SMS client"""
    
    def __init__(self):
        self._client = None
        
        if settings.TWILIO_ACCOUNT_SID and settings.TWILIO_AUTH_TOKEN:
            self.initialize()
    
    def initialize(self):
        """Initialize Twilio client"""
        try:
            self._client = Client(
                settings.TWILIO_ACCOUNT_SID,
                settings.TWILIO_AUTH_TOKEN
            )
            logger.info("Twilio initialized successfully")
        except Exception as e:
            logger.error(f"Twilio initialization failed: {e}")
            self._client = None
    
    async def send_sms(
        self,
        to_number: str,
        message: str
    ) -> Optional[str]:
        """Send SMS message"""
        if not self._client:
            logger.warning("Twilio not initialized")
            return None
        
        try:
            twilio_message = self._client.messages.create(
                body=message,
                from_=settings.TWILIO_PHONE_NUMBER,
                to=to_number
            )
            
            logger.info(f"SMS sent to {to_number}: {twilio_message.sid}")
            return twilio_message.sid
            
        except Exception as e:
            logger.error(f"SMS sending failed: {e}")
            return None
    
    async def send_bulk_sms(
        self,
        numbers: list,
        message: str
    ) -> int:
        """Send SMS to multiple numbers"""
        if not self._client:
            return 0
        
        success_count = 0
        for number in numbers:
            result = await self.send_sms(number, message)
            if result:
                success_count += 1
        
        return success_count
    
    async def send_otp(self, phone_number: str, otp: str) -> bool:
        """Send OTP via SMS"""
        message = f"Your Aetherion Healthcare verification code is: {otp}. Valid for 10 minutes."
        result = await self.send_sms(phone_number, message)
        return result is not None

twilio_client = TwilioClient()