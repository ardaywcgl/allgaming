"use client";
import { useState, useEffect } from "react";

const STEPS = [
  {
    num: "I",
    title: "Donanımını Bul",
    desc: "Aradığın ürünü veya kategoriyi arama çubuğuna yaz. Robotlarımız veri tabanında sorgulasın.",
    preview: "search"
  },
  {
    num: "II",
    title: "Fiyatları Karşılaştır",
    desc: "10+ mağaza fiyatını yan yana koyar, kargo dahil en ucuz seçeneği saniyeler içinde listeleriz.",
    preview: "compare"
  },
  {
    num: "III",
    title: "Alarm Kur & Tasarruf Et",
    desc: "İstediğin hedef fiyatı gir. Ürün o bütçeye gerilediği an sana bildirim göndeririz.",
    preview: "alert"
  }
];

export default function InteractiveProcess() {
  const [activeStep, setActiveStep] = useState(0);
  const [timerKey, setTimerKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % STEPS.length);
      setTimerKey((prev) => prev + 1);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const selectStep = (idx: number) => {
    setActiveStep(idx);
    setTimerKey((prev) => prev + 1);
  };

  return (
    <section className="py-20 px-4 max-w-7xl mx-auto reveal-4 relative overflow-hidden rounded-3xl border border-purple-500/10 bg-gradient-to-b from-purple-950/10 to-black/40">
      {/* Background radial orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute w-[400px] h-[400px] rounded-full bg-purple-600/5 filter blur-[100px] -top-20 -left-20" />
        <div className="absolute w-[400px] h-[400px] rounded-full bg-cyan-600/5 filter blur-[100px] -bottom-20 -right-20" />
      </div>

      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Side: Steps Selector */}
        <div>
          <div className="mb-8">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-bold">Süreç Nasıl Çalışır?</span>
            <h2 className="text-3xl lg:text-5xl font-black text-white mt-2 leading-tight">
              3 Adımda.<br />
              <span className="text-gradient-cyber">Maksimum Tasarruf.</span>
            </h2>
          </div>

          <div className="space-y-4">
            {STEPS.map((step, idx) => (
              <button
                key={step.num}
                onClick={() => selectStep(idx)}
                className={`w-full text-left p-6 rounded-2xl border transition-all duration-500 flex items-start gap-5 ${
                  activeStep === idx
                    ? "bg-purple-600/10 border-purple-500/30 text-white shadow-lg shadow-purple-500/5"
                    : "bg-transparent border-transparent text-slate-400 hover:text-white"
                }`}
              >
                <span className={`font-mono text-2xl font-black ${activeStep === idx ? "text-cyan-400" : "text-slate-600"}`}>
                  {step.num}
                </span>
                <div className="flex-grow">
                  <h3 className="text-lg font-bold mb-1">{step.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{step.desc}</p>
                  {activeStep === idx && (
                    <div className="w-full bg-white/5 h-0.5 mt-4 rounded-full overflow-hidden">
                      <div 
                        key={timerKey}
                        className="bg-gradient-cyber h-full animate-progress" 
                      />
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: Interactive Preview Display */}
        <div className="card-glass p-8 min-h-[350px] flex flex-col justify-center border-purple-500/20 relative overflow-hidden">
          {/* Lazer Tarama Animasyon Çizgisi */}
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0 animate-laser" />

          {activeStep === 0 && (
            <div className="space-y-4 animate-fade-in-up">
              <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                <span className="w-3 h-3 rounded-full bg-red-500/70" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <span className="w-3 h-3 rounded-full bg-green-500/70" />
                <span className="text-xs font-mono text-slate-500 ml-2">arama_motoru.sh</span>
              </div>
              <div className="font-mono text-sm text-slate-300 space-y-2">
                <div className="flex items-center gap-2 text-cyan-400">
                  <span>$</span>
                  <span className="border-r-2 border-cyan-400 pr-1 animate-pulse">hepsigaming --ara &quot;Logitech G Pro&quot;</span>
                </div>
                <div className="text-xs text-slate-500">Sorgulanıyor...</div>
                <div className="p-3 bg-purple-500/5 border border-purple-500/20 rounded-lg flex items-center gap-4 hover-trigger">
                  <span className="text-3xl animate-float-slow">🖱️</span>
                  <div>
                    <div className="text-xs text-purple-400 font-bold">Mouse</div>
                    <div className="text-sm font-bold text-white">Logitech G Pro X Superlight 2</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeStep === 1 && (
            <div className="space-y-4 animate-fade-in-up">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <span className="text-xs font-mono text-cyan-400">Fiyat Karşılaştırma API</span>
                <span className="flex items-center gap-1.5 text-xs text-green-400 font-mono">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_6px_#22c55e]" /> Aktif Fiyat Akışı
                </span>
              </div>
              <div className="space-y-2.5">
                {[
                  { store: "Trendyol", price: "5.490 ₺", isLowest: true, latency: "12ms" },
                  { store: "Amazon", price: "5.890 ₺", isLowest: false, latency: "16ms" },
                  { store: "Hepsiburada", price: "5.990 ₺", isLowest: false, latency: "21ms" }
                ].map((row) => (
                  <div
                    key={row.store}
                    className={`p-3 rounded-xl border flex items-center justify-between transition-all duration-300 ${
                      row.isLowest
                        ? "bg-green-500/5 border-green-500/30 shadow-md shadow-green-500/5"
                        : "bg-white/2 border-white/5"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-2 h-2 rounded-full ${row.isLowest ? "bg-green-400 shadow-[0_0_6px_#4ade80]" : "bg-slate-600"}`} />
                      <span className="text-sm font-semibold text-slate-200">{row.store}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-mono text-slate-500">{row.latency}</span>
                      <span className={`font-mono text-sm font-bold ${row.isLowest ? "text-green-400" : "text-slate-300"}`}>
                        {row.price}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeStep === 2 && (
            <div className="space-y-4 text-center animate-fade-in-up flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center mb-2 shadow-[0_0_20px_rgba(168,85,247,0.25)]">
                <svg className="w-8 h-8 text-purple-400 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <h4 className="text-lg font-black text-white">🔔 Fiyat Alarmı Tetiklendi!</h4>
              <p className="text-sm text-slate-400 max-w-xs leading-relaxed">
                Logitech G Pro X Superlight 2, belirlediğiniz <strong className="text-green-400 font-mono">5.500 ₺</strong> hedefine ulaştı!
              </p>
              <div className="px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/20 text-xs font-mono text-green-400">
                E-posta / Push Gönderildi: price_alert.api
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
