"""
Chat API — NLP Chatbot endpoint (TR + EN)
"""
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from pydantic import BaseModel
from typing import Optional

from app.core.database import get_db
from app.models import Product, Price, Brand, Category
from app.services.nlp import parse_message, build_response

router = APIRouter(prefix="/chat")


class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None


@router.post("")
async def chat(req: ChatRequest, db: AsyncSession = Depends(get_db)):
    """
    NLP chatbot endpoint.
    Kullanıcının mesajını analiz eder, DB'den ürün arar, yanıt döndürür.
    """
    parsed = parse_message(req.message)
    products = []

    # Ürün arama intent'i
    if parsed.intent in ("product_search", "price_query"):
        query = select(Product).where(Product.is_active == True)

        # Kategori filtresi
        if parsed.category:
            query = query.join(Category).where(
                Category.slug.ilike(f"%{parsed.category}%")
            )

        # Bütçe filtresi (en düşük fiyata göre)
        if parsed.budget:
            from sqlalchemy import func
            price_subq = (
                select(Price.product_id, func.min(Price.price).label("min_price"))
                .where(Price.in_stock == True)
                .group_by(Price.product_id)
                .subquery()
            )
            query = query.join(
                price_subq, Product.id == price_subq.c.product_id
            ).where(price_subq.c.min_price <= parsed.budget)

        # Kablosuz özellik
        if "wireless" in parsed.features:
            from sqlalchemy import cast, String
            from sqlalchemy.dialects.postgresql import JSONB
            query = query.where(
                Product.specs["wireless"].astext == "true"
            )

        # Sonuçları al (max 5)
        result = await db.execute(query.limit(5))
        db_products = result.scalars().all()

        # Fiyatları da çek
        for p in db_products:
            price_result = await db.execute(
                select(Price)
                .where(and_(Price.product_id == p.id, Price.in_stock == True))
                .order_by(Price.price)
                .limit(1)
            )
            min_price = price_result.scalar_one_or_none()

            products.append({
                "id": str(p.id),
                "name": p.name,
                "slug": p.slug,
                "minPrice": f"{float(min_price.price):,.0f}" if min_price else "—",
                "img": "🎮",
            })

    elif parsed.intent == "deal_query":
        # İndirimler sayfasına yönlendir
        return {
            "message": "Güncel fırsatları buradan inceleyebilirsin 👉" if parsed.lang == "tr"
                       else "Check out today's deals here 👉",
            "products": [],
            "action": {"type": "navigate", "url": "/firsatlar"},
        }

    return build_response(parsed, products)
