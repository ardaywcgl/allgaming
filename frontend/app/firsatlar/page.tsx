import type { Metadata } from "next";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import ChatWidget from "@/components/ChatWidget/ChatWidget";

export const metadata: Metadata = {
  title: "Fırsatlar — HepsiGaming",
  description: "En sıcak oyun ve donanım fırsatları, indirim kuponları ve kampanyalar.",
};

const DEALS = [
  {
    id: 1,
    title: "Epic Games Haftanın Ücretsiz Oyunu: Dying Light Enhanced Edition",
    platform: "Epic Games",
    badge: "ÜCRETSİZ",
    discount: "100%",
    originalPrice: "599 ₺",
    dealPrice: "0 ₺",
    type: "Oyun",
    link: "#",
    expiry: "23 Temmuz 2026'ya kadar"
  },
  {
    id: 2,
    title: "Steam Yaz İndirimleri: Cyberpunk 2077 Ultimate Edition",
    platform: "Steam",
    badge: "KAMPANYA",
    discount: "50%",
    originalPrice: "1,200 ₺",
    dealPrice: "600 ₺",
    type: "Oyun",
    link: "#",
    expiry: "20 Temmuz 2026'ya kadar"
  },
  {
    id: 3,
    title: "Razer DeathAdder V3 Pro Kablosuz Gaming Mouse - Prime Özel",
    platform: "Amazon TR",
    badge: "FIRSAT",
    discount: "15%",
    originalPrice: "5,490 ₺",
    dealPrice: "4,660 ₺",
    type: "Donanım",
    link: "#",
    expiry: "Stoklarla Sınırlı"
  },
  {
    id: 4,
    title: "Asus ROG Swift PG27AQDM OLED 240Hz Gaming Monitör",
    platform: "Hepsiburada",
    badge: "İNDİRİM",
    discount: "12%",
    originalPrice: "34,999 ₺",
    dealPrice: "30,799 ₺",
    type: "Monitör",
    link: "#",
    expiry: "Stoklarla Sınırlı"
  },
  {
    id: 5,
    title: "PlayStation 5 Slim 1TB Digital Edition Konsol",
    platform: "Trendyol",
    badge: "KAMPANYA",
    discount: "8%",
    originalPrice: "21,000 ₺",
    dealPrice: "19,320 ₺",
    type: "Konsol",
    link: "#",
    expiry: "Bugüne Özel"
  },
  {
    id: 6,
    title: "SteelSeries Arctis Nova 7 Kablosuz Oyuncu Kulaklığı",
    platform: "Amazon TR",
    badge: "FIRSAT",
    discount: "20%",
    originalPrice: "6,990 ₺",
    dealPrice: "5,590 ₺",
    type: "Ekipman",
    link: "#",
    expiry: "Sınırlı Süre"
  }
];

export default function FirsatlarPage() {
  return (
    <>
      <Header />
      <main className="min-h-[80vh] py-12 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border mb-4 bg-purple-500/10 border-purple-500/30 text-purple-300 text-xs font-semibold uppercase tracking-wider">
            🔥 Sıcak Fırsatlar
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            Günün En İyi <span className="text-gradient-purple">Fırsatları</span>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Editörlerimizin ve topluluğumuzun seçtiği en popüler oyun, donanım ve ekipman kampanyaları.
          </p>
        </div>

        {/* Fırsatlar Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DEALS.map((deal) => (
            <div
              key={deal.id}
              className="card-glass p-6 flex flex-col justify-between hover:border-purple-500/40 hover:-translate-y-1 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-slate-500 uppercase">{deal.platform}</span>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-black ${
                    deal.badge === "ÜCRETSİZ" 
                      ? "bg-green-500/20 text-green-400 border border-green-500/30"
                      : "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                  }`}>
                    {deal.badge}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2 leading-snug line-clamp-2">
                  {deal.title}
                </h3>
                <div className="text-xs text-slate-500 mb-4">{deal.expiry}</div>
              </div>

              <div>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-sm text-slate-500 line-through">{deal.originalPrice}</span>
                  <span className="text-2xl font-black text-white">{deal.dealPrice}</span>
                  <span className="text-xs font-bold text-green-400">-%{deal.discount}</span>
                </div>
                <a
                  href={deal.link}
                  className="w-full btn-primary h-10 text-sm flex items-center justify-center font-bold no-underline"
                >
                  Fırsatı Gör &rarr;
                </a>
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
