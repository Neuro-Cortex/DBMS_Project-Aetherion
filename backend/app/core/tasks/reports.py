"""
Report generation tasks — monthly reports, analytics, data exports.
"""

import logging
from typing import Optional

logger = logging.getLogger("aetherion.tasks.reports")


def generate_monthly_report_task(hospital_id: str, month: str, year: int) -> dict:
    """
    Generate a monthly report for a hospital.

    Args:
        hospital_id: Hospital ID
        month: Month name or number (e.g., "01" for January)
        year: Year

    Returns:
        Dict with report data or generation status
    """
    try:
        from ...core.database import SessionLocal
        from ...models.appointment import Appointment
        from ...models.hospital import Hospital
        from sqlalchemy import func

        db = SessionLocal()
        try:
            hospital = db.query(Hospital).filter(Hospital.id == hospital_id).first()
            if not hospital:
                return {"success": False, "error": "Hospital not found"}

            # Aggregate stats for the month
            from datetime import datetime
            start_date = datetime(year, int(month), 1)
            if int(month) == 12:
                end_date = datetime(year + 1, 1, 1)
            else:
                end_date = datetime(year, int(month) + 1, 1)

            appointment_count = (
                db.query(func.count(Appointment.id))
                .filter(
                    Appointment.hospital_id == hospital_id,
                    Appointment.created_at >= start_date,
                    Appointment.created_at < end_date,
                )
                .scalar() or 0
            )

            report = {
                "hospital_id": hospital_id,
                "hospital_name": hospital.name,
                "period": f"{year}-{month}",
                "appointments": appointment_count,
            }

            logger.info(f"Monthly report generated for hospital {hospital_id}: {year}-{month}")
            return {"success": True, "report": report}

        finally:
            db.close()

    except Exception as e:
        logger.error(f"Report generation failed for hospital {hospital_id}: {e}")
        return {"success": False, "error": str(e)}


def generate_analytics_report_task() -> dict:
    """
    Generate system-wide analytics report.

    Returns:
        Dict with analytics data
    """
    try:
        from ...core.database import SessionLocal
        from ...models.user import User
        from ...models.appointment import Appointment
        from ...models.emergency import EmergencyRequest
        from ...models.blood_donation import BloodDonation
        from sqlalchemy import func
        from datetime import datetime, timedelta

        db = SessionLocal()
        try:
            today = datetime.utcnow().date()
            thirty_days_ago = datetime.utcnow() - timedelta(days=30)

            stats = {
                "total_users": db.query(func.count(User.id)).scalar() or 0,
                "active_users": db.query(func.count(User.id)).filter(User.is_active == True).scalar() or 0,
                "appointments_last_30d": db.query(func.count(Appointment.id)).filter(
                    Appointment.created_at >= thirty_days_ago
                ).scalar() or 0,
                "emergencies_last_30d": db.query(func.count(EmergencyRequest.id)).filter(
                    EmergencyRequest.created_at >= thirty_days_ago
                ).scalar() or 0,
                "donations_last_30d": db.query(func.count(BloodDonation.id)).filter(
                    BloodDonation.created_at >= thirty_days_ago
                ).scalar() or 0,
            }

            return {"success": True, "analytics": stats}

        finally:
            db.close()

    except Exception as e:
        logger.error(f"Analytics report generation failed: {e}")
        return {"success": False, "error": str(e)}
