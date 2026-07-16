"""
Uygulama Konfigürasyonu — Pydantic Settings v2
"""
from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    # Genel
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    SITE_NAME: str = "HepsiGaming"
    SITE_URL: str = "https://hepsigaming.com"

    # Veritabanı
    DATABASE_URL: str = "postgresql+asyncpg://hgadmin:changeme@localhost:5432/hepsigaming"

    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"

    # JWT
    SECRET_KEY: str = "GIZLI_ANAHTAR_DEGISTIR"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    # CORS
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "https://hepsigaming.com",
        "https://www.hepsigaming.com",
    ]

    # Affiliate
    AMAZON_AFFILIATE_TAG: str = "hepsigaming-21"
    TRENDYOL_AFFILIATE_ID: str = ""

    # Web Push (VAPID)
    VAPID_PUBLIC_KEY: str = ""
    VAPID_PRIVATE_KEY: str = ""
    VAPID_EMAIL: str = "admin@hepsigaming.com"

    # Celery
    CELERY_BROKER_URL: str = "redis://localhost:6379/1"
    CELERY_RESULT_BACKEND: str = "redis://localhost:6379/2"

    # Upload
    UPLOAD_DIR: str = "uploads"
    MAX_UPLOAD_SIZE_MB: int = 10

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
