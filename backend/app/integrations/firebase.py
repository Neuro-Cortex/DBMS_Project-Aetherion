"""
Firebase integration for push notifications and authentication
"""
import firebase_admin
from firebase_admin import credentials, messaging, auth
from typing import Optional, Dict, Any, List
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

class FirebaseClient:
    """Firebase client for push notifications"""
    
    def __init__(self):
        self._initialized = False
        self._app = None
        
        if settings.FIREBASE_CREDENTIALS_PATH:
            self.initialize()
    
    def initialize(self):
        """Initialize Firebase app"""
        try:
            cred = credentials.Certificate(settings.FIREBASE_CREDENTIALS_PATH)
            self._app = firebase_admin.initialize_app(cred, {
                'projectId': settings.FIREBASE_PROJECT_ID,
            })
            self._initialized = True
            logger.info("Firebase initialized successfully")
        except Exception as e:
            logger.error(f"Firebase initialization failed: {e}")
            self._initialized = False
    
    async def send_push_notification(
        self,
        token: str,
        title: str,
        body: str,
        data: Optional[Dict[str, str]] = None
    ) -> bool:
        """Send push notification to device"""
        if not self._initialized:
            logger.warning("Firebase not initialized")
            return False
        
        try:
            message = messaging.Message(
                notification=messaging.Notification(
                    title=title,
                    body=body
                ),
                data=data or {},
                token=token
            )
            
            response = messaging.send(message)
            logger.info(f"Push notification sent: {response}")
            return True
            
        except Exception as e:
            logger.error(f"Push notification failed: {e}")
            return False
    
    async def send_multicast(
        self,
        tokens: List[str],
        title: str,
        body: str,
        data: Optional[Dict[str, str]] = None
    ) -> int:
        """Send push notification to multiple devices"""
        if not self._initialized:
            return 0
        
        try:
            message = messaging.MulticastMessage(
                notification=messaging.Notification(
                    title=title,
                    body=body
                ),
                data=data or {},
                tokens=tokens
            )
            
            response = messaging.send_multicast(message)
            logger.info(f"Multicast sent: {response.success_count} successful")
            return response.success_count
            
        except Exception as e:
            logger.error(f"Multicast failed: {e}")
            return 0
    
    async def subscribe_to_topic(
        self, tokens: List[str], topic: str
    ) -> bool:
        """Subscribe devices to topic"""
        if not self._initialized:
            return False
        
        try:
            response = messaging.subscribe_to_topic(tokens, topic)
            logger.info(f"Subscribed to {topic}: {response.success_count}")
            return True
        except Exception as e:
            logger.error(f"Topic subscription failed: {e}")
            return False
    
    async def send_topic_notification(
        self,
        topic: str,
        title: str,
        body: str,
        data: Optional[Dict[str, str]] = None
    ) -> bool:
        """Send notification to topic"""
        if not self._initialized:
            return False
        
        try:
            message = messaging.Message(
                notification=messaging.Notification(
                    title=title,
                    body=body
                ),
                data=data or {},
                topic=topic
            )
            
            response = messaging.send(message)
            logger.info(f"Topic notification sent: {response}")
            return True
            
        except Exception as e:
            logger.error(f"Topic notification failed: {e}")
            return False
    
    async def verify_id_token(self, id_token: str) -> Optional[Dict]:
        """Verify Firebase ID token"""
        try:
            decoded_token = auth.verify_id_token(id_token)
            return decoded_token
        except Exception as e:
            logger.error(f"Token verification failed: {e}")
            return None

firebase_client = FirebaseClient()