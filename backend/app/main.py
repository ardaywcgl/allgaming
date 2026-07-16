"""
HepsiGaming FastAPI - Ana Uygulama
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager

from app.core.config import settings
from app.core.database import engine, Base
from app.api.v1 import (
    products, prices, brands, categories,
    auth, admin, reviews, chat, deals, push, sources
)
from app.models import Brand, Category, Product, Source, Price, User, Review, PriceAlert, Banner, GameRequirement, SiteSetting, Deal  # noqa: F401 — register models


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Uygulama başlangıç ve kapanış olayları."""
    # Başlangıç: DB tabloları oluştur (Alembic varsa bu satırı kaldır)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    # Kapanış: Bağlantıları temizle
    await engine.dispose()


app = FastAPI(
    title="HepsiGaming API",
    description="Türkiye'nin en kapsamlı oyun donanımı fiyat karşılaştırma platformu",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/api/docs" if settings.DEBUG else None,
    redoc_url="/api/redoc" if settings.DEBUG else None,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static dosyalar (yüklenen görseller)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# API Router'ları
api_prefix = "/api/v1"
app.include_router(auth,       prefix=api_prefix, tags=["Auth"])
app.include_router(products,   prefix=api_prefix, tags=["Products"])
app.include_router(prices,     prefix=api_prefix, tags=["Prices"])
app.include_router(brands,     prefix=api_prefix, tags=["Brands"])
app.include_router(categories, prefix=api_prefix, tags=["Categories"])
app.include_router(reviews,    prefix=api_prefix, tags=["Reviews"])
app.include_router(chat,       prefix=api_prefix, tags=["Chat"])
app.include_router(deals,      prefix=api_prefix, tags=["Deals"])
app.include_router(push,       prefix=api_prefix, tags=["Push"])
app.include_router(sources,    prefix=api_prefix, tags=["Sources"])
app.include_router(admin,      prefix=api_prefix + "/admin", tags=["Admin"])


@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "ok", "service": "HepsiGaming API", "version": "1.0.0"}
