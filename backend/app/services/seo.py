"""
SEO Meta Otomatik Üretici
"""
from typing import Optional


def generate_seo_meta(product, min_price: Optional[float], cheapest_source: Optional[str]) -> dict:
    """
    Ürün için otomatik SEO başlığı ve açıklaması üretir.
    Örnek: "Razer DeathAdder V3 Pro En Ucuz Fiyatı ve İncelemesi - HepsiGaming"
    """
    name = product.name
    brand = product.brand.name if product.brand else ""
    category = product.category.name if product.category else "Ürün"

    # Başlık (max 60 karakter ideal)
    title = f"{name} En Ucuz Fiyatı, İncelemeleri ve Özellikleri - HepsiGaming"
    if len(title) > 65:
        title = f"{name} Fiyatı ve İncelemesi - HepsiGaming"

    # Açıklama (max 155 karakter ideal)
    if min_price and cheapest_source:
        description = (
            f"{name} için en iyi fiyat karşılaştırması. "
            f"Güncel fiyat: {min_price:,.0f}₺ ({cheapest_source}). "
            f"{product.review_count} kullanıcı yorumu ile {category} kategorisinde hepsi bir arada."
        )
    else:
        description = (
            f"{name} fiyatları, özellikleri ve kullanıcı incelemeleri. "
            f"HepsiGaming ile 10 siteden en ucuz {category} fiyatını anında karşılaştır."
        )

    # Kırp (max 155 karakter)
    if len(description) > 155:
        description = description[:152] + "..."

    # Slug'dan canonical URL
    canonical = f"https://hepsigaming.com/urun/{product.slug}"

    return {
        "title": title,
        "description": description,
        "canonical": canonical,
        "og_title": title,
        "og_description": description,
        "og_image": product.images[0] if product.images else "/og-default.jpg",
        "og_type": "product",
        "schema_org": {
            "@context": "https://schema.org",
            "@type": "Product",
            "name": name,
            "brand": {"@type": "Brand", "name": brand},
            "offers": {
                "@type": "AggregateOffer",
                "priceCurrency": "TRY",
                "lowPrice": str(min_price) if min_price else None,
            },
            "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": str(product.avg_rating),
                "reviewCount": product.review_count,
            } if product.review_count > 0 else None,
        },
    }


def generate_brand_seo(brand) -> dict:
    """Marka vitrini için SEO meta."""
    return {
        "title": f"{brand.name} Ürünleri - En Ucuz Fiyatlar | HepsiGaming",
        "description": f"{brand.name} oyun donanımlarını karşılaştır. "
                       f"Mouse, klavye, kulaklık ve daha fazlası için en iyi fiyatlar HepsiGaming'de.",
        "canonical": f"https://hepsigaming.com/marka/{brand.slug}",
    }
