"""
Cleanup tasks — session expiry, audit log archival, unverified account removal.
"""

import logging
from typing import Optional

logger = logging.getLogger("aetherion.tasks.cleanup")


def cleanup_expired_sessions_task() -> dict:
    """
    Revoke all expired user sessions.

    Returns:
        Dict with count of cleaned-up sessions
    """
    try:
        from ...core.database import SessionLocal
        from ...models.user import UserSession
        from datetime import datetime

        db = SessionLocal()
        try:
            count = (
                db.query(UserSession)
                .filter(
                    UserSession.expires_at < datetime.utcnow(),
                    UserSession.is_revoked == False,
                )
                .update({"is_revoked": True})
            )
            db.commit()

            logger.info(f"Cleaned up {count} expired sessions")
            return {"success": True, "sessions_revoked": count}

        finally:
            db.close()

    except Exception as e:
        logger.error(f"Session cleanup failed: {e}")
        return {"success": False, "error": str(e)}


def cleanup_old_audit_logs_task(days: int = 90) -> dict:
    """
    Archive or delete audit logs older than specified days.

    Args:
        days: Number of days to retain (default 90)

    Returns:
        Dict with count of archived/deleted logs
    """
    try:
        from ...core.database import SessionLocal
        from ...models.search import AuditLog, SecurityLog
        from datetime import datetime, timedelta

        db = SessionLocal()
        try:
            cutoff = datetime.utcnow() - timedelta(days=days)

            # Archive old audit logs (in production, move to cold storage)
            audit_count = (
                db.query(AuditLog)
                .filter(AuditLog.created_at < cutoff)
                .delete()
            )

            # Archive old security logs
            security_count = (
                db.query(SecurityLog)
                .filter(SecurityLog.created_at < cutoff)
                .delete()
            )

            db.commit()

            logger.info(f"Archived {audit_count} audit logs and {security_count} security logs older than {days} days")
            return {
                "success": True,
                "audit_logs_archived": audit_count,
                "security_logs_archived": security_count,
            }

        finally:
            db.close()

    except Exception as e:
        logger.error(f"Audit log cleanup failed: {e}")
        return {"success": False, "error": str(e)}


def cleanup_unverified_accounts_task(days: int = 30) -> dict:
    """
    Remove user accounts that have been unverified for longer than specified days.

    Args:
        days: Number of days to wait before cleanup (default 30)

    Returns:
        Dict with count of removed accounts
    """
    try:
        from ...core.database import SessionLocal
        from ...models.user import User, UserProfile
        from datetime import datetime, timedelta

        db = SessionLocal()
        try:
            cutoff = datetime.utcnow() - timedelta(days=days)

            # Find unverified accounts older than cutoff
            unverified_users = (
                db.query(User)
                .filter(
                    User.is_verified == False,
                    User.is_admin_approved == False,
                    User.created_at < cutoff,
                )
                .all()
            )

            count = 0
            for user in unverified_users:
                # Delete profile first (FK constraint)
                db.query(UserProfile).filter(UserProfile.user_id == user.id).delete()
                db.delete(user)
                count += 1

            db.commit()

            logger.info(f"Cleaned up {count} unverified accounts older than {days} days")
            return {"success": True, "accounts_removed": count}

        finally:
            db.close()

    except Exception as e:
        logger.error(f"Unverified account cleanup failed: {e}")
        return {"success": False, "error": str(e)}
