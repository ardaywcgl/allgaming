"use client";
import { useState } from "react";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import ChatWidget from "@/components/ChatWidget/ChatWidget";

const MOCK_PRODUCTS = {
  mice: [
    {
      id: "gpro",
      name: "Logitech G Pro X Superlight 2",
      brand: "Logitech",
      image: "🖱️",
      price: "5,890 ₺",
      specs: {
        "Ağırlık": "60g",
        "Sensör": "HERO 2",
        "DPI": "32,000",
        "Bağlantı": "Kablosuz (LIGHTSPEED)",
        "Batarya Ömrü": "95 Saat",
        "Renk Seçenekleri": "Siyah, Beyaz, Pembe"
      }
    },
    {
      id: "deathadder",
      name: "Razer DeathAdder V3 Pro",
      brand: "Razer",
      image: "🖱️",
      price: "5,490 ₺",
      specs: {
        "Ağırlık": "63g",
        "Sensör": "Focus Pro 30K",
        "DPI": "30,000",
        "Bağlantı": "Kablosuz (HyperSpeed)",
        "Batarya Ömrü": "90 Saat",
        "Renk Seçenekleri": "Siyah, Beyaz"
      }
    },
    {
      id: "viperv3",
      name: "Razer Viper V3 Pro",
      brand: "Razer",
      image: "🖱️",
      price: "6,200 ₺",
      specs: {
        "Ağırlık": "54g",
        "Sensör": "Focus Pro 35K Gen-2",
        "DPI": "35,000",
        "Bağlantı": "Kablosuz (8K Polling)",
        "Batarya Ömrü": "95 Saat",
        "Renk Seçenekleri": "Siyah, Beyaz"
      }
    }
  ],
  gpus: [
    {
      id: "rtx4070",
      name: "NVIDIA GeForce RTX 4070 Super",
      brand: "NVIDIA",
      image: "🎮",
      price: "24,500 ₺",
      specs: {
        "VRAM": "12 GB GDDR6X",
        "Güç Tüketimi": "220W",
        "Bellek Arayüzü": "192-bit",
        "Çekirdek Hızı": "1980 MHz (Boost: 2475 MHz)",
        "DLSS Desteği": "DLSS 3.0 / Frame Gen",
        "Önerilen PSU": "650W"
      }
    },
    {
      id: "rx7800xt",
      name: "AMD Radeon RX 7800 XT",
      brand: "AMD",
      image: "🎮",
      price: "20,990 ₺",
      specs: {
        "VRAM": "16 GB GDDR6",
        "Güç Tüketimi": "263W",
        "Bellek Arayüzü": "256-bit",
        "Çekirdek Hızı": "2124 MHz (Boost: 2430 MHz)",
        "DLSS Desteği": "FSR 3.0 / Fluid Motion Frames",
        "Önerilen PSU": "700W"
      }
    }
  ]
};

export default function KarsilastirPage() {
  const [category, setCategory] = useState<"mice" | "gpus">("mice");
  const [prod1Id, setProd1Id] = useState(MOCK_PRODUCTS[category][0].id);
  const [prod2Id, setProd2Id] = useState(MOCK_PRODUCTS[category][1].id);

  // Kategori değiştiğinde varsayılan ürünleri sıfırla
  const handleCategoryChange = (cat: "mice" | "gpus") => {
    setCategory(cat);
    setProd1Id(MOCK_PRODUCTS[cat][0].id);
    setProd2Id(MOCK_PRODUCTS[cat][1].id);
  };

  const prod1 = MOCK_PRODUCTS[category].find((p) => p.id === prod1Id) || MOCK_PRODUCTS[category][0];
  const prod2 = MOCK_PRODUCTS[category].find((p) => p.id === prod2Id) || MOCK_PRODUCTS[category][1];

  const specKeys = Object.keys(prod1.specs);

  return (
    <>
      <Header />
      <main className="min-h-[80vh] py-12 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            Ekipman & GPU <span className="text-gradient-purple">Karşılaştırma</span>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            İki farklı donanımı seçin, teknik özellikleri ve fiyatları yan yana karşılaştırın.
          </p>
        </div>

        {/* Karşılaştırma Seçici */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => handleCategoryChange("mice")}
            className={`px-6 py-2.5 rounded-lg font-bold transition-all ${
              category === "mice"
                ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20"
                : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
            }`}
          >
            🖱️ Oyuncu Fareleri
          </button>
          <button
            onClick={() => handleCategoryChange("gpus")}
            className={`px-6 py-2.5 rounded-lg font-bold transition-all ${
              category === "gpus"
                ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20"
                : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
            }`}
          >
            🎮 Ekran Kartları (GPU)
          </button>
        </div>

        {/* Karşılaştırma Alanı */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Ürün 1 Seçici */}
          <div className="card-glass p-6">
            <label className="block text-sm text-slate-400 mb-2">1. Ürün Seçin</label>
            <select
              value={prod1Id}
              onChange={(e) => setProd1Id(e.target.value)}
              className="w-full bg-slate-900 border border-white/10 rounded-lg h-12 px-4 text-white font-semibold focus:outline-none focus:border-purple-500 transition-colors"
            >
              {MOCK_PRODUCTS[category].map((p) => (
                <option key={p.id} value={p.id}>
                  {p.brand} - {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Ürün 2 Seçici */}
          <div className="card-glass p-6">
            <label className="block text-sm text-slate-400 mb-2">2. Ürün Seçin</label>
            <select
              value={prod2Id}
              onChange={(e) => setProd2Id(e.target.value)}
              className="w-full bg-slate-900 border border-white/10 rounded-lg h-12 px-4 text-white font-semibold focus:outline-none focus:border-purple-500 transition-colors"
            >
              {MOCK_PRODUCTS[category].map((p) => (
                <option key={p.id} value={p.id}>
                  {p.brand} - {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Karşılaştırma Tablosu */}
        <div className="card-glass overflow-hidden mb-12">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-white/5 bg-white/2">
                <th className="p-4 md:p-6 text-slate-400 font-semibold w-1/3">Özellik</th>
                <th className="p-4 md:p-6 font-bold text-white w-1/3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{prod1.image}</span>
                    <div>
                      <div className="text-xs text-purple-400">{prod1.brand}</div>
                      <div>{prod1.name}</div>
                    </div>
                  </div>
                </th>
                <th className="p-4 md:p-6 font-bold text-white w-1/3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{prod2.image}</span>
                    <div>
                      <div className="text-xs text-purple-400">{prod2.brand}</div>
                      <div>{prod2.name}</div>
                    </div>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-white/5 bg-purple-500/5">
                <td className="p-4 md:p-6 font-semibold text-slate-300">Ortalama Fiyat</td>
                <td className="p-4 md:p-6 text-lg font-black text-white">{prod1.price}</td>
                <td className="p-4 md:p-6 text-lg font-black text-white">{prod2.price}</td>
              </tr>
              {specKeys.map((key) => (
                <tr key={key} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                  <td className="p-4 md:p-6 text-slate-400">{key}</td>
                  <td className="p-4 md:p-6 text-slate-200">{(prod1.specs as any)[key]}</td>
                  <td className="p-4 md:p-6 text-slate-200">{(prod2.specs as any)[key]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}
