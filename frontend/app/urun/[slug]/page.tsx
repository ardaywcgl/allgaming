import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import ChatWidget from "@/components/ChatWidget/ChatWidget";
import PriceCompareTable from "@/components/PriceCompareTable/PriceCompareTable";
import PriceHistoryChart from "@/components/PriceHistoryChart/PriceHistoryChart";
import ReviewSection from "@/components/ReviewSection/ReviewSection";
import SystemChecker from "@/components/SystemChecker/SystemChecker";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function getProduct(slug: string) {
  try {
    const res = await fetch(`${API_URL}/api/v1/products/${slug}`, {
      next: { revalidate: 3600 }, // ISR: 1 saatte bir yenile
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

// Dinamik SEO metadata (SSR)
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Ürün Bulunamadı | HepsiGaming" };

  return {
    title: product.seo?.title || `${product.name} | HepsiGaming`,
    description: product.seo?.description,
    openGraph: {
      title: product.seo?.og_title,
      description: product.seo?.og_description,
      images: product.seo?.og_image ? [{ url: product.seo.og_image }] : [],
      type: "website",
    },
    other: product.seo?.schema_org
      ? { "application/ld+json": JSON.stringify(product.seo.schema_org) }
      : {},
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) notFound();

  const prices = product.prices || [];
  const cheapestPrice = prices[0];

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <a href="/" className="hover:text-slate-300 transition-colors no-underline">Ana Sayfa</a>
          <span>/</span>
          {product.category && (
            <>
              <a href={`/kategori/${product.category.slug}`} className="hover:text-slate-300 transition-colors no-underline capitalize">
                {product.category.name}
              </a>
              <span>/</span>
            </>
          )}
          <span className="text-slate-300 truncate max-w-[200px]">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* Sol: Görsel + Detaylar */}
          <div className="lg:col-span-2">
            <div className="card-glass p-6 mb-4">
              {/* Ürün görseli */}
              <div className="aspect-square rounded-xl flex items-center justify-center text-8xl mb-4"
                style={{ background: "var(--color-bg-secondary)" }}>
                🎮
              </div>

              {product.brand && (
                <div className="text-xs font-semibold text-purple-400 mb-1 uppercase tracking-wider">
                  {product.brand.name}
                </div>
              )}
              <h1 className="text-xl font-bold text-white mb-4">{product.name}</h1>

              {/* Yıldız */}
              <div className="flex items-center gap-2 mb-4">
                <span className="star-rating">{"★".repeat(Math.floor(product.avg_rating || 0))}</span>
                <span className="text-sm text-slate-400">
                  {product.avg_rating} ({product.review_count} yorum)
                </span>
              </div>

              {/* En düşük fiyat */}
              {cheapestPrice && (
                <div className="p-4 rounded-xl mb-4" style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)" }}>
                  <div className="text-xs text-green-400 font-semibold mb-1">🏆 En İyi Fiyat</div>
                  <div className="price-tag-large text-green-400">{cheapestPrice.price}₺</div>
                  <div className="text-xs text-slate-400 mt-1">
                    {cheapestPrice.source} · {cheapestPrice.free_ship ? "✓ Ücretsiz Kargo" : ""}
                  </div>
                  <a
                    href={cheapestPrice.affiliate_url || cheapestPrice.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary w-full text-center mt-3 block no-underline text-sm"
                  >
                    Hemen Satın Al →
                  </a>
                </div>
              )}

              {/* Fiyat Alarmı */}
              <button
                id="set-price-alert-btn"
                className="btn-secondary w-full text-sm flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                Fiyat Düşünce Bildir
              </button>
            </div>

            {/* Teknik Özellikler */}
            {product.specs && Object.keys(product.specs).length > 0 && (
              <div className="card-glass p-6">
                <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4">Teknik Özellikler</h2>
                <dl className="space-y-2">
                  {Object.entries(product.specs).map(([key, val]) => (
                    <div key={key} className="flex justify-between gap-4 text-sm py-1.5"
                      style={{ borderBottom: "1px solid var(--color-border)" }}>
                      <dt className="text-slate-500 capitalize">{key.replace(/_/g, " ")}</dt>
                      <dd className="text-slate-200 text-right font-medium">{String(val)}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>

          {/* Sağ: Fiyat Karşılaştırma + Grafik */}
          <div className="lg:col-span-3 space-y-6">
            <PriceCompareTable prices={product.all_prices || []} />
            <PriceHistoryChart productId={product.id} productName={product.name} />
            {product.game_requirements && (
              <SystemChecker requirements={product.game_requirements} />
            )}
          </div>
        </div>

        {/* Yorumlar */}
        <div className="mt-10">
          <ReviewSection productId={product.id} />
        </div>
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}
