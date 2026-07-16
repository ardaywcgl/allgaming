import type { Metadata } from "next";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import ChatWidget from "@/components/ChatWidget/ChatWidget";
import Link from "next/link";
import InteractiveProcess from "@/components/InteractiveProcess/InteractiveProcess";
import HeroSection from "@/components/HeroSection/HeroSection";

export const metadata: Metadata = {
  title: "HepsiGaming — Türkiye'nin Oyun Donanımı Fiyat Karşılaştırma Platformu",
  description:
    "Mouse, klavye, kulaklık, GPU, konsol ve 1000+ ürünü 10+ siteden karşılaştır. Anlık fiyat güncellemeleri.",
};

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="space-y-16">
        <HeroSection />
        <FeaturedCategories />
        <HotDealsSection />
        <FeaturedProducts />
        <BrandZoneSection />
        <InteractiveProcess />
        <WhyHepsiGaming />
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}

/* ─────────────────────────────────────────────────────────
   KATEGORİLER
───────────────────────────────────────────────────────── */
const CATEGORIES = [
  { name: "Mouse", icon: "🖱️", slug: "mouse", count: "1.2K+" },
  { name: "Klavye", icon: "⌨️", slug: "klavye", count: "800+" },
  { name: "Kulaklık", icon: "🎧", slug: "kulaklik", count: "600+" },
  { name: "Monitör", icon: "🖥️", slug: "monitor", count: "400+" },
  { name: "GPU", icon: "🎮", slug: "ekran-karti", count: "300+" },
  { name: "İşlemci", icon: "⚡", slug: "islemci", count: "250+" },
  { name: "Konsol", icon: "🕹️", slug: "konsol", count: "150+" },
  { name: "Koltuk", icon: "🪑", slug: "oyuncu-koltugu", count: "200+" },
];

function FeaturedCategories() {
  return (
    <section className="py-16 px-4 max-w-7xl mx-auto reveal-2">
      <h2 className="section-title mb-8">Kategoriler</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {CATEGORIES.map((cat) => (
          <a
            key={cat.slug}
            href={`/kategori/${cat.slug}`}
            className="card-glass p-4 text-center group cursor-pointer no-underline hover-trigger"
          >
            <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-200">
              {cat.icon}
            </div>
            <div className="text-sm font-semibold text-slate-200">{cat.name}</div>
            <div className="text-xs text-slate-500 mt-1">{cat.count}</div>
          </a>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────
   GÜNÜN FIRSATLARI
───────────────────────────────────────────────────────── */
const MOCK_DEALS = [
  { title: "Logitech G Pro X Superlight 2", slug: "logitech-g-pro-x-superlight-2", discount: 25, price: "5.890", original: "6.990", img: "🖱️", source: "Amazon" },
  { title: "Razer DeathAdder V3 Pro", slug: "razer-deathadder-v3-pro", discount: 15, price: "5.490", original: "6.200", img: "🖱️", source: "Trendyol" },
  { title: "ASUS ROG Swift 32\"", slug: "asus-rog-swift-32", discount: 20, price: "30.799", original: "34.999", img: "🖥️", source: "Trendyol" },
  { title: "SteelSeries Arctis Nova Pro", slug: "steelseries-arctis-nova-pro", discount: 15, price: "11.310", original: "14.500", img: "🎧", source: "Hepsiburada" },
];

function HotDealsSection() {
  return (
    <section className="py-16 px-4 max-w-7xl mx-auto reveal-2">
      <div className="flex items-center justify-between mb-8">
        <h2 className="section-title">
          <span className="text-orange-400">🔥</span> Günün Fırsatları
        </h2>
        <a href="/firsatlar" className="text-sm text-pink-400 hover:text-pink-300 transition-colors">
          Tümünü gör →
        </a>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {MOCK_DEALS.map((deal) => (
          <div key={deal.title} className="card-glass p-4 relative overflow-hidden group hover-trigger">
            <div className="absolute top-3 right-3 badge-hot">-%{deal.discount}</div>
            <div className="text-5xl mb-4 text-center">{deal.img}</div>
            <div className="text-sm font-semibold text-slate-200 mb-2 line-clamp-2">{deal.title}</div>
            <div className="text-xs text-slate-500 mb-3">{deal.source}</div>
            <div className="flex items-end justify-between">
              <div>
                <span className="text-xs text-slate-500 line-through">{deal.original}₺</span>
                <div className="price-tag">{deal.price}₺</div>
              </div>
              <a href={`/urun/${deal.slug}`} className="btn-primary text-xs py-2 px-4 no-underline flex items-center justify-center">
                İncele
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────
   ÖNE ÇIKAN ÜRÜNLER
───────────────────────────────────────────────────────── */
const MOCK_PRODUCTS = [
  { name: "Logitech G Pro X Superlight 2", slug: "logitech-g-pro-x-superlight-2", category: "Mouse", minPrice: "5.890", sources: 4, rating: 4.7, reviews: 342, img: "🖱️", badge: "best" },
  { name: "Razer DeathAdder V3 Pro", slug: "razer-deathadder-v3-pro", category: "Mouse", minPrice: "5.490", sources: 4, rating: 4.5, reviews: 218, img: "🖱️", badge: null },
  { name: "MSI GeForce RTX 4070 Ti Super VENTUS 3X", slug: "msi-rtx-4070-ti-super-ventus", category: "GPU", minPrice: "24.500", sources: 4, rating: 4.8, reviews: 127, img: "🎮", badge: "hot" },
  { name: "ASUS ROG Swift 32\"", slug: "asus-rog-swift-32", category: "Monitör", minPrice: "30.799", sources: 4, rating: 4.7, reviews: 203, img: "🖥️", badge: "hot" },
  { name: "SteelSeries Arctis Nova Pro", slug: "steelseries-arctis-nova-pro", category: "Kulaklık", minPrice: "11.310", sources: 4, rating: 4.6, reviews: 456, img: "🎧", badge: null },
  { name: "AMD Ryzen 7 7800X3D", slug: "amd-ryzen-7-7800x3d", category: "CPU", minPrice: "14.950", sources: 4, rating: 4.9, reviews: 891, img: "⚡", badge: "best" },
];

function FeaturedProducts() {
  return (
    <section className="py-16 px-4 max-w-7xl mx-auto reveal-3">
      <div className="flex items-center justify-between mb-8">
        <h2 className="section-title">Öne Çıkan Ürünler</h2>
        <a href="/arama" className="text-sm text-pink-400 hover:text-pink-300 transition-colors">
          Tümünü gör →
        </a>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {MOCK_PRODUCTS.map((product) => (
          <ProductCard key={product.name} product={product} />
        ))}
      </div>
    </section>
  );
}

function ProductCard({ product }: { product: typeof MOCK_PRODUCTS[0] }) {
  return (
    <div className="card-glass p-5 relative group hover-trigger">
      {product.badge === "best" && (
        <div className="absolute top-4 left-4 badge-best-price">En İyi Fiyat</div>
      )}
      {product.badge === "hot" && (
        <div className="absolute top-4 left-4 badge-hot">Trend</div>
      )}

      <div className="text-5xl text-center mb-4 mt-2">{product.img}</div>

      <div className="text-xs font-medium text-pink-400 mb-1">{product.category}</div>
      <h3 className="font-semibold text-slate-100 mb-1 line-clamp-2">{product.name}</h3>

      <div className="flex items-center gap-1.5 mb-3">
        <span className="star-rating text-sm">{"★".repeat(Math.floor(product.rating))}</span>
        <span className="text-xs text-slate-400">{product.rating} ({product.reviews})</span>
      </div>

      <div className="neon-divider" />

      <div className="flex items-end justify-between mt-3">
        <div>
          <div className="text-xs text-slate-500 mb-0.5">{product.sources} siteden en ucuz</div>
          <div className="price-tag-large">{product.minPrice}₺</div>
        </div>
        <div className="flex gap-2">
          <Link href="/karsilastir" className="btn-icon no-underline flex items-center justify-center" title="Karşılaştırmaya ekle">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </Link>
          <Link href={`/urun/${product.slug}`} className="btn-primary text-sm py-2 px-5 no-underline flex items-center justify-center">
            Karşılaştır
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   MARKA ZONE
───────────────────────────────────────────────────────── */
const BRANDS = [
  { name: "Razer", emoji: "🐍", slug: "razer" },
  { name: "Logitech", emoji: "🖱️", slug: "logitech" },
  { name: "Corsair", emoji: "⚔️", slug: "corsair" },
  { name: "ASUS ROG", emoji: "🦅", slug: "asus-rog" },
  { name: "SteelSeries", emoji: "🎯", slug: "steelseries" },
  { name: "HyperX", emoji: "💜", slug: "hyperx" },
  { name: "MSI", emoji: "🐉", slug: "msi" },
  { name: "Sony", emoji: "🎮", slug: "sony" },
];

function BrandZoneSection() {
  return (
    <section className="py-16 px-4 max-w-7xl mx-auto reveal-4">
      <h2 className="section-title mb-8">Marka Vitrinleri</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {BRANDS.map((brand) => (
          <a
            key={brand.slug}
            href={`/marka/${brand.slug}`}
            className="card-glass p-4 text-center group cursor-pointer no-underline hover-trigger"
          >
            <div className="text-2xl mb-2">{brand.emoji}</div>
            <div className="text-xs font-semibold text-slate-300 group-hover:text-white transition-colors">
              {brand.name}
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────
   NEDEN HEPSİGAMING
───────────────────────────────────────────────────────── */
const FEATURES = [
  {
    icon: "⚡",
    title: "Anlık Fiyat Takibi",
    desc: "Botlarımız günde 3 kez 10 farklı siteyi tarar. Her zaman güncel fiyat.",
  },
  {
    icon: "🔔",
    title: "Fiyat Düşünce Bildir",
    desc: "İstediğin fiyatı belirle, ürün o fiyata düşünce telefonuna bildirim gelsin.",
  },
  {
    icon: "🤖",
    title: "AI Alışveriş Asistanı",
    desc: "Bütçeni ve ihtiyaçlarını anlat, sana en uygun ürünü anında bulsun.",
  },
  {
    icon: "🎮",
    title: "Sistem Gereksinimi Testi",
    desc: "PC'nin hangi oyunları hangi ayarlarda çalıştırabileceğini öğren.",
  },
];

function WhyHepsiGaming() {
  return (
    <section className="py-20 px-4 max-w-7xl mx-auto reveal-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-black mb-4">
          Neden <span className="text-gradient-hot">HepsiGaming</span>?
        </h2>
        <p className="text-slate-400 max-w-xl mx-auto">
          Oyuncular için oyuncular tarafından tasarlandı. Her özellik daha iyi bir alışveriş deneyimi için.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {FEATURES.map((feat) => (
          <div key={feat.title} className="card-glass p-6 text-center group hover-trigger">
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{feat.icon}</div>
            <h3 className="font-bold text-slate-100 mb-2">{feat.title}</h3>
            <p className="text-sm text-slate-400 leading-relaxed">{feat.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
