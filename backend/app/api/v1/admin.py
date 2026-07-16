"""
Admin API — Ürün CRUD, CSV yükleme, yorum onay, banner, kullanıcı/rol yönetimi
Tüm endpoint'ler minimum 'editor' rolü gerektirir.
"""
import io
import uuid
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, func
from pydantic import BaseModel
from typing import Optional

from app.core.database import get_db
from app.core.security import require_admin, require_editor, require_grafiker
from app.core.redis import cache_delete_pattern
from app.models import Product, Review, Banner, User, SiteSetting, Deal
from app.services.seo import generate_seo_meta

router = APIRouter()


# ─── Ürün Yönetimi ────────────────────────────────────────────────

@router.get("/products", dependencies=[Depends(require_editor)])
async def admin_list_products(
    incomplete: bool = False,
    page: int = 1,
    per_page: int = 50,
    db: AsyncSession = Depends(get_db),
):
    """Ürün listesi. incomplete=True ise görseli eksik ürünler."""
    query = select(Product)
    if incomplete:
        query = query.where(Product.is_complete == False)
    query = query.offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    products = result.scalars().all()
    return [{"id": str(p.id), "name": p.name, "slug": p.slug, "is_complete": p.is_complete} for p in products]


@router.post("/products/csv", dependencies=[Depends(require_editor)])
async def upload_products_csv(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
):
    """
    Excel/CSV ile toplu ürün yükleme.
    Beklenen sütunlar: name, brand, category, price, description, image_url, specs (JSON)
    """
    import pandas as pd

    if not file.filename.endswith((".csv", ".xlsx", ".xls")):
        raise HTTPException(400, "Sadece CSV veya Excel dosyası kabul edilir")

    content = await file.read()
    try:
        if file.filename.endswith(".csv"):
            df = pd.read_csv(io.BytesIO(content))
        else:
            df = pd.read_excel(io.BytesIO(content))
    except Exception as e:
        raise HTTPException(400, f"Dosya okunamadı: {e}")

    required_cols = {"name"}
    if not required_cols.issubset(df.columns):
        raise HTTPException(400, f"Gerekli sütunlar eksik: {required_cols}")

    inserted, skipped, incomplete = 0, 0, 0

    for _, row in df.iterrows():
        name = str(row.get("name", "")).strip()
        if not name:
            skipped += 1
            continue

        slug = name.lower().replace(" ", "-").replace("/", "-")[:200]
        image_url = str(row.get("image_url", "")).strip()
        has_image = bool(image_url and image_url != "nan")

        product = Product(
            id=uuid.uuid4(),
            slug=slug,
            name=name,
            description=str(row.get("description", "")) if row.get("description") else None,
            images=[image_url] if has_image else [],
            is_complete=has_image,
        )

        # Otomatik SEO
        product.seo_title = f"{name} En Ucuz Fiyatı ve İncelemesi - HepsiGaming"
        product.seo_description = f"{name} için en iyi fiyat karşılaştırması. HepsiGaming'de hemen karşılaştır!"

        if not has_image:
            incomplete += 1

        db.add(product)
        inserted += 1

    await db.commit()

    return {
        "inserted": inserted,
        "skipped": skipped,
        "incomplete_images": incomplete,
        "message": f"{inserted} ürün eklendi. {incomplete} ürünün görseli eksik.",
    }


# ─── Yorum Onay ───────────────────────────────────────────────────

@router.get("/reviews/pending", dependencies=[Depends(require_editor)])
async def pending_reviews(db: AsyncSession = Depends(get_db)):
    """Onay bekleyen yorumları listele."""
    result = await db.execute(
        select(Review).where(Review.approved == False).order_by(Review.created_at.desc())
    )
    reviews = result.scalars().all()
    return [
        {"id": str(r.id), "product_id": str(r.product_id), "rating": r.rating,
         "content": r.content, "created_at": r.created_at.isoformat()}
        for r in reviews
    ]


@router.patch("/reviews/{review_id}/approve", dependencies=[Depends(require_editor)])
async def approve_review(review_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Review).where(Review.id == review_id))
    review = result.scalar_one_or_none()
    if not review:
        raise HTTPException(404, "Yorum bulunamadı")
    review.approved = True
    await db.commit()
    return {"message": "Yorum onaylandı"}


@router.delete("/reviews/{review_id}", dependencies=[Depends(require_editor)])
async def delete_review(review_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Review).where(Review.id == review_id))
    review = result.scalar_one_or_none()
    if not review:
        raise HTTPException(404, "Yorum bulunamadı")
    await db.delete(review)
    await db.commit()
    return {"message": "Yorum silindi"}


# ─── Banner Yönetimi ──────────────────────────────────────────────

@router.get("/banners", dependencies=[Depends(require_grafiker)])
async def list_banners(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Banner).order_by(Banner.sort_order))
    banners = result.scalars().all()
    return [
        {"id": str(b.id), "title": b.title, "position": b.position,
         "is_active": b.is_active, "click_count": b.click_count, "view_count": b.view_count}
        for b in banners
    ]


@router.post("/banners/{banner_id}/click", dependencies=[Depends(require_grafiker)])
async def record_banner_click(banner_id: str, db: AsyncSession = Depends(get_db)):
    """Banner tık sayacını artır (analitik)."""
    await db.execute(
        update(Banner).where(Banner.id == banner_id).values(click_count=Banner.click_count + 1)
    )
    await db.commit()
    return {"ok": True}


# ─── Kullanıcı / Rol Yönetimi ────────────────────────────────────

@router.get("/users", dependencies=[Depends(require_admin)])
async def list_users(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).order_by(User.created_at.desc()))
    users = result.scalars().all()
    return [
        {"id": str(u.id), "email": u.email, "full_name": u.full_name,
         "role": u.role, "badge": u.badge, "review_count": u.review_count,
         "is_active": u.is_active, "created_at": u.created_at.isoformat()}
        for u in users
    ]


class RoleUpdate(BaseModel):
    role: str


@router.patch("/users/{user_id}/role", dependencies=[Depends(require_admin)])
async def update_user_role(user_id: str, data: RoleUpdate, db: AsyncSession = Depends(get_db)):
    valid_roles = {"admin", "editor", "category_manager", "grafiker", "user"}
    if data.role not in valid_roles:
        raise HTTPException(400, f"Geçersiz rol. Geçerli roller: {valid_roles}")

    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(404, "Kullanıcı bulunamadı")

    user.role = data.role
    await db.commit()
    return {"message": f"Rol '{data.role}' olarak güncellendi"}


# ─── Site Ayarları (Sosyal Medya, Logo) ──────────────────────────

@router.get("/settings", dependencies=[Depends(require_admin)])
async def get_settings(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(SiteSetting))
    settings = result.scalars().all()
    return {s.key: s.value for s in settings}


@router.patch("/settings", dependencies=[Depends(require_admin)])
async def update_settings(
    data: dict,
    db: AsyncSession = Depends(get_db),
):
    """Sosyal medya linkleri, logo URL'leri vb. güncelle."""
    for key, value in data.items():
        result = await db.execute(select(SiteSetting).where(SiteSetting.key == key))
        setting = result.scalar_one_or_none()
        if setting:
            setting.value = str(value)
        else:
            db.add(SiteSetting(key=key, value=str(value)))

    await db.commit()
    # Site ayarları cache'ini temizle
    await cache_delete_pattern("hg:settings:*")
    return {"message": "Ayarlar güncellendi"}


# ─── Scraper Durumu ───────────────────────────────────────────────

@router.get("/scrapers/status", dependencies=[Depends(require_admin)])
async def scraper_status():
    """Celery worker durumunu döndür."""
    try:
        from scrapers.celery_app import app as celery_app
        inspect = celery_app.control.inspect()
        active = inspect.active() or {}
        return {"workers": list(active.keys()), "active_tasks": sum(len(v) for v in active.values())}
    except Exception:
        return {"workers": [], "active_tasks": 0, "note": "Celery bağlantısı kurulamadı"}
