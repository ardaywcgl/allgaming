import type { Metadata } from "next";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import ChatWidget from "@/components/ChatWidget/ChatWidget";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Kategoriler — HepsiGaming",
  description: "Aradığınız oyun donanımı kategorisini seçin.",
};

const CATEGORIES = [
  { name: "Mouse", icon: "🖱️", slug: "mouse", description: "Hassas sensörlü oyuncu fareleri", count: "1,240 ürün" },
  { name: "Klavye", icon: "⌨️", slug: "klavye", description: "Mekanik ve membran oyuncu klavyeleri", count: "820 ürün" },
  { name: "Kulaklık", icon: "🎧", slug: "kulaklik", description: "7.1 surround ses ve gürültü engelleyici kulaklıklar", count: "610 ürün" },
  { name: "Monitör", icon: "🖥️", slug: "monitor", description: "Yüksek yenileme hızlı (Hz) oyuncu monitörleri", count: "430 ürün" },
  { name: "GPU (Ekran Kartı)", icon: "🎮", slug: "ekran-karti", description: "Nvidia RTX ve AMD Radeon ekran kartları", count: "310 ürün" },
  { name: "İşlemci (CPU)", icon: "⚡", slug: "islemci", description: "Intel Core ve AMD Ryzen işlemciler", count: "250 ürün" },
  { name: "Konsol", icon: "🕹️", slug: "konsol", description: "PS5, Xbox Series X/S ve Nintendo Switch konsolları", count: "150 ürün" },
  { name: "Koltuk", icon: "🪑", slug: "oyuncu-koltugu", description: "Ergonomik oyuncu koltukları", count: "205 ürün" },
  { name: "Anakart", icon: "🔌", slug: "anakart", description: "Gaming uyumlu gelişmiş anakartlar", count: "190 ürün" },
  { name: "RAM (Bellek)", icon: "💾", slug: "ram", description: "Yüksek hızlı DDR4 ve DDR5 bellek kitleri", count: "280 ürün" },
  { name: "SSD / Depolama", icon: "💽", slug: "depolama", description: "Hızlı NVMe M.2 SSD ve depolama çözümleri", count: "340 ürün" },
  { name: "Kasa / Soğutma", icon: "💨", slug: "kasa-sogutma", description: "RGB oyuncu kasaları ve sıvı soğutma kitleri", count: "410 ürün" }
];

export default function KategorilerPage() {
  return (
    <>
      <Header />
      <main className="min-h-[80vh] py-12 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            Donanım <span className="text-gradient-purple">Kategorileri</span>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            İhtiyacınız olan oyun ekipmanını veya PC bileşenini seçerek fiyat karşılaştırmasına başlayın.
          </p>
        </div>

        {/* Kategoriler Izgarası */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/kategoriler/${cat.slug}`}
              className="card-glass p-6 flex flex-col justify-between hover:scale-[1.02] active:scale-[0.98] cursor-pointer transition-all no-underline text-white group"
            >
              <div>
                <div className="text-4xl mb-4 w-12 h-12 rounded-xl flex items-center justify-center bg-white/5 group-hover:bg-purple-500/10 transition-colors">
                  {cat.icon}
                </div>
                <h3 className="text-lg font-bold mb-2 group-hover:text-purple-400 transition-colors">{cat.name}</h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-4">{cat.description}</p>
              </div>
              <div className="text-xs text-purple-400 font-semibold group-hover:text-purple-300">
                {cat.count} &rarr;
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}
