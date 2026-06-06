from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime

from ..models.messaging import Message, Notification
from ..models.user import User
from ..schemas.messaging import (
    MessageCreateRequest, MessageResponse,
    NotificationResponse, NotificationCreateRequest,
)
from ..core.exceptions import NotFoundException
from ..utils.helpers import build_pagination_meta


class MessagingService:
    def __init__(self, db: Session):
        self.db = db

    def send_message(self, sender_id: str, data: MessageCreateRequest) -> MessageResponse:
        receiver = self.db.query(User).filter(User.id == data.receiver_id).first()
        if not receiver:
            raise NotFoundException("Receiver not found")

        msg = Message(
            sender_id=sender_id,
            receiver_id=data.receiver_id,
            appointment_id=data.appointment_id,
            message_body=data.message_body,
            message_type=data.message_type,
            file_url=data.file_url,
            file_name=data.file_name,
        )
        self.db.add(msg)

        # Create notification for receiver
        sender = self.db.query(User).filter(User.id == sender_id).first()
        notif = Notification(
            user_id=data.receiver_id,
            type="message",
            title=f"New message from {sender.full_name if sender else 'Unknown'}",
            body=data.message_body[:100] if data.message_body else None,
            priority="medium",
        )
        self.db.add(notif)
        self.db.commit()
        self.db.refresh(msg)

        return self._build_message_response(msg)

    def get_conversation(self, user_id: str, other_user_id: str, page: int = 1, size: int = 50) -> dict:
        from sqlalchemy import or_, and_
        query = self.db.query(Message).filter(
            or_(
                and_(Message.sender_id == user_id, Message.receiver_id == other_user_id),
                and_(Message.sender_id == other_user_id, Message.receiver_id == user_id),
            )
        ).order_by(Message.created_at.desc())

        total = query.count()
        messages = query.offset((page - 1) * size).limit(size).all()

        # Mark unread messages as read
        unread = self.db.query(Message).filter(
            Message.sender_id == other_user_id,
            Message.receiver_id == user_id,
            Message.is_read == False,
        ).all()
        for m in unread:
            m.is_read = True
        self.db.commit()

        return {
            "items": [self._build_message_response(m) for m in messages],
            **build_pagination_meta(total, page, size),
        }

    def get_conversations_list(self, user_id: str) -> list:
        from sqlalchemy import or_, and_, desc
        # Get latest message per conversation partner
        sent = self.db.query(Message.receiver_id.label("partner_id"), Message.created_at).filter(
            Message.sender_id == user_id,
        )
        received = self.db.query(Message.sender_id.label("partner_id"), Message.created_at).filter(
            Message.receiver_id == user_id,
        )

        # Get unique partners
        partner_ids = set()
        for msg in self.db.query(Message).filter(
            or_(Message.sender_id == user_id, Message.receiver_id == user_id)
        ).order_by(Message.created_at.desc()).all():
            pid = msg.receiver_id if msg.sender_id == user_id else msg.sender_id
            partner_ids.add(pid)

        conversations = []
        for pid in partner_ids:
            partner = self.db.query(User).filter(User.id == pid).first()
            last_msg = self.db.query(Message).filter(
                or_(
                    and_(Message.sender_id == user_id, Message.receiver_id == pid),
                    and_(Message.sender_id == pid, Message.receiver_id == user_id),
                )
            ).order_by(Message.created_at.desc()).first()

            unread_count = self.db.query(Message).filter(
                Message.sender_id == pid,
                Message.receiver_id == user_id,
                Message.is_read == False,
            ).count()

            if partner and last_msg:
                conversations.append({
                    "partner_id": pid,
                    "partner_name": partner.full_name,
                    "partner_image": partner.profile_image,
                    "last_message": last_msg.message_body[:100] if last_msg.message_body else None,
                    "last_message_time": str(last_msg.created_at) if last_msg.created_at else None,
                    "unread_count": unread_count,
                })

        conversations.sort(key=lambda x: x["last_message_time"] or "", reverse=True)
        return conversations

    def get_notifications(self, user_id: str, page: int = 1, size: int = 20) -> dict:
        query = self.db.query(Notification).filter(
            Notification.user_id == user_id,
        ).order_by(Notification.created_at.desc())

        total = query.count()
        notifications = query.offset((page - 1) * size).limit(size).all()

        return {
            "items": [NotificationResponse.model_validate(n) for n in notifications],
            **build_pagination_meta(total, page, size),
        }

    def create_notification(self, data: NotificationCreateRequest) -> NotificationResponse:
        notif = Notification(
            user_id=data.user_id,
            type=data.type,
            title=data.title,
            body=data.body,
            data=data.data,
            action_url=data.action_url,
            priority=data.priority,
        )
        self.db.add(notif)
        self.db.commit()
        self.db.refresh(notif)
        return NotificationResponse.model_validate(notif)

    def mark_notification_read(self, user_id: str, notification_id: str) -> None:
        notif = self.db.query(Notification).filter(
            Notification.id == notification_id,
            Notification.user_id == user_id,
        ).first()
        if notif:
            notif.is_read = True
            self.db.commit()

    def mark_all_notifications_read(self, user_id: str) -> None:
        self.db.query(Notification).filter(
            Notification.user_id == user_id,
            Notification.is_read == False,
        ).update({"is_read": True})
        self.db.commit()

    def get_unread_count(self, user_id: str) -> dict:
        count = self.db.query(Notification).filter(
            Notification.user_id == user_id,
            Notification.is_read == False,
        ).count()
        msg_count = self.db.query(Message).filter(
            Message.receiver_id == user_id,
            Message.is_read == False,
        ).count()
        return {"unread_notifications": count, "unread_messages": msg_count}

    def _build_message_response(self, msg: Message) -> MessageResponse:
        sender = self.db.query(User).filter(User.id == msg.sender_id).first()
        receiver = self.db.query(User).filter(User.id == msg.receiver_id).first()
        return MessageResponse(
            id=msg.id,
            sender_id=msg.sender_id,
            receiver_id=msg.receiver_id,
            appointment_id=msg.appointment_id,
            message_body=msg.message_body,
            message_type=msg.message_type,
            file_url=msg.file_url,
            file_name=msg.file_name,
            is_read=msg.is_read or False,
            created_at=msg.created_at,
            sender_name=sender.full_name if sender else None,
            receiver_name=receiver.full_name if receiver else None,
        )
