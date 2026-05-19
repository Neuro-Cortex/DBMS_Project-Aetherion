"""
Real-time services using WebSocket for live updates
"""
from typing import Dict, Set, Any, Optional
from fastapi import WebSocket, WebSocketDisconnect
from app.core.security import security_manager
import json
import asyncio
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

class ConnectionManager:
    """WebSocket connection manager"""
    
    def __init__(self):
        self.active_connections: Dict[str, Dict[str, WebSocket]] = {}
        self.room_connections: Dict[str, Set[str]] = {}
    
    async def connect(self, websocket: WebSocket, user_id: str, client_id: str):
        """Accept WebSocket connection"""
        await websocket.accept()
        
        if user_id not in self.active_connections:
            self.active_connections[user_id] = {}
        
        self.active_connections[user_id][client_id] = websocket
        logger.info(f"User {user_id} connected with client {client_id}")
    
    async def disconnect(self, user_id: str, client_id: str):
        """Remove WebSocket connection"""
        if user_id in self.active_connections:
            self.active_connections[user_id].pop(client_id, None)
            
            if not self.active_connections[user_id]:
                del self.active_connections[user_id]
        
        # Remove from rooms
        for room in self.room_connections.values():
            room.discard(f"{user_id}:{client_id}")
        
        logger.info(f"User {user_id} disconnected client {client_id}")
    
    async def send_personal_message(
        self,
        user_id: str,
        message: Dict[str, Any],
        client_id: Optional[str] = None
    ):
        """Send message to specific user"""
        if user_id in self.active_connections:
            if client_id and client_id in self.active_connections[user_id]:
                await self.active_connections[user_id][client_id].send_json(message)
            else:
                for ws in self.active_connections[user_id].values():
                    await ws.send_json(message)
    
    async def broadcast_to_room(self, room: str, message: Dict[str, Any]):
        """Broadcast message to all users in a room"""
        if room in self.room_connections:
            for user_client in self.room_connections[room]:
                user_id, client_id = user_client.split(":")
                await self.send_personal_message(user_id, message, client_id)
    
    async def join_room(self, user_id: str, client_id: str, room: str):
        """Join user to a room"""
        if room not in self.room_connections:
            self.room_connections[room] = set()
        
        self.room_connections[room].add(f"{user_id}:{client_id}")
    
    async def leave_room(self, user_id: str, client_id: str, room: str):
        """Remove user from room"""
        if room in self.room_connections:
            self.room_connections[room].discard(f"{user_id}:{client_id}")

class RealtimeService:
    """Real-time notification and update service"""
    
    def __init__(self, manager: ConnectionManager):
        self.manager = manager
    
    async def notify_appointment_update(
        self,
        user_id: str,
        appointment_data: Dict[str, Any]
    ):
        """Send real-time appointment update"""
        message = {
            "type": "appointment_update",
            "data": appointment_data,
            "timestamp": datetime.utcnow().isoformat()
        }
        await self.manager.send_personal_message(user_id, message)
    
    async def notify_emergency_alert(
        self,
        user_ids: list,
        alert_data: Dict[str, Any]
    ):
        """Send emergency alert to multiple users"""
        message = {
            "type": "emergency_alert",
            "data": alert_data,
            "priority": "high",
            "timestamp": datetime.utcnow().isoformat()
        }
        
        for user_id in user_ids:
            await self.manager.send_personal_message(user_id, message)
    
    async def notify_blood_request(
        self,
        user_ids: list,
        request_data: Dict[str, Any]
    ):
        """Notify nearby donors about blood request"""
        message = {
            "type": "blood_request",
            "data": request_data,
            "timestamp": datetime.utcnow().isoformat()
        }
        
        for user_id in user_ids:
            await self.manager.send_personal_message(user_id, message)
    
    async def notify_medicine_reminder(
        self,
        user_id: str,
        reminder_data: Dict[str, Any]
    ):
        """Send medicine reminder"""
        message = {
            "type": "medicine_reminder",
            "data": reminder_data,
            "timestamp": datetime.utcnow().isoformat()
        }
        await self.manager.send_personal_message(user_id, message)
    
    async def broadcast_hospital_update(
        self,
        hospital_id: str,
        update_data: Dict[str, Any]
    ):
        """Broadcast hospital status update (ICU beds, blood stock, etc.)"""
        message = {
            "type": "hospital_update",
            "data": update_data,
            "timestamp": datetime.utcnow().isoformat()
        }
        room = f"hospital_{hospital_id}"
        await self.manager.broadcast_to_room(room, message)
    
    async def notify_doctor_status_change(
        self,
        doctor_id: str,
        status_data: Dict[str, Any]
    ):
        """Notify patients about doctor status change"""
        message = {
            "type": "doctor_status",
            "data": status_data,
            "timestamp": datetime.utcnow().isoformat()
        }
        room = f"doctor_{doctor_id}"
        await self.manager.broadcast_to_room(room, message)
    
    async def send_live_location_update(
        self,
        user_id: str,
        latitude: float,
        longitude: float
    ):
        """Send live location update (for ambulance tracking)"""
        message = {
            "type": "location_update",
            "data": {
                "latitude": latitude,
                "longitude": longitude
            },
            "timestamp": datetime.utcnow().isoformat()
        }
        await self.manager.send_personal_message(user_id, message)
    
    async def notify_pharmacy_order_update(
        self,
        user_id: str,
        order_data: Dict[str, Any]
    ):
        """Notify about pharmacy order status update"""
        message = {
            "type": "order_update",
            "data": order_data,
            "timestamp": datetime.utcnow().isoformat()
        }
        await self.manager.send_personal_message(user_id, message)

# Global instances
connection_manager = ConnectionManager()
realtime_service = RealtimeService(connection_manager)