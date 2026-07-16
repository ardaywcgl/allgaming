import type { Metadata } from "next";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import ChatWidget from "@/components/ChatWidget/ChatWidget";
import Link from "next/link";
import InteractiveProcess from "@/components/InteractiveProcess/InteractiveProcess";

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
   HERO
───────────────────────────────────────────────────────── */
function HeroSection() {
  return (
    <section
      className="relative min-h-[98vh] flex flex-col items-center justify-center overflow-hidden px-4 reveal-1"
      style={{
        background: "var(--gradient-hero)",
      }}
    >
      {/* Optimus Tarzı Arka Plan Grid Çizgileri */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.06] -z-10">
        <div className="absolute h-px bg-white" style={{ top: "16.6%" }}></div>
        <div className="absolute h-px bg-white" style={{ top: "33.3%" }}></div>
        <div className="absolute h-px bg-white" style={{ top: "50%" }}></div>
        <div className="absolute h-px bg-white" style={{ top: "66.6%" }}></div>
        <div className="absolute h-px bg-white" style={{ top: "83.3%" }}></div>

        <div className="absolute w-px bg-white" style={{ left: "10%" }}></div>
        <div className="absolute w-px bg-white" style={{ left: "20%" }}></div>
        <div className="absolute w-px bg-white" style={{ left: "30%" }}></div>
        <div className="absolute w-px bg-white" style={{ left: "40%" }}></div>
        <div className="absolute w-px bg-white" style={{ left: "50%" }}></div>
        <div className="absolute w-px bg-white" style={{ left: "60%" }}></div>
        <div className="absolute w-px bg-white" style={{ left: "70%" }}></div>
        <div className="absolute w-px bg-white" style={{ left: "80%" }}></div>
        <div className="absolute w-px bg-white" style={{ left: "90%" }}></div>
      </div>

      {/* Yeni Nesil Hareketli Işık Küreleri (Floating Energy Orbs) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10" aria-hidden="true">
        {/* Orb 1: Neon Mor */}
        <div
          className="absolute rounded-full filter blur-[100px] orb-animation-1"
          style={{
            width: "480px",
            height: "480px",
            background: "radial-gradient(circle, rgba(168,85,247,0.18) 0%, transparent 70%)",
            top: "-10%",
            left: "10%",
          }}
        />
        {/* Orb 2: Elektrik Cyan */}
        <div
          className="absolute rounded-full filter blur-[120px] orb-animation-2"
          style={{
            width: "580px",
            height: "580px",
            background: "radial-gradient(circle, rgba(6,182,212,0.16) 0%, transparent 70%)",
            bottom: "5%",
            right: "5%",
          }}
        />
        {/* Orb 3: Cyber Pembe */}
        <div
          className="absolute rounded-full filter blur-[90px] orb-animation-1"
          style={{
            width: "380px",
            height: "380px",
            background: "radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 70%)",
            top: "25%",
            right: "20%",
          }}
        />
      </div>

      <div className="relative z-10 text-center max-w-5xl mx-auto flex flex-col items-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-8 animate-float-slow"
          style={{ 
            background: "rgba(168,85,247,0.1)", 
            borderColor: "rgba(168,85,247,0.25)",
            boxShadow: "0 0 20px rgba(168,85,247,0.1)"
          }}>
          <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_#4ade80]" />
          <span className="text-xs text-purple-300 font-bold uppercase tracking-wider">
            CANLI FİYAT TAKİBİ — 10+ Siteden Anlık Akış
          </span>
        </div>

        {/* Başlık (Karakter Karakter Belirme Animasyonu) */}
        <h1 className="text-5xl md:text-8xl font-black mb-8 leading-[1.1] tracking-tight text-white select-none">
          En Ucuz <span className="text-gradient-cyber">
            {"Oyun Donanımı".split("").map((char, i) => (
              <span
                key={i}
                className="animate-char-in"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </span>
          <br />
          Tek Yerde.
        </h1>

        <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
          Amazon, Trendyol, Hepsiburada ve daha fazlasını karşılaştır.
          Fiyat düşünce cebine bildirim gelsin.
        </p>

        {/* Arama Kutusu */}
        <HeroSearch />

        {/* İstatistikler */}
        <div className="flex flex-wrap justify-center gap-6 mt-12 mb-8">
          {[
            { value: "50K+", label: "Donanım Ürünü" },
            { value: "10+", label: "Entegre Mağaza" },
            { value: "3x", label: "Günlük Güncelleme" },
            { value: "0₺", label: "Sonsuza Kadar Ücretsiz" },
          ].map((stat) => (
            <div key={stat.label} className="text-center px-6 py-2 rounded-xl bg-white/2 border border-white/5 backdrop-blur-sm">
              <div className="text-3xl font-black text-gradient-cyan">{stat.value}</div>
              <div className="text-xs text-slate-500 mt-1 uppercase font-bold tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Canlı İstatistik ve Fiyat Şeridi (Marquee Slider) */}
      <div className="w-full mt-auto py-6 border-t border-white/5 bg-black/40 backdrop-blur-sm overflow-hidden select-none">
        <div className="marquee-container">
          <div className="marquee-track">
            {/* Set 1 */}
            <div className="flex items-center gap-16 text-xs text-slate-400 font-mono shrink-0 whitespace-nowrap">
              <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" /> Razer DeathAdder V3 Pro — Trendyol'da %15 İndirim!</span>
              <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" /> RTX 4070 Ti — En Uygun Fiyat Amazon'da: 24.500₺</span>
              <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-pink-400 animate-pulse" /> SteelSeries Arctis Nova Pro — Hepsiburada'da %20 İndirim</span>
              <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" /> Ryzen 7 7800X3D — Fiyat alarmı 14.500₺ hedefine ulaştı!</span>
            </div>
            {/* Set 2 (Seamless loop için kopya) */}
            <div className="flex items-center gap-16 text-xs text-slate-400 font-mono shrink-0 whitespace-nowrap">
              <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" /> Razer DeathAdder V3 Pro — Trendyol'da %15 İndirim!</span>
              <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" /> RTX 4070 Ti — En Uygun Fiyat Amazon'da: 24.500₺</span>
              <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-pink-400 animate-pulse" /> SteelSeries Arctis Nova Pro — Hepsiburada'da %20 İndirim</span>
              <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" /> Ryzen 7 7800X3D — Fiyat alarmı 14.500₺ hedefine ulaştı!</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroSearch() {
  return (
    <form action="/arama" method="GET" className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto w-full">
      <div className="relative flex-1">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          name="q"
          type="text"
          placeholder="Ürün, marka veya kategori ara..."
          className="input-dark pl-10 h-12 text-base"
        />
      </div>
      <button type="submit" className="btn-primary h-12 px-8 text-base whitespace-nowrap">
        Ara & Karşılaştır
      </button>
    </form>
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
        <a href="/firsatlar" className="text-sm text-purple-400 hover:text-purple-300 transition-colors">
          Tümünü gör →
        </a>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {MOCK_DEALS.map((deal) => (
          <div key={deal.title} className="card-glass p-4 relative overflow-hidden group hover-trigger">
            {/* İndirim rozeti */}
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
        <a href="/arama" className="text-sm text-purple-400 hover:text-purple-300 transition-colors">
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

      <div className="text-xs font-medium text-purple-400 mb-1">{product.category}</div>
      <h3 className="font-semibold text-slate-100 mb-1 line-clamp-2">{product.name}</h3>

      {/* Yıldız */}
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
          Neden <span className="text-gradient-purple">HepsiGaming</span>?
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
