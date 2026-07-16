"""
Brands, Categories, Reviews, Deals, Push, Sources, Prices — Veritabanı destekli gerçek yönlendiriciler
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, text
from app.core.database import get_db
from app.models import Brand, Category, Review, Deal, Source

brands     = APIRouter(prefix="/brands")
categories = APIRouter(prefix="/categories")
reviews    = APIRouter(prefix="/reviews")
deals      = APIRouter(prefix="/deals")
push       = APIRouter(prefix="/push")
sources    = APIRouter(prefix="/sources")
prices     = APIRouter(prefix="/prices")


@brands.get("/")
async def list_brands(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Brand).order_by(Brand.name))
    items = result.scalars().all()
    return [{"id": str(b.id), "name": b.name, "slug": b.slug, "description": b.description, "is_featured": b.is_featured} for b in items]


@categories.get("/")
async def list_categories(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Category).order_by(Category.sort_order))
    items = result.scalars().all()
    return [{"id": str(c.id), "name": c.name, "slug": c.slug, "sort_order": c.sort_order} for c in items]


@reviews.get("/")
async def list_reviews(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Review).order_by(Review.created_at.desc()))
    items = result.scalars().all()
    return [{"id": str(r.id), "product_id": str(r.product_id), "rating": r.rating, "content": r.content} for r in items]


@deals.get("/")
async def list_deals(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Deal).where(Deal.is_active == True).order_by(Deal.created_at.desc()))
    items = result.scalars().all()
    return [
        {
            "id": str(d.id),
            "title": d.title,
            "platform": d.platform,
            "discount_pct": d.discount_pct,
            "original_price": float(d.original_price) if d.original_price else None,
            "deal_price": float(d.deal_price) if d.deal_price else None,
            "deal_url": d.deal_url,
            "image_url": d.image_url,
            "is_free": d.is_free,
            "expires_at": d.expires_at.isoformat() if d.expires_at else None
        }
        for d in items
    ]


@push.post("/subscribe")
async def subscribe_push():
    return {"ok": True}


@sources.get("/")
async def list_sources(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Source).where(Source.is_active == True).order_by(Source.name))
    items = result.scalars().all()
    return [{"id": str(s.id), "name": s.name, "display_name": s.display_name, "base_url": s.base_url} for s in items]


@prices.get("/{product_id}/history")
async def price_history(product_id: str, db: AsyncSession = Depends(get_db)):
    # Raw query to fetch price history from partitioned table
    query = text("""
        SELECT ph.price, ph.recorded_at, s.display_name as source_name
        FROM price_history ph
        JOIN sources s ON ph.source_id = s.id
        WHERE ph.product_id = :product_id
        ORDER BY ph.recorded_at ASC
    """)
    result = await db.execute(query, {"product_id": product_id})
    rows = result.fetchall()
    return [
        {
            "price": float(row.price),
            "recorded_at": row.recorded_at.isoformat(),
            "source": row.source_name
        }
        for row in rows
    ]
