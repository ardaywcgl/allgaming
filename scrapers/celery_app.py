"""
Celery Uygulama + Zamanlı Görevler (Celery Beat)
Günde 3 kez tüm scraper'ları çalıştırır.
"""
import os
from celery import Celery
from celery.schedules import crontab

BROKER_URL = os.getenv("CELERY_BROKER_URL", "redis://redis:6379/1")
RESULT_BACKEND = os.getenv("CELERY_RESULT_BACKEND", "redis://redis:6379/2")

app = Celery(
    "hepsigaming_scrapers",
    broker=BROKER_URL,
    backend=RESULT_BACKEND,
)

app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="Europe/Istanbul",
    enable_utc=True,
    task_track_started=True,
    worker_max_tasks_per_child=50,  # Bellek sızıntısı önlemi
)

# ─── Zamanlı Görevler ────────────────────────────────────────────
# Günde 3 kez: 08:00, 14:00, 20:00 (İstanbul saatiyle)
app.conf.beat_schedule = {
    "scrape-morning": {
        "task": "tasks.scrape_all_products",
        "schedule": crontab(hour=8, minute=0),
        "options": {"queue": "scrapers"},
    },
    "scrape-afternoon": {
        "task": "tasks.scrape_all_products",
        "schedule": crontab(hour=14, minute=0),
        "options": {"queue": "scrapers"},
    },
    "scrape-evening": {
        "task": "tasks.scrape_all_products",
        "schedule": crontab(hour=20, minute=0),
        "options": {"queue": "scrapers"},
    },
    "check-price-alerts": {
        "task": "tasks.check_price_alerts",
        "schedule": crontab(minute="*/30"),  # Her 30 dakikada bir
        "options": {"queue": "alerts"},
    },
    "cleanup-old-prices": {
        "task": "tasks.cleanup_old_price_history",
        "schedule": crontab(hour=3, minute=0),  # Gece 03:00 temizlik
        "options": {"queue": "maintenance"},
    },
}

app.conf.task_queues = {
    "scrapers": {"exchange": "scrapers", "routing_key": "scrapers"},
    "alerts": {"exchange": "alerts", "routing_key": "alerts"},
    "maintenance": {"exchange": "maintenance", "routing_key": "maintenance"},
}

if __name__ == "__main__":
    app.start()
