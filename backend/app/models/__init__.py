"""
SQLAlchemy Modelleri — Tüm tablolar
"""
import uuid
from datetime import datetime, timezone
from sqlalchemy import (
    Column, String, Boolean, Integer, SmallInteger,
    Numeric, Text, ARRAY, ForeignKey, TIMESTAMP, UniqueConstraint
)
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from app.core.database import Base


def utcnow():
    return datetime.now(timezone.utc)


# ──────────────────────────────────────────────────────────
class Brand(Base):
    __tablename__ = "brands"

    id          = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name        = Column(String(200), nullable=False, unique=True)
    slug        = Column(String(200), nullable=False, unique=True)
    logo_svg    = Column(Text)
    logo_dark   = Column(Text)
    logo_light  = Column(Text)
    banner_url  = Column(Text)
    description = Column(Text)
    website     = Column(Text)
    is_featured = Column(Boolean, default=False)
    created_at  = Column(TIMESTAMP(timezone=True), default=utcnow)
    updated_at  = Column(TIMESTAMP(timezone=True), default=utcnow, onupdate=utcnow)

    products    = relationship("Product", back_populates="brand")


# ──────────────────────────────────────────────────────────
class Category(Base):
    __tablename__ = "categories"

    id          = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name        = Column(String(200), nullable=False)
    slug        = Column(String(200), nullable=False, unique=True)
    parent_id   = Column(UUID(as_uuid=True), ForeignKey("categories.id"), nullable=True)
    icon_svg    = Column(Text)
    sort_order  = Column(Integer, default=0)
    created_at  = Column(TIMESTAMP(timezone=True), default=utcnow)

    products    = relationship("Product", back_populates="category")
    children    = relationship("Category", backref="parent", remote_side=[id])


# ──────────────────────────────────────────────────────────
class Product(Base):
    __tablename__ = "products"

    id              = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    slug            = Column(String(500), nullable=False, unique=True)
    name            = Column(String(500), nullable=False)
    brand_id        = Column(UUID(as_uuid=True), ForeignKey("brands.id"), nullable=True)
    category_id     = Column(UUID(as_uuid=True), ForeignKey("categories.id"), nullable=True)
    specs           = Column(JSONB, default=dict)
    images          = Column(ARRAY(Text), default=list)
    description     = Column(Text)
    avg_rating      = Column(Numeric(2, 1), default=0)
    review_count    = Column(Integer, default=0)
    seo_title       = Column(String(200))
    seo_description = Column(String(320))
    is_active       = Column(Boolean, default=True)
    is_complete     = Column(Boolean, default=True)
    created_at      = Column(TIMESTAMP(timezone=True), default=utcnow)
    updated_at      = Column(TIMESTAMP(timezone=True), default=utcnow, onupdate=utcnow)

    brand       = relationship("Brand", back_populates="products")
    category    = relationship("Category", back_populates="products")
    prices      = relationship("Price", back_populates="product", cascade="all, delete-orphan")
    reviews     = relationship("Review", back_populates="product", cascade="all, delete-orphan")
    alerts      = relationship("PriceAlert", back_populates="product", cascade="all, delete-orphan")
    game_req    = relationship("GameRequirement", back_populates="product", uselist=False)


# ──────────────────────────────────────────────────────────
class Source(Base):
    __tablename__ = "sources"

    id              = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name            = Column(String(100), nullable=False, unique=True)
    display_name    = Column(String(200))
    logo_url        = Column(Text)
    base_url        = Column(Text)
    affiliate_param = Column(Text)
    affiliate_id    = Column(Text)
    is_active       = Column(Boolean, default=True)

    prices          = relationship("Price", back_populates="source")


# ──────────────────────────────────────────────────────────
class Price(Base):
    __tablename__ = "prices"
    __table_args__ = (UniqueConstraint("product_id", "source_id"),)

    id              = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    product_id      = Column(UUID(as_uuid=True), ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    source_id       = Column(UUID(as_uuid=True), ForeignKey("sources.id"), nullable=False)
    price           = Column(Numeric(12, 2), nullable=False)
    in_stock        = Column(Boolean, default=True)
    free_ship       = Column(Boolean, default=False)
    url             = Column(Text)
    affiliate_url   = Column(Text)
    scraped_at      = Column(TIMESTAMP(timezone=True), default=utcnow)

    product         = relationship("Product", back_populates="prices")
    source          = relationship("Source", back_populates="prices")


# ──────────────────────────────────────────────────────────
class User(Base):
    __tablename__ = "users"

    id                  = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email               = Column(String(255), unique=True, nullable=False)
    hashed_password     = Column(String(255), nullable=False)
    full_name           = Column(String(300))
    role                = Column(String(50), default="user")
    badge               = Column(String(100))
    review_count        = Column(Integer, default=0)
    push_subscription   = Column(JSONB)
    is_active           = Column(Boolean, default=True)
    last_login          = Column(TIMESTAMP(timezone=True))
    created_at          = Column(TIMESTAMP(timezone=True), default=utcnow)

    reviews             = relationship("Review", back_populates="user")
    alerts              = relationship("PriceAlert", back_populates="user")


# ──────────────────────────────────────────────────────────
class Review(Base):
    __tablename__ = "reviews"
    __table_args__ = (UniqueConstraint("product_id", "user_id"),)

    id              = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    product_id      = Column(UUID(as_uuid=True), ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    user_id         = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    rating          = Column(SmallInteger, nullable=False)
    title           = Column(String(300))
    content         = Column(Text, nullable=False)
    approved        = Column(Boolean, default=False)
    helpful_count   = Column(Integer, default=0)
    created_at      = Column(TIMESTAMP(timezone=True), default=utcnow)

    product         = relationship("Product", back_populates="reviews")
    user            = relationship("User", back_populates="reviews")


# ──────────────────────────────────────────────────────────
class PriceAlert(Base):
    __tablename__ = "price_alerts"

    id              = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    product_id      = Column(UUID(as_uuid=True), ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    user_id         = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=True)
    target_price    = Column(Numeric(12, 2), nullable=False)
    email           = Column(String(255))
    is_active       = Column(Boolean, default=True)
    triggered_at    = Column(TIMESTAMP(timezone=True))
    created_at      = Column(TIMESTAMP(timezone=True), default=utcnow)

    product         = relationship("Product", back_populates="alerts")
    user            = relationship("User", back_populates="alerts")


# ──────────────────────────────────────────────────────────
class Banner(Base):
    __tablename__ = "banners"

    id          = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title       = Column(String(300))
    image_url   = Column(Text, nullable=False)
    link_url    = Column(Text)
    position    = Column(String(50), default="hero")
    is_active   = Column(Boolean, default=True)
    sort_order  = Column(Integer, default=0)
    click_count = Column(Integer, default=0)
    view_count  = Column(Integer, default=0)
    created_by  = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    starts_at   = Column(TIMESTAMP(timezone=True))
    ends_at     = Column(TIMESTAMP(timezone=True))
    created_at  = Column(TIMESTAMP(timezone=True), default=utcnow)


# ──────────────────────────────────────────────────────────
class GameRequirement(Base):
    __tablename__ = "game_requirements"

    id              = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    product_id      = Column(UUID(as_uuid=True), ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    min_cpu         = Column(String(200))
    min_gpu         = Column(String(200))
    min_ram_gb      = Column(Integer)
    min_storage_gb  = Column(Integer)
    rec_cpu         = Column(String(200))
    rec_gpu         = Column(String(200))
    rec_ram_gb      = Column(Integer)
    ultra_cpu       = Column(String(200))
    ultra_gpu       = Column(String(200))
    ultra_ram_gb    = Column(Integer)

    product         = relationship("Product", back_populates="game_req")


# ──────────────────────────────────────────────────────────
class SiteSetting(Base):
    __tablename__ = "site_settings"

    key         = Column(String(200), primary_key=True)
    value       = Column(Text)
    updated_at  = Column(TIMESTAMP(timezone=True), default=utcnow, onupdate=utcnow)


# ──────────────────────────────────────────────────────────
class Deal(Base):
    __tablename__ = "deals"

    id              = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title           = Column(String(500), nullable=False)
    description     = Column(Text)
    platform        = Column(String(100))
    discount_pct    = Column(Integer)
    original_price  = Column(Numeric(12, 2))
    deal_price      = Column(Numeric(12, 2))
    deal_url        = Column(Text)
    image_url       = Column(Text)
    is_free         = Column(Boolean, default=False)
    expires_at      = Column(TIMESTAMP(timezone=True))
    is_active       = Column(Boolean, default=True)
    created_at      = Column(TIMESTAMP(timezone=True), default=utcnow)
