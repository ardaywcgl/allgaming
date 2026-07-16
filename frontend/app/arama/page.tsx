import type { Metadata } from "next";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import ChatWidget from "@/components/ChatWidget/ChatWidget";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function searchProducts(q: string) {
  try {
    const res = await fetch(`${API_URL}/api/v1/products?q=${encodeURIComponent(q)}`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.items || [];
  } catch {
    return [];
  }
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}): Promise<Metadata> {
  const { q = "" } = await searchParams;
  return {
    title: q ? `"${q}" için Arama Sonuçları — HepsiGaming` : "Arama Yapın — HepsiGaming",
    description: "HepsiGaming üzerinde oyun donanımları arayın ve karşılaştırın.",
  };
}

export default async function AramaPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const products = q ? await searchProducts(q) : [];

  return (
    <>
      <Header />
      <main className="min-h-[80vh] py-12 px-4 max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-black mb-2 text-white">
            {q ? `"${q}" Arama Sonuçları` : "Arama Yapın"}
          </h1>
          <p className="text-slate-400">
            {q ? `${products.length} ürün listeleniyor.` : "Lütfen arama yapmak istediğiniz kelimeyi girin."}
          </p>
        </div>

        {q && products.length === 0 ? (
          <div className="card-glass p-12 text-center text-slate-400">
            Aradığınız kritere uygun ürün bulunamadı. Lütfen başka bir anahtar kelime deneyin.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product: any) => (
              <div key={product.id} className="card-glass p-5 relative group flex flex-col justify-between hover-trigger reveal-2">
                <div>
                  <div className="text-5xl text-center mb-4 mt-2">
                    {product.images?.[0] || "🎮"}
                  </div>
                  <div className="text-xs font-medium text-purple-400 mb-1 capitalize">
                    {product.category?.name || "Donanım"}
                  </div>
                  <h3 className="font-semibold text-slate-100 mb-2 line-clamp-2">{product.name}</h3>
                  <div className="flex items-center gap-1.5 mb-4">
                    <span className="star-rating text-sm">{"★".repeat(Math.floor(product.avg_rating || 4.5))}</span>
                    <span className="text-xs text-slate-400">{product.avg_rating || 4.5} ({product.review_count || 0})</span>
                  </div>
                </div>

                <div className="border-t border-white/5 pt-4 mt-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-slate-500">En Düşük Fiyat</div>
                      <div className="text-lg font-black text-white">
                        {product.min_price ? `${product.min_price.toLocaleString("tr-TR")} ₺` : "Fiyat Yok"}
                      </div>
                    </div>
                    <Link
                      href={`/urun/${product.slug}`}
                      className="btn-primary text-xs py-2 px-5 no-underline"
                    >
                      Karşılaştır
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}
