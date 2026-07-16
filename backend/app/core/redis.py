"""
Redis istemcisi — Cache-Aside pattern için
"""
import json
from typing import Any, Optional
import redis.asyncio as aioredis
from app.core.config import settings

# Singleton Redis bağlantısı
_redis_client: Optional[aioredis.Redis] = None


async def get_redis() -> aioredis.Redis:
    global _redis_client
    if _redis_client is None:
        _redis_client = await aioredis.from_url(
            settings.REDIS_URL,
            encoding="utf-8",
            decode_responses=True,
        )
    return _redis_client


# ─── Cache-Aside Yardımcıları ────────────────────────────────────

async def cache_get(key: str) -> Optional[Any]:
    """Redis'ten JSON veri oku."""
    redis = await get_redis()
    value = await redis.get(key)
    if value:
        return json.loads(value)
    return None


async def cache_set(key: str, value: Any, ttl: int = 3600) -> None:
    """Redis'e JSON veri yaz (TTL saniye cinsinden)."""
    redis = await get_redis()
    await redis.setex(key, ttl, json.dumps(value, ensure_ascii=False, default=str))


async def cache_delete(key: str) -> None:
    """Cache'i geçersiz kıl."""
    redis = await get_redis()
    await redis.delete(key)


async def cache_delete_pattern(pattern: str) -> None:
    """Pattern'a uyan tüm anahtarları sil (örn: 'hg:product:*')"""
    redis = await get_redis()
    keys = await redis.keys(pattern)
    if keys:
        await redis.delete(*keys)


# ─── Cache Anahtar Sabitleri ─────────────────────────────────────

class CacheKeys:
    @staticmethod
    def product_prices(product_id: str) -> str:
        return f"hg:product:{product_id}:prices"

    @staticmethod
    def product_detail(slug: str) -> str:
        return f"hg:product:{slug}:detail"

    @staticmethod
    def search(query_hash: str) -> str:
        return f"hg:search:{query_hash}"

    @staticmethod
    def brand(slug: str) -> str:
        return f"hg:brand:{slug}"

    @staticmethod
    def deals() -> str:
        return "hg:deals:all"

    @staticmethod
    def site_settings() -> str:
        return "hg:settings:all"


# TTL sabitler (saniye)
class CacheTTL:
    PRICES = 6 * 3600        # 6 saat
    PRODUCT = 1 * 3600       # 1 saat
    SEARCH = 15 * 60         # 15 dakika
    BRAND = 1 * 3600         # 1 saat
    DEALS = 30 * 60          # 30 dakika
    SETTINGS = 24 * 3600     # 24 saat
