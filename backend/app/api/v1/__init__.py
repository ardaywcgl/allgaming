"""
Tüm v1 API router'larını buradan export et.
"""
from app.api.v1.products import router as products
from app.api.v1.auth import router as auth
from app.api.v1.chat import router as chat
from app.api.v1.admin import router as admin
from app.api.v1._stubs import (
    brands, categories, reviews, deals, push, sources, prices
)

__all__ = [
    "products", "auth", "chat", "admin",
    "brands", "categories", "reviews", "deals", "push", "sources", "prices",
]
