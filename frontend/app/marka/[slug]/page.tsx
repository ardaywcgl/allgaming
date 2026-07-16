import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import ChatWidget from "@/components/ChatWidget/ChatWidget";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function getBrandProducts(slug: string) {
  try {
    const res = await fetch(`${API_URL}/api/v1/products?brand=${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.items || [];
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const capitalized = slug.charAt(0).toUpperCase() + slug.slice(1);
  return {
    title: `${capitalized} Oyuncu Ekipmanları ve Fiyatları — HepsiGaming`,
    description: `En ucuz ${slug} ürünlerini karşılaştırın ve en iyi fiyatı bulun.`,
  };
}

export default async function BrandDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const products = await getBrandProducts(slug);

  if (!products || products.length === 0) {
    const validBrands = ["razer", "logitech", "corsair", "asus", "steelseries", "msi", "samsung", "kingston", "amd", "intel", "asus-rog", "sony", "hyperx"];
    if (!validBrands.includes(slug)) {
      notFound();
    }
  }

  const brandName = slug.charAt(0).toUpperCase() + slug.slice(1).replace("-", " ");

  return (
    <>
      <Header />
      <main className="min-h-[80vh] py-12 px-4 max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <Link href="/" className="hover:text-slate-300 transition-colors no-underline">Ana Sayfa</Link>
          <span>/</span>
          <Link href="/markalar" className="hover:text-slate-300 transition-colors no-underline">Markalar</Link>
          <span>/</span>
          <span className="text-slate-300 capitalize">{brandName}</span>
        </nav>

        <div className="mb-10">
          <h1 className="text-4xl font-black mb-2 capitalize text-white">
            {brandName} <span className="text-gradient-purple">Vitrinleri</span>
          </h1>
          <p className="text-slate-400">
            {products.length} ürün bulundu. En ucuz fiyatı bulmak için karşılaştırın.
          </p>
        </div>

        {products.length === 0 ? (
          <div className="card-glass p-12 text-center text-slate-400">
            Bu markaya ait henüz aktif ürün bulunmuyor. Daha sonra tekrar kontrol edin.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product: any) => (
              <div key={product.id} className="card-glass p-5 relative group flex flex-col justify-between hover-trigger reveal-2">
                <div>
                  <div className="text-5xl text-center mb-4 mt-2">
                    {product.images?.[0] || "🎮"}
                  </div>
                  <div className="text-xs font-medium text-purple-400 mb-1 capitalize">{product.category?.name || "Ekipman"}</div>
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
