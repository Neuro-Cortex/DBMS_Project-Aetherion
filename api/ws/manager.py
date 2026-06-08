"""
WebSocket Connection Manager for Aetherion.

Manages connections, rooms, and message delivery for real-time features.
"""

from fastapi import WebSocket
from typing import Dict, List, Set, Optional, Any
import json
import asyncio

from ...core.logger import get_logger

logger = get_logger("ws.manager")


class ConnectionManager:
    """
    Manages WebSocket connections with support for:
    - Per-user connections (multiple tabs/devices)
    - Rooms (group broadcasts)
    - Targeted message delivery
    """

    def __init__(self):
        # user_id → list of WebSocket connections (multiple devices)
        self._connections: Dict[str, List[WebSocket]] = {}
        # room_id → set of user_ids in the room
        self._rooms: Dict[str, Set[str]] = {}
        # user_id → set of room_ids the user is in
        self._user_rooms: Dict[str, Set[str]] = {}

    async def connect(self, websocket: WebSocket, user_id: str) -> None:
        """Accept a WebSocket connection and register it for the user."""
        await websocket.accept()

        if user_id not in self._connections:
            self._connections[user_id] = []
        self._connections[user_id].append(websocket)

        logger.info(f"WebSocket connected: user {user_id} ({len(self._connections[user_id])} connections)")

    def disconnect(self, websocket: WebSocket, user_id: str) -> None:
        """Remove a WebSocket connection for a user."""
        if user_id in self._connections:
            self._connections[user_id] = [
                ws for ws in self._connections[user_id] if ws != websocket
            ]
            if not self._connections[user_id]:
                del self._connections[user_id]

                # Remove user from all rooms
                if user_id in self._user_rooms:
                    for room_id in self._user_rooms[user_id]:
                        if room_id in self._rooms:
                            self._rooms[room_id].discard(user_id)
                            if not self._rooms[room_id]:
                                del self._rooms[room_id]
                    del self._user_rooms[user_id]

        logger.info(f"WebSocket disconnected: user {user_id}")

    async def send_to_user(self, user_id: str, message: Any) -> bool:
        """Send a message to all connections of a specific user."""
        if user_id not in self._connections:
            return False

        disconnected = []
        for ws in self._connections[user_id]:
            try:
                if isinstance(message, dict):
                    await ws.send_json(message)
                else:
                    await ws.send_text(str(message))
            except Exception:
                disconnected.append(ws)

        # Clean up broken connections
        for ws in disconnected:
            self._connections[user_id].remove(ws)

        return len(disconnected) == 0

    async def send_to_room(self, room_id: str, message: Any) -> int:
        """Send a message to all users in a room. Returns delivery count."""
        if room_id not in self._rooms:
            return 0

        delivered = 0
        for user_id in self._rooms[room_id]:
            if await self.send_to_user(user_id, message):
                delivered += 1

        return delivered

    async def broadcast(self, message: Any) -> int:
        """Broadcast a message to all connected users. Returns delivery count."""
        delivered = 0
        for user_id in list(self._connections.keys()):
            if await self.send_to_user(user_id, message):
                delivered += 1
        return delivered

    def join_room(self, user_id: str, room_id: str) -> None:
        """Add a user to a room."""
        if room_id not in self._rooms:
            self._rooms[room_id] = set()
        self._rooms[room_id].add(user_id)

        if user_id not in self._user_rooms:
            self._user_rooms[user_id] = set()
        self._user_rooms[user_id].add(room_id)

    def leave_room(self, user_id: str, room_id: str) -> None:
        """Remove a user from a room."""
        if room_id in self._rooms:
            self._rooms[room_id].discard(user_id)
            if not self._rooms[room_id]:
                del self._rooms[room_id]

        if user_id in self._user_rooms:
            self._user_rooms[user_id].discard(room_id)

    def get_online_count(self) -> int:
        """Get the total number of connected users."""
        return len(self._connections)

    def get_total_connections(self) -> int:
        """Get the total number of active WebSocket connections."""
        return sum(len(conns) for conns in self._connections.values())

    def is_user_online(self, user_id: str) -> bool:
        """Check if a user has any active connections."""
        return user_id in self._connections and len(self._connections[user_id]) > 0

    def get_room_members(self, room_id: str) -> Set[str]:
        """Get all user IDs in a room."""
        return self._rooms.get(room_id, set())

    def get_user_rooms(self, user_id: str) -> Set[str]:
        """Get all room IDs a user is in."""
        return self._user_rooms.get(user_id, set())


# Singleton instance
manager = ConnectionManager()
