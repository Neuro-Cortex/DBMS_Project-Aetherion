from pydantic_settings import BaseSettings
from typing import List, Optional
from functools import lru_cache


class Settings(BaseSettings):
    # ============================================
    # APPLICATION
    # ============================================
    APP_NAME: str = "Aetherion Healthcare API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    API_V1_PREFIX: str = "/api/v1"
    ENVIRONMENT: str = "development"  # development | staging | production

    # ============================================
    # DATABASE
    # ============================================
    DB_HOST: str = "localhost"
    DB_PORT: int = 3306
    DB_USER: str = "root"
    DB_PASSWORD: str = ""
    DB_NAME: str = "aethion_db"
    DB_POOL_SIZE: int = 20
    DB_MAX_OVERFLOW: int = 10
    DB_POOL_RECYCLE: int = 3600

    @property
    def DATABASE_URL(self) -> str:
        return (
            f"mysql+pymysql://{self.DB_USER}:{self.DB_PASSWORD}"
            f"@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"
        )

    # ============================================
    # JWT AUTHENTICATION
    # ============================================
    JWT_SECRET_KEY: str = "aetherion-super-secret-key-2024"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # ============================================
    # SMTP EMAIL
    # ============================================
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    SMTP_FROM_EMAIL: str = "noreply@aetherion.health"
    SMTP_FROM_NAME: str = "Aetherion Health"
    SMTP_USE_TLS: bool = True

    # ============================================
    # CORS
    # ============================================
    CORS_ORIGINS: str = "http://localhost:5173,http://localhost:3000,http://localhost:5000"
    CORS_ALLOW_CREDENTIALS: bool = True
    CORS_ALLOW_METHODS: str = "*"
    CORS_ALLOW_HEADERS: str = "*"

    @property
    def CORS_ORIGINS_LIST(self) -> List[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]

    # ============================================
    # RATE LIMITING
    # ============================================
    RATE_LIMIT_ENABLED: bool = True
    RATE_LIMIT_LOGIN: str = "5/minute"
    RATE_LIMIT_REGISTER: str = "3/minute"
    RATE_LIMIT_DEFAULT: str = "100/minute"
    RATE_LIMIT_EMERGENCY: str = "10/minute"

    # ============================================
    # FILE UPLOAD
    # ============================================
    UPLOAD_DIR: str = "uploads"
    MAX_UPLOAD_SIZE_MB: int = 10
    ALLOWED_FILE_TYPES: str = "jpg,jpeg,png,pdf,doc,docx"

    @property
    def ALLOWED_FILE_TYPES_LIST(self) -> List[str]:
        return [t.strip().lower() for t in self.ALLOWED_FILE_TYPES.split(",")]

    # ============================================
    # FRONTEND
    # ============================================
    FRONTEND_URL: str = "http://localhost:5173"
    PASSWORD_RESET_URL: str = "{frontend_url}/reset-password?token={token}"
    EMAIL_VERIFICATION_URL: str = "{frontend_url}/verify-email?token={token}"

    # ============================================
    # REDIS
    # ============================================
    REDIS_URL: Optional[str] = None
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    REDIS_DB: int = 0
    REDIS_PASSWORD: Optional[str] = None

    @property
    def REDIS_CONNECTION_URL(self) -> str:
        if self.REDIS_URL:
            return self.REDIS_URL
        if self.REDIS_PASSWORD:
            return f"redis://:{self.REDIS_PASSWORD}@{self.REDIS_HOST}:{self.REDIS_PORT}/{self.REDIS_DB}"
        return f"redis://{self.REDIS_HOST}:{self.REDIS_PORT}/{self.REDIS_DB}"

    # ============================================
    # CELERY
    # ============================================
    CELERY_BROKER_URL: Optional[str] = None
    CELERY_RESULT_BACKEND: Optional[str] = None
    CELERY_TASK_ALWAYS_EAGER: bool = False  # True = run synchronously (dev mode)

    @property
    def CELERY_EFFECTIVE_BROKER_URL(self) -> Optional[str]:
        return self.CELERY_BROKER_URL or (f"redis://{self.REDIS_HOST}:{self.REDIS_PORT}/0" if self.REDIS_URL or self.REDIS_HOST else None)

    @property
    def CELERY_EFFECTIVE_RESULT_BACKEND(self) -> Optional[str]:
        return self.CELERY_RESULT_BACKEND or (f"redis://{self.REDIS_HOST}:{self.REDIS_PORT}/1" if self.REDIS_URL or self.REDIS_HOST else None)

    # ============================================
    # LOGGING
    # ============================================
    LOG_LEVEL: str = "INFO"
    LOG_FORMAT: str = "json"  # json | text
    LOG_REQUEST_BODY: bool = False  # Log request bodies (debug only)

    @property
    def is_production(self) -> bool:
        return self.ENVIRONMENT == "production"

    @property
    def is_development(self) -> bool:
        return self.ENVIRONMENT == "development"

    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
        "case_sensitive": True,
        "extra": "ignore",  # Ignore extra fields from .env (e.g., legacy Flask vars)
    }


@lru_cache()
def get_settings() -> Settings:
    return Settings()
