"""
Trendyol Scraper — Affiliate link desteği dahil
"""
import re
import logging
from typing import Optional
from playwright.async_api import Page

from base import BaseScraper, ScrapedPrice

logger = logging.getLogger(__name__)


class TrendyolScraper(BaseScraper):
    SOURCE_NAME = "trendyol"
    BASE_URL = "https://www.trendyol.com"

    # Trendyol affiliate yapısı
    AFFILIATE_PARAM = "boutiqueId"

    async def scrape_product(self, url: str, product_id: str) -> Optional[ScrapedPrice]:
        async with self:
            page = await self.get_page()
            loaded = await self.safe_get(
                page, url,
                wait_for=".pr-new-br",  # Trendyol fiyat elementi
                timeout=20000
            )
            if not loaded:
                return None

            return await self._extract_price(page, url, product_id)

    async def _extract_price(self, page: Page, url: str, product_id: str) -> Optional[ScrapedPrice]:
        try:
            # Fiyat
            price_text = await page.text_content(".prc-dsc", timeout=5000)
            if not price_text:
                # Alternatif selektör
                price_text = await page.text_content(".product-price-container .prc-slg", timeout=5000)

            price = self._parse_price(price_text)
            if not price:
                logger.warning(f"[Trendyol] Fiyat bulunamadı: {url}")
                return None

            # Stok durumu
            in_stock = True
            try:
                add_to_cart = await page.query_selector(".add-to-basket-button-v2")
                if add_to_cart:
                    disabled = await add_to_cart.get_attribute("disabled")
                    in_stock = disabled is None
                else:
                    # "Stokta Yok" yazısını ara
                    out_of_stock = await page.query_selector(".out-of-stock")
                    in_stock = out_of_stock is None
            except Exception:
                pass

            # Ücretsiz kargo kontrolü
            free_ship = False
            try:
                cargo_text = await page.text_content(".cargo-detail-text", timeout=3000)
                free_ship = cargo_text and ("ücretsiz" in cargo_text.lower() or "bedava" in cargo_text.lower())
            except Exception:
                pass

            return ScrapedPrice(
                product_id=product_id,
                source_name=self.SOURCE_NAME,
                price=price,
                url=url,
                in_stock=in_stock,
                free_ship=bool(free_ship),
            )

        except Exception as e:
            logger.error(f"[Trendyol] Veri çıkarma hatası: {url} — {e}")
            return None

    def _parse_price(self, text: str) -> Optional[float]:
        if not text:
            return None
        # "1.234,56 TL" veya "1234.56" formatları
        cleaned = re.sub(r"[^\d,.]", "", text.strip())
        # Türkçe format: 1.234,56 → 1234.56
        if "," in cleaned and "." in cleaned:
            cleaned = cleaned.replace(".", "").replace(",", ".")
        elif "," in cleaned:
            cleaned = cleaned.replace(",", ".")
        try:
            return float(cleaned)
        except ValueError:
            return None
