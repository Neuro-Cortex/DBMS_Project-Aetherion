from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from ..core.config import get_settings

settings = get_settings()


def _get_mail_config() -> ConnectionConfig | None:
    """Create mail config only if SMTP settings are provided."""
    if not settings.SMTP_USER or not settings.SMTP_PASSWORD:
        return None
    return ConnectionConfig(
        MAIL_USERNAME=settings.SMTP_USER,
        MAIL_PASSWORD=settings.SMTP_PASSWORD,
        MAIL_FROM=settings.SMTP_FROM_EMAIL,
        MAIL_PORT=settings.SMTP_PORT,
        MAIL_SERVER=settings.SMTP_HOST,
        MAIL_STARTTLS=settings.SMTP_USE_TLS,
        MAIL_SSL_TLS=False,
        USE_CREDENTIALS=True,
    )


async def send_email(to: str, subject: str, body: str) -> bool:
    """Send an email. Returns True if sent, False if SMTP not configured."""
    conf = _get_mail_config()
    if not conf:
        # SMTP not configured — skip silently in development
        return False

    message = MessageSchema(subject=subject, recipients=[to], body=body, subtype="html")
    fm = FastMail(conf)
    await fm.send_message(message)
    return True
