import type { Metadata } from "next";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import ChatWidget from "@/components/ChatWidget/ChatWidget";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Markalar — HepsiGaming",
  description: "Popüler donanım markalarının tüm ürünleri ve fiyatları.",
};

const BRANDS = [
  { name: "Asus", logo: "AS", category: "Donanım / Laptop", slug: "asus", count: "180 ürün" },
  { name: "MSI", logo: "MSI", category: "Donanım / Laptop", slug: "msi", count: "140 ürün" },
  { name: "Gigabyte", logo: "GB", category: "Donanım / Anakart", slug: "gigabyte", count: "95 ürün" },
  { name: "Razer", logo: "RZ", category: "Ekipman", slug: "razer", count: "120 ürün" },
  { name: "Logitech", logo: "LT", category: "Ekipman", slug: "logitech", count: "160 ürün" },
  { name: "SteelSeries", logo: "SS", category: "Ekipman", slug: "steelseries", count: "85 ürün" },
  { name: "Corsair", logo: "CS", category: "Donanım / Ekipman", slug: "corsair", count: "110 ürün" },
  { name: "HyperX", logo: "HX", category: "Ekipman", slug: "hyperx", count: "70 ürün" },
  { name: "Samsung", logo: "SSG", category: "Depolama / Monitör", slug: "samsung", count: "130 ürün" },
  { name: "Intel", logo: "INT", category: "İşlemci", slug: "intel", count: "75 ürün" },
  { name: "AMD", logo: "AMD", category: "İşlemci / GPU", slug: "amd", count: "90 ürün" },
  { name: "ViewSonic", logo: "VS", category: "Monitör", slug: "viewsonic", count: "55 ürün" }
];

export default function MarkalarPage() {
  return (
    <>
      <Header />
      <main className="min-h-[80vh] py-12 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            Popüler <span className="text-gradient-purple">Markalar</span>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Dünyanın en büyük oyun donanımı ve ekipmanı üreticilerinin modellerini karşılaştırın.
          </p>
        </div>

        {/* Markalar Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {BRANDS.map((brand) => (
            <Link
              key={brand.slug}
              href={`/markalar/${brand.slug}`}
              className="card-glass p-6 flex flex-col items-center justify-between text-center hover:scale-[1.02] active:scale-[0.98] cursor-pointer transition-all no-underline text-white group"
            >
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-white font-black text-xl mb-4 bg-white/5 group-hover:bg-purple-500/10 transition-colors"
                style={{ border: "1px solid rgba(255,255,255,0.05)" }}>
                {brand.logo}
              </div>
              <div>
                <h3 className="text-lg font-bold mb-1 group-hover:text-purple-400 transition-colors">{brand.name}</h3>
                <span className="text-xs text-slate-500 block mb-4">{brand.category}</span>
              </div>
              <div className="text-xs text-purple-400 font-semibold group-hover:text-purple-300">
                {brand.count} &rarr;
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
