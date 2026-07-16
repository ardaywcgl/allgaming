"""
NLP Chatbot Servisi — Türkçe + İngilizce
Intent tespiti + varlık çıkarma + DB sorgusu + yanıt üretici
"""
import re
from typing import Optional
from dataclasses import dataclass, field


# ─── Intent Tanımları ────────────────────────────────────────────
INTENTS = {
    "product_search": {
        "tr": [
            r"(ara|bul|göster|istiyorum|arıyorum|öner|tavsiye)",
            r"(mouse|klavye|kulaklık|koltuk|monitör|gpu|ekran kartı|işlemci|cpu|kumbara|kask|joystick|konsol|gamepad)",
        ],
        "en": [
            r"(find|search|show|looking|recommend|suggest)",
            r"(mouse|keyboard|headset|chair|monitor|gpu|graphics card|cpu|processor|console|gamepad)",
        ],
    },
    "price_query": {
        "tr": [r"(fiyat|ne kadar|kaç lira|kaç tl|pahalı|ucuz|bütçe|en ucuz)"],
        "en": [r"(price|how much|cost|budget|cheapest|affordable|expensive)"],
    },
    "compare": {
        "tr": [r"(karşılaştır|fark|hangisi|arasındaki|vs\.|versus)"],
        "en": [r"(compare|difference|which one|between|vs\.|versus)"],
    },
    "stock_query": {
        "tr": [r"(stok|var mı|mevcut|satılıyor|tükendi)"],
        "en": [r"(stock|available|in stock|sold out|buy)"],
    },
    "deal_query": {
        "tr": [r"(indirim|kampanya|fırsat|kupon|bedava|ücretsiz)"],
        "en": [r"(deal|discount|sale|coupon|free|offer|promo)"],
    },
    "greeting": {
        "tr": [r"^(merhaba|selam|hey|nasılsın|iyi günler)"],
        "en": [r"^(hi|hello|hey|good morning|good evening|how are you)"],
    },
    "help": {
        "tr": [r"(yardım|ne yapabilirsin|neler yaparsın|nasıl kullanılır)"],
        "en": [r"(help|what can you do|how to use|capabilities)"],
    },
}

# ─── Varlık Çıkarıcılar ──────────────────────────────────────────
BUDGET_PATTERNS = [
    r"(\d[\d.]*)\s*(?:tl|lira|₺)",
    r"(\d[\d.]*)\s*(?:usd|\$|dolar)",
    r"budget[:\s]+\$?(\d[\d,.]*)",
    r"bütçe[m\s]*[:\s]+(\d[\d.]*)",
]

CATEGORY_MAP = {
    "mouse": ["mouse", "fare", "gaming mouse"],
    "keyboard": ["klavye", "keyboard", "mekanik klavye", "mechanical keyboard"],
    "headset": ["kulaklık", "headset", "headphone", "kulak"],
    "monitor": ["monitör", "monitor", "ekran", "screen", "display"],
    "chair": ["koltuk", "chair", "gaming chair", "oyuncu koltuğu"],
    "gpu": ["ekran kartı", "gpu", "graphics card", "rtx", "rx ", "vga"],
    "cpu": ["işlemci", "cpu", "processor", "ryzen", "intel", "core i"],
    "console": ["konsol", "console", "ps5", "xbox", "nintendo"],
    "gamepad": ["gamepad", "joystick", "controller", "kumanda"],
}

WIRELESS_KEYWORDS = ["kablosuz", "wireless", "bluetooth", "wifi"]
FPS_KEYWORDS = ["fps", "birinci şahıs", "nişancı", "shooter", "valorant", "cs2", "csgo"]


@dataclass
class ParsedIntent:
    intent: str = "unknown"
    lang: str = "tr"
    budget: Optional[float] = None
    budget_currency: str = "TRY"
    category: Optional[str] = None
    features: list = field(default_factory=list)
    raw_query: str = ""


def detect_language(text: str) -> str:
    """Basit dil tespiti — Türkçe karakterler veya İngilizce kelimeler."""
    turkish_chars = set("çğıöşüÇĞİÖŞÜ")
    turkish_words = {"ve", "bir", "bu", "ile", "için", "var", "yok", "de", "da", "mı", "mi"}
    english_words = {"the", "and", "for", "with", "is", "are", "have", "want", "looking", "need"}

    words = set(text.lower().split())
    if words & english_words:
        return "en"
    if any(c in turkish_chars for c in text) or words & turkish_words:
        return "tr"
    return "tr"  # Varsayılan Türkçe


def detect_intent(text: str, lang: str) -> str:
    """Metni analiz edip en uygun intent'i döndür."""
    text_lower = text.lower()
    for intent, patterns in INTENTS.items():
        lang_patterns = patterns.get(lang, patterns.get("tr", []))
        for pattern in lang_patterns:
            if re.search(pattern, text_lower):
                return intent
    return "unknown"


def extract_budget(text: str) -> tuple[Optional[float], str]:
    """Metinden bütçe ve para birimi çıkar."""
    for pattern in BUDGET_PATTERNS:
        match = re.search(pattern, text.lower())
        if match:
            amount_str = match.group(1).replace(".", "").replace(",", ".")
            amount = float(amount_str)
            currency = "USD" if "$" in pattern or "usd" in pattern else "TRY"
            return amount, currency
    return None, "TRY"


def extract_category(text: str) -> Optional[str]:
    """Metinden ürün kategorisi çıkar."""
    text_lower = text.lower()
    for category, keywords in CATEGORY_MAP.items():
        if any(kw in text_lower for kw in keywords):
            return category
    return None


def extract_features(text: str) -> list:
    """Özellik etiketleri çıkar (kablosuz, FPS vb.)."""
    features = []
    text_lower = text.lower()
    if any(kw in text_lower for kw in WIRELESS_KEYWORDS):
        features.append("wireless")
    if any(kw in text_lower for kw in FPS_KEYWORDS):
        features.append("fps_gaming")
    return features


def parse_message(text: str) -> ParsedIntent:
    """Ana NLP işleme fonksiyonu."""
    lang = detect_language(text)
    intent = detect_intent(text, lang)
    budget, currency = extract_budget(text)
    category = extract_category(text)
    features = extract_features(text)

    return ParsedIntent(
        intent=intent,
        lang=lang,
        budget=budget,
        budget_currency=currency,
        category=category,
        features=features,
        raw_query=text,
    )


# ─── Yanıt Şablonları ────────────────────────────────────────────
RESPONSES = {
    "greeting": {
        "tr": "Merhaba! 👋 Ben HepsiGaming asistanıyım. Oyun donanımı aramanıza, fiyat karşılaştırmanıza ve bütçenize en uygun ürünü bulmanıza yardımcı olabilirim. Ne arıyorsunuz?",
        "en": "Hello! 👋 I'm the HepsiGaming assistant. I can help you find gaming hardware, compare prices, and find the best product for your budget. What are you looking for?",
    },
    "help": {
        "tr": "Size şu konularda yardımcı olabilirim:\n• 🎮 Ürün arama (\"FPS için mouse ara\")\n• 💰 Fiyat sorma (\"PS5 ne kadar?\")\n• 🔄 Karşılaştırma (\"RTX 4070 vs RX 7800 XT\")\n• 🏷️ İndirimler (\"Bugünün fırsatları neler?\")",
        "en": "I can help you with:\n• 🎮 Product search (\"find a mouse for FPS\")\n• 💰 Price queries (\"how much is PS5?\")\n• 🔄 Comparisons (\"RTX 4070 vs RX 7800 XT\")\n• 🏷️ Deals (\"what are today's deals?\")",
    },
    "no_results": {
        "tr": "Üzgünüm, aramanızla eşleşen ürün bulamadım. Farklı anahtar kelimeler deneyebilir misiniz?",
        "en": "Sorry, I couldn't find products matching your search. Could you try different keywords?",
    },
    "unknown": {
        "tr": "Bunu tam anlayamadım. Ürün aramak, fiyat öğrenmek veya karşılaştırma yapmak ister misiniz?",
        "en": "I didn't quite understand that. Would you like to search for a product, check prices, or make a comparison?",
    },
}


def build_response(parsed: ParsedIntent, products: list) -> dict:
    """Parse sonucu ve DB ürünlerine göre yanıt oluştur."""
    lang = parsed.lang

    if parsed.intent == "greeting":
        return {"message": RESPONSES["greeting"][lang], "products": []}

    if parsed.intent == "help":
        return {"message": RESPONSES["help"][lang], "products": []}

    if parsed.intent == "unknown":
        return {"message": RESPONSES["unknown"][lang], "products": []}

    if not products:
        return {"message": RESPONSES["no_results"][lang], "products": []}

    # Ürün listesi yanıtı
    if lang == "tr":
        filters_desc = []
        if parsed.budget:
            filters_desc.append(f"{parsed.budget:,.0f} {parsed.budget_currency} bütçe")
        if parsed.category:
            filters_desc.append(parsed.category)
        if "wireless" in parsed.features:
            filters_desc.append("kablosuz")

        filter_str = " + ".join(filters_desc) if filters_desc else "aramanız"
        msg = f"**{filter_str}** için {len(products)} ürün buldum 🎯\nEn uygun seçenekler:"
    else:
        filters_desc = []
        if parsed.budget:
            filters_desc.append(f"{parsed.budget:,.0f} {parsed.budget_currency} budget")
        if "wireless" in parsed.features:
            filters_desc.append("wireless")
        filter_str = " + ".join(filters_desc) if filters_desc else "your search"
        msg = f"Found {len(products)} products for **{filter_str}** 🎯\nTop picks:"

    return {"message": msg, "products": products[:5]}
