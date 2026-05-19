"""Tasks package initialization"""
from app.tasks.email_tasks import (
    send_email, send_welcome_email, send_verification_email,
    send_password_reset_email, send_appointment_confirmation,
    send_emergency_alert_email, send_medicine_reminder
)
from app.tasks.notification_tasks import (
    send_push_notification, send_sms_notification,
    send_email_notification, send_bulk_notifications,
    send_emergency_notifications
)
from app.tasks.reminder_tasks import (
    send_medicine_reminders, check_expired_medicines,
    update_blood_stock_status, send_appointment_reminders,
    send_vaccination_reminders, send_pregnancy_reminders,
    update_donor_eligibility, cleanup_expired_otps
)
from app.tasks.report_tasks import (
    generate_daily_reports, generate_weekly_reports,
    generate_monthly_reports, generate_hospital_report,
    generate_blood_bank_report, export_data_csv
)

__all__ = [
    "send_email", "send_welcome_email", "send_verification_email",
    "send_password_reset_email", "send_appointment_confirmation",
    "send_emergency_alert_email", "send_medicine_reminder",
    "send_push_notification", "send_sms_notification",
    "send_email_notification", "send_bulk_notifications",
    "send_emergency_notifications",
    "send_medicine_reminders", "check_expired_medicines",
    "update_blood_stock_status", "send_appointment_reminders",
    "send_vaccination_reminders", "send_pregnancy_reminders",
    "update_donor_eligibility", "cleanup_expired_otps",
    "generate_daily_reports", "generate_weekly_reports",
    "generate_monthly_reports", "generate_hospital_report",
    "generate_blood_bank_report", "export_data_csv"
]