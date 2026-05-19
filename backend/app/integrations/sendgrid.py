"""
SendGrid integration for email notifications
"""
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail, Attachment, FileContent, FileName, FileType, Disposition
from typing import Optional, Dict, Any, List
import base64
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

class SendGridClient:
    """SendGrid email client"""
    
    def __init__(self):
        self._client = None
        
        if settings.SENDGRID_API_KEY:
            self.initialize()
    
    def initialize(self):
        """Initialize SendGrid client"""
        try:
            self._client = SendGridAPIClient(settings.SENDGRID_API_KEY)
            logger.info("SendGrid initialized successfully")
        except Exception as e:
            logger.error(f"SendGrid initialization failed: {e}")
            self._client = None
    
    async def send_email(
        self,
        to_email: str,
        subject: str,
        content: str,
        template_id: Optional[str] = None,
        dynamic_data: Optional[Dict[str, Any]] = None,
        attachments: Optional[List[Dict]] = None
    ) -> bool:
        """Send email"""
        if not self._client:
            logger.warning("SendGrid not initialized")
            return False
        
        try:
            message = Mail(
                from_email=(settings.EMAIL_FROM, settings.EMAIL_FROM_NAME),
                to_emails=to_email,
                subject=subject,
                html_content=content
            )
            
            if template_id:
                message.template_id = template_id
            
            if dynamic_data:
                message.dynamic_template_data = dynamic_data
            
            if attachments:
                for att in attachments:
                    with open(att['file_path'], 'rb') as f:
                        file_data = f.read()
                    
                    encoded = base64.b64encode(file_data).decode()
                    
                    attachment = Attachment()
                    attachment.file_content = FileContent(encoded)
                    attachment.file_type = FileType(att['mime_type'])
                    attachment.file_name = FileName(att['filename'])
                    attachment.disposition = Disposition('attachment')
                    
                    message.attachment = attachment
            
            response = self._client.send(message)
            
            if response.status_code in [200, 201, 202]:
                logger.info(f"Email sent to {to_email}")
                return True
            else:
                logger.error(f"Email failed: {response.status_code}")
                return False
                
        except Exception as e:
            logger.error(f"Email sending failed: {e}")
            return False
    
    async def send_template_email(
        self,
        to_email: str,
        template_id: str,
        dynamic_data: Dict[str, Any]
    ) -> bool:
        """Send templated email"""
        return await self.send_email(
            to_email=to_email,
            subject="",  # Subject from template
            content="",  # Content from template
            template_id=template_id,
            dynamic_data=dynamic_data
        )
    
    async def send_bulk_emails(
        self,
        to_emails: List[str],
        subject: str,
        content: str
    ) -> int:
        """Send email to multiple recipients"""
        if not self._client:
            return 0
        
        success_count = 0
        for email in to_emails:
            result = await self.send_email(email, subject, content)
            if result:
                success_count += 1
        
        return success_count

sendgrid_client = SendGridClient()