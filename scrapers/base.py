"""
Playwright Base Scraper — Tüm site scraper'larının temel sınıfı
"""
import asyncio
import logging
from abc import ABC, abstractmethod
from typing import Optional
from playwright.async_api import async_playwright, Browser, Page, BrowserContext

logger = logging.getLogger(__name__)


class ScrapedPrice:
    def __init__(
        self,
        product_id: str,
        source_name: str,
        price: float,
        url: str,
        in_stock: bool = True,
        free_ship: bool = False,
    ):
        self.product_id = product_id
        self.source_name = source_name
        self.price = price
        self.url = url
        self.in_stock = in_stock
        self.free_ship = free_ship


class BaseScraper(ABC):
    """
    Tüm scraper'lar bu sınıftan türetilir.
    Playwright ile JS-rendered dinamik sayfaları destekler.
    """
    SOURCE_NAME: str = ""
    BASE_URL: str = ""

    def __init__(self):
        self.browser: Optional[Browser] = None
        self.context: Optional[BrowserContext] = None

    async def __aenter__(self):
        self.playwright = await async_playwright().start()
        self.browser = await self.playwright.chromium.launch(
            headless=True,
            args=[
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-blink-features=AutomationControlled",
                "--disable-dev-shm-usage",
            ],
        )
        self.context = await self.browser.new_context(
            user_agent=(
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/120.0.0.0 Safari/537.36"
            ),
            viewport={"width": 1920, "height": 1080},
            locale="tr-TR",
        )
        return self

    async def __aexit__(self, *args):
        if self.browser:
            await self.browser.close()
        if self.playwright:
            await self.playwright.stop()

    async def get_page(self) -> Page:
        page = await self.context.new_page()
        # Bot tespitini engelle
        await page.add_init_script("""
            Object.defineProperty(navigator, 'webdriver', {get: () => undefined});
        """)
        return page

    async def safe_get(self, page: Page, url: str, wait_for: Optional[str] = None, timeout: int = 15000) -> bool:
        """URL'yi güvenli şekilde yükle."""
        try:
            await page.goto(url, wait_until="domcontentloaded", timeout=timeout)
            if wait_for:
                await page.wait_for_selector(wait_for, timeout=timeout)
            await asyncio.sleep(1)  # Yükleme süresi bekle
            return True
        except Exception as e:
            logger.error(f"[{self.SOURCE_NAME}] Sayfa yüklenemedi: {url} — {e}")
            return False

    @abstractmethod
    async def scrape_product(self, url: str, product_id: str) -> Optional[ScrapedPrice]:
        """Alt sınıflar bu metodu implement eder."""
        pass

    def build_affiliate_url(self, url: str, affiliate_id: str, affiliate_param: str) -> str:
        """Affiliate parametresi ekle."""
        if not affiliate_id or not affiliate_param:
            return url
        separator = "&" if "?" in url else "?"
        return f"{url}{separator}{affiliate_param}={affiliate_id}"
