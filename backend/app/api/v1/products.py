"""
Products API — SSR için optimize edilmiş, Redis cache-aside
"""
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, or_, text
from sqlalchemy.orm import selectinload
from typing import Optional
import hashlib, json

from app.core.database import get_db
from app.core.redis import cache_get, cache_set, CacheKeys, CacheTTL
from app.models import Product, Brand, Category, Price, Source
from app.services.seo import generate_seo_meta

router = APIRouter(prefix="/products")


@router.get("/")
async def list_products(
    q: Optional[str] = None,
    category: Optional[str] = None,
    brand: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    in_stock: Optional[bool] = None,
    free_ship: Optional[bool] = None,
    sort: str = "relevance",
    page: int = Query(default=1, ge=1),
    per_page: int = Query(default=24, le=96),
    db: AsyncSession = Depends(get_db),
):
    """
    Ürün listesi ve arama — PostgreSQL full-text search + filtreler.
    Sonuçlar Redis'te cache'lenir (15 dk).
    """
    # Cache anahtarı
    cache_key_data = f"{q}:{category}:{brand}:{min_price}:{max_price}:{in_stock}:{free_ship}:{sort}:{page}:{per_page}"
    cache_key = CacheKeys.search(hashlib.md5(cache_key_data.encode()).hexdigest())

    cached = await cache_get(cache_key)
    if cached:
        return cached

    # Sorgu oluştur
    query = (
        select(Product)
        .options(selectinload(Product.brand), selectinload(Product.category))
        .where(Product.is_active == True)
    )

    # Full-text arama (Türkçe)
    if q:
        query = query.where(
            text("to_tsvector('turkish', products.name || ' ' || coalesce(products.description,'')) "
                 "@@ plainto_tsquery('turkish', :q)")
        ).params(q=q)

    if category:
        query = query.join(Category).where(Category.slug == category)
    if brand:
        query = query.join(Brand).where(Brand.slug == brand)

    # Fiyat filtreleri (alt sorgu ile en düşük fiyat)
    if min_price or max_price or in_stock is not None or free_ship is not None:
        price_subq = (
            select(Price.product_id, func.min(Price.price).label("min_price"))
            .where(Price.in_stock == True if in_stock else True)
            .group_by(Price.product_id)
            .subquery()
        )
        query = query.join(price_subq, Product.id == price_subq.c.product_id)
        if min_price:
            query = query.where(price_subq.c.min_price >= min_price)
        if max_price:
            query = query.where(price_subq.c.min_price <= max_price)

    # Sıralama
    if sort == "price_asc":
        query = query.order_by(text("min_price ASC NULLS LAST"))
    elif sort == "price_desc":
        query = query.order_by(text("min_price DESC NULLS LAST"))
    elif sort == "rating":
        query = query.order_by(Product.avg_rating.desc())
    elif sort == "newest":
        query = query.order_by(Product.created_at.desc())
    else:
        query = query.order_by(Product.review_count.desc())

    # Sayfalama
    total_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(total_query)
    total = total_result.scalar()

    query = query.offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    products = result.scalars().all()

    response = {
        "items": [_serialize_product(p) for p in products],
        "total": total,
        "page": page,
        "per_page": per_page,
        "pages": (total + per_page - 1) // per_page,
    }

    await cache_set(cache_key, response, CacheTTL.SEARCH)
    return response


@router.get("/{slug}")
async def get_product(slug: str, db: AsyncSession = Depends(get_db)):
    """
    Ürün detayı — SSR için cache + fiyat karşılaştırma.
    """
    cache_key = CacheKeys.product_detail(slug)
    cached = await cache_get(cache_key)
    if cached:
        return cached

    result = await db.execute(
        select(Product)
        .options(
            selectinload(Product.brand),
            selectinload(Product.category),
            selectinload(Product.prices).selectinload(Price.source),
            selectinload(Product.game_req),
        )
        .where(Product.slug == slug, Product.is_active == True)
    )
    product = result.scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail="Ürün bulunamadı")

    # Fiyatları sırala (en ucuz önce, stoğu olmayanlar sona)
    prices = sorted(
        [p for p in product.prices if p.in_stock],
        key=lambda x: x.price
    )
    out_of_stock = [p for p in product.prices if not p.in_stock]

    # SEO meta
    min_price = prices[0].price if prices else None
    cheapest_source = prices[0].source.display_name if prices else None

    seo = generate_seo_meta(product, min_price, cheapest_source)

    response = {
        **_serialize_product(product),
        "prices": [_serialize_price(p) for p in prices[:3]],  # En ucuz 3
        "all_prices": [_serialize_price(p) for p in prices + out_of_stock],
        "seo": seo,
        "specs": product.specs,
        "game_requirements": _serialize_game_req(product.game_req) if product.game_req else None,
    }

    await cache_set(cache_key, response, CacheTTL.PRODUCT)
    return response


def _serialize_product(p: Product) -> dict:
    return {
        "id": str(p.id),
        "slug": p.slug,
        "name": p.name,
        "images": p.images or [],
        "avg_rating": float(p.avg_rating) if p.avg_rating else 0,
        "review_count": p.review_count,
        "brand": {"id": str(p.brand.id), "name": p.brand.name, "slug": p.brand.slug} if p.brand else None,
        "category": {"id": str(p.category.id), "name": p.category.name} if p.category else None,
        "seo_title": p.seo_title,
        "created_at": p.created_at.isoformat() if p.created_at else None,
    }


def _serialize_price(p: Price) -> dict:
    return {
        "id": str(p.id),
        "source": p.source.display_name if p.source else "",
        "source_logo": p.source.logo_url if p.source else "",
        "price": float(p.price),
        "in_stock": p.in_stock,
        "free_ship": p.free_ship,
        "url": p.url,
        "affiliate_url": p.affiliate_url,
        "scraped_at": p.scraped_at.isoformat() if p.scraped_at else None,
    }


def _serialize_game_req(r) -> dict:
    return {
        "min": {"cpu": r.min_cpu, "gpu": r.min_gpu, "ram_gb": r.min_ram_gb, "storage_gb": r.min_storage_gb},
        "recommended": {"cpu": r.rec_cpu, "gpu": r.rec_gpu, "ram_gb": r.rec_ram_gb},
        "ultra": {"cpu": r.ultra_cpu, "gpu": r.ultra_gpu, "ram_gb": r.ultra_ram_gb},
    }
