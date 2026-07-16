import type { Metadata } from "next";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import ChatWidget from "@/components/ChatWidget/ChatWidget";
import Link from "next/link";

export const metadata: Metadata = {
  title: "İndirimler — HepsiGaming",
  description: "Fiyatı en çok düşen oyun donanımları ve ekipmanlar.",
};

const DISCOUNT_PRODUCTS = [
  {
    id: "g502x",
    name: "Logitech G502 X LIGHTSPEED Kablosuz Oyuncu Faresi",
    brand: "Logitech",
    category: "Mouse",
    image: "🖱️",
    discountPercent: 25,
    oldPrice: "4,790 ₺",
    currentPrice: "3,590 ₺",
    bestSource: "Amazon TR",
    status: "Son 30 Günün En Düşük Fiyatı"
  },
  {
    id: "ryzen7800",
    name: "AMD Ryzen 7 7800X3D 4.2GHz 96MB Önbellek AM5 İşlemci",
    brand: "AMD",
    category: "CPU",
    image: "⚡",
    discountPercent: 12,
    oldPrice: "16,990 ₺",
    currentPrice: "14,950 ₺",
    bestSource: "Sinerji",
    status: "Fiyat Düşüşü Kaydedildi"
  },
  {
    id: "fury32",
    name: "Kingston FURY Beast RGB 32GB (2x16GB) 6000MHz DDR5 RAM",
    brand: "Kingston",
    category: "RAM",
    image: "💾",
    discountPercent: 18,
    oldPrice: "5,100 ₺",
    currentPrice: "4,180 ₺",
    bestSource: "Trendyol",
    status: "Son 7 Günün En Düşük Fiyatı"
  },
  {
    id: "samsungevo",
    name: "Samsung 990 PRO 2TB NVMe M.2 SSD (7450MB Okuma / 6900MB Yazma)",
    brand: "Samsung",
    category: "SSD",
    image: "💽",
    discountPercent: 15,
    oldPrice: "7,800 ₺",
    currentPrice: "6,630 ₺",
    bestSource: "Amazon TR",
    status: "Fiyat Stabil / Hafif Düşüş"
  },
  {
    id: "rtx4060ti",
    name: "MSI GeForce RTX 4060 Ti VENTUS 3X 8G OC 8GB Ekran Kartı",
    brand: "MSI",
    category: "GPU",
    image: "🎮",
    discountPercent: 10,
    oldPrice: "18,499 ₺",
    currentPrice: "16,649 ₺",
    bestSource: "N11",
    status: "Son 14 Günün En Düşük Fiyatı"
  },
  {
    id: "arctisnova",
    name: "SteelSeries Arctis Nova Pro Kablosuz Oyuncu Kulaklığı",
    brand: "SteelSeries",
    category: "Kulaklık",
    image: "🎧",
    discountPercent: 22,
    oldPrice: "14,500 ₺",
    currentPrice: "11,310 ₺",
    bestSource: "Hepsiburada",
    status: "Büyük İndirim"
  }
];

export default function IndirimlerPage() {
  return (
    <>
      <Header />
      <main className="min-h-[80vh] py-12 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border mb-4 bg-cyan-500/10 border-cyan-500/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider">
            📉 Fiyatı Düşenler
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            En Yüksek <span className="text-gradient-purple">İndirimler</span>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Takip ettiğimiz tüm mağazalarda fiyat grafiğinde ani düşüş yaşayan donanım ürünleri.
          </p>
        </div>

        {/* İndirim Ürünleri Izgarası */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DISCOUNT_PRODUCTS.map((prod) => (
            <div
              key={prod.id}
              className="card-glass p-6 flex flex-col justify-between hover:border-cyan-500/40 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-slate-500 uppercase">{prod.category}</span>
                  <span className="text-xs font-bold text-cyan-400 bg-cyan-950/40 border border-cyan-500/20 px-2.5 py-0.5 rounded-md">
                    {prod.status}
                  </span>
                </div>
                <div className="flex items-start gap-4 mb-4">
                  <div className="text-4xl w-14 h-14 rounded-xl flex items-center justify-center bg-white/5 shrink-0"
                    style={{ border: "1px solid rgba(255,255,255,0.05)" }}>
                    {prod.image}
                  </div>
                  <div>
                    <div className="text-xs text-purple-400 font-bold">{prod.brand}</div>
                    <h3 className="text-base font-bold text-white leading-snug line-clamp-2">
                      {prod.name}
                    </h3>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4 bg-white/2 p-3 rounded-lg border border-white/5">
                  <div>
                    <div className="text-xs text-slate-500">Önceki Fiyat</div>
                    <div className="text-sm text-slate-400 line-through font-semibold">{prod.oldPrice}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-500">En Ucuz ({prod.bestSource})</div>
                    <div className="text-xl font-black text-white">{prod.currentPrice}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                      <span>İndirim Oranı</span>
                      <span className="text-cyan-400 font-bold">% {prod.discountPercent}</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-cyan-500 h-2 rounded-full"
                        style={{ width: `${prod.discountPercent}%` }}
                      />
                    </div>
                  </div>
                  <Link
                    href={`/urun/${prod.id}`}
                    className="btn-primary px-5 py-2.5 text-xs font-bold no-underline whitespace-nowrap"
                  >
                    Grafiği Gör
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}
