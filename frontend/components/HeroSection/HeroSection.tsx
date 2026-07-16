"use client";
import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import AnimatedCounter from "@/components/Animated/AnimatedCounter";
import TiltCard from "@/components/Animated/TiltCard";

const STATS = [
  { value: 50000, suffix: "+", label: "Donanım Ürünü", color: "#a855f7", delay: 0 },
  { value: 10, suffix: "+", label: "Entegre Mağaza", color: "#2dd4ff", delay: 0.8 },
  { value: 3, suffix: "x", label: "Günlük Güncelleme", color: "#ff2d92", delay: 1.6 },
  { value: 0, suffix: "₺", label: "Sonsuza Kadar Ücretsiz", color: "#34d399", delay: 2.4 },
];

const MARQUEE_ITEMS = [
  { text: "Razer DeathAdder V3 Pro — Trendyol'da %15 İndirim!", color: "#2dd4ff" },
  { text: "RTX 4070 Ti — En Uygun Fiyat Amazon'da: 24.500₺", color: "#a855f7" },
  { text: "SteelSeries Arctis Nova Pro — Hepsiburada'da %20 İndirim", color: "#ff2d92" },
  { text: "Ryzen 7 7800X3D — Fiyat alarmı 14.500₺ hedefine ulaştı!", color: "#34d399" },
];

export default function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  const orb1X = useTransform(smoothX, [0, 1], [-30, 30]);
  const orb1Y = useTransform(smoothY, [0, 1], [-20, 20]);
  const orb2X = useTransform(smoothX, [0, 1], [40, -40]);
  const orb2Y = useTransform(smoothY, [0, 1], [25, -25]);
  const gridX = useTransform(smoothX, [0, 1], [-10, 10]);
  const gridY = useTransform(smoothY, [0, 1], [-10, 10]);

  function handleMouse(e: React.MouseEvent<HTMLDivElement>) {
    const rect = heroRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  }

  return (
    <section
      ref={heroRef}
      onMouseMove={handleMouse}
      className="relative min-h-[98vh] flex flex-col items-center justify-center overflow-hidden px-4"
      style={{ background: "radial-gradient(ellipse at top, #120a2a 0%, #050108 100%)" }}
    >
      {/* Parallax grid */}
      <motion.div
        style={{ x: gridX, y: gridY }}
        className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.04]"
      >
        <div className="absolute inset-0" style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />
      </motion.div>

      {/* Parallax orbs */}
      <motion.div
        style={{ x: orb1X, y: orb1Y }}
        className="absolute pointer-events-none"
      >
        <div
          className="rounded-full filter blur-[120px] orb-drift-1"
          style={{
            width: "480px",
            height: "480px",
            background: "radial-gradient(circle, rgba(168,85,247,0.2) 0%, transparent 70%)",
          }}
        />
      </motion.div>
      <motion.div
        style={{ x: orb2X, y: orb2Y }}
        className="absolute pointer-events-none"
      >
        <div
          className="rounded-full filter blur-[140px] orb-drift-2"
          style={{
            width: "580px",
            height: "580px",
            background: "radial-gradient(circle, rgba(45,212,255,0.14) 0%, transparent 70%)",
          }}
        />
      </motion.div>

      <div className="relative z-10 text-center max-w-5xl mx-auto flex flex-col items-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-8 animate-float-organic"
          style={{
            background: "rgba(255,45,146,0.08)",
            borderColor: "rgba(255,45,146,0.2)",
            boxShadow: "0 0 20px rgba(255,45,146,0.08)",
          }}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" style={{ boxShadow: "0 0 8px #4ade80" }} />
          <span className="text-xs text-pink-300 font-bold uppercase tracking-wider">
            CANLI FİYAT TAKİBİ — 10+ Siteden Anlık Akış
          </span>
        </motion.div>

        {/* Title with organic pour-in */}
        <h1 className="text-5xl md:text-8xl font-black mb-8 leading-[1.1] tracking-tight text-white select-none">
          <motion.span
            initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="inline-block"
          >
            En Ucuz{" "}
          </motion.span>
          <span className="text-gradient-cyber">
            {"Oyun Donanımı".split("").map((char, i) => (
              <span
                key={i}
                className="animate-char-pour"
                style={{ animationDelay: `${400 + i * 40}ms` }}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </span>
          <br />
          <motion.span
            initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: 1, ease: [0.22, 1, 0.36, 1] }}
            className="inline-block"
          >
            Tek Yerde.
          </motion.span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed"
        >
          Amazon, Trendyol, Hepsiburada ve daha fazlasını karşılaştır.
          Fiyat düşünce cebine bildirim gelsin.
        </motion.p>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-xl"
        >
          <HeroSearch />
        </motion.div>

        {/* Stats — floating nodes */}
        <div className="flex flex-wrap justify-center gap-4 mt-14 mb-8">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.6 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <TiltCard intensity={15}>
                <motion.div
                  animate={{
                    y: [0, -8, -3, 0],
                    transition: {
                      duration: 5 + i * 0.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: stat.delay,
                    },
                  }}
                  className="card-glass px-6 py-4 text-center relative overflow-hidden"
                  style={{ minWidth: "140px" }}
                >
                  {/* Line-art motif */}
                  <svg className="absolute top-2 right-2 w-8 h-8 opacity-10" viewBox="0 0 32 32" fill="none" stroke={stat.color} strokeWidth="1.5">
                    <path d="M4 28 L12 16 L20 22 L28 8" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="28" cy="8" r="2" fill={stat.color} />
                  </svg>
                  <div className="text-3xl font-black font-mono" style={{ color: stat.color }}>
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} duration={2.5} />
                  </div>
                  <div className="text-xs text-slate-500 mt-1 uppercase font-bold tracking-wider">{stat.label}</div>
                </motion.div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Marquee */}
      <div className="w-full mt-auto py-6 border-t border-white/5 bg-black/40 backdrop-blur-sm overflow-hidden select-none">
        <div className="marquee-container">
          <div className="marquee-track">
            {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
              <span key={i} className="flex items-center gap-2 text-xs text-slate-400 font-mono shrink-0 whitespace-nowrap">
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: item.color }} />
                {item.text}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroSearch() {
  return (
    <form action="/arama" method="GET" className="flex flex-col sm:flex-row gap-3 mx-auto w-full">
      <div className="relative flex-1 group">
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 group-focus-within:text-cyan-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          name="q"
          type="text"
          placeholder="Ürün, marka veya kategori ara..."
          className="input-dark pl-12 h-14 text-base animate-pulse-soft"
          style={{ borderRadius: "var(--radius-pill)" }}
        />
      </div>
      <motion.button
        type="submit"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.96 }}
        className="btn-primary h-14 px-8 text-base whitespace-nowrap"
      >
        Ara & Karşılaştır
      </motion.button>
    </form>
  );
}
