"use client";
import { useState } from "react";

type QualityLevel = "Ultra" | "Yüksek" | "Orta" | "Düşük" | "Çalışmaz";

interface GameRequirements {
  min: { cpu: string; gpu: string; ram_gb: number; storage_gb?: number };
  recommended: { cpu: string; gpu: string; ram_gb: number };
  ultra: { cpu?: string; gpu?: string; ram_gb?: number };
}

// CPU güç skorları (yaklaşık karşılaştırma için)
const CPU_SCORES: Record<string, number> = {
  "ryzen 9 7900x": 100, "ryzen 9 5900x": 90, "ryzen 7 7700x": 85,
  "core i9-13900k": 100, "core i7-13700k": 88, "core i5-13600k": 75,
  "ryzen 7 5800x": 80, "ryzen 5 5600x": 65, "core i7-12700k": 82,
  "core i5-12600k": 68, "ryzen 5 7600x": 70,
};

const GPU_SCORES: Record<string, number> = {
  "rtx 4090": 100, "rtx 4080": 90, "rtx 4070 ti": 80, "rtx 4070": 72,
  "rtx 3080": 75, "rtx 3070": 65, "rtx 3060 ti": 58, "rtx 3060": 50,
  "rx 7900 xtx": 95, "rx 7900 xt": 85, "rx 7800 xt": 68, "rx 7700 xt": 60,
  "rx 6800 xt": 70, "rx 6700 xt": 58, "rtx 2080": 62, "rtx 2070": 54,
};

function getScore(name: string, scores: Record<string, number>): number {
  const key = name.toLowerCase();
  for (const [k, v] of Object.entries(scores)) {
    if (key.includes(k)) return v;
  }
  return 30; // Bilinmeyen donanım
}

function calcQuality(
  userCpuScore: number, userGpuScore: number, userRam: number,
  req: GameRequirements
): QualityLevel {
  const minCpu = getScore(req.min.cpu || "", CPU_SCORES);
  const minGpu = getScore(req.min.gpu || "", GPU_SCORES);
  const recCpu = getScore(req.recommended.cpu || "", CPU_SCORES);
  const recGpu = getScore(req.recommended.gpu || "", GPU_SCORES);
  const ultraCpu = req.ultra.cpu ? getScore(req.ultra.cpu, CPU_SCORES) : recCpu + 15;
  const ultraGpu = req.ultra.gpu ? getScore(req.ultra.gpu, GPU_SCORES) : recGpu + 15;

  if (userCpuScore < minCpu || userGpuScore < minGpu || userRam < (req.min.ram_gb || 8)) {
    return "Çalışmaz";
  }
  if (userCpuScore >= ultraCpu && userGpuScore >= ultraGpu && userRam >= (req.ultra.ram_gb || 16)) {
    return "Ultra";
  }
  if (userCpuScore >= recCpu && userGpuScore >= recGpu && userRam >= req.recommended.ram_gb) {
    return "Yüksek";
  }
  if (userCpuScore >= minCpu * 1.2 && userGpuScore >= minGpu * 1.2) {
    return "Orta";
  }
  return "Düşük";
}

const QUALITY_CONFIG: Record<QualityLevel, { color: string; icon: string; desc: string }> = {
  "Ultra":    { color: "#7c3aed", icon: "🚀", desc: "Maksimum grafik kalitesinde oynatabilirsin" },
  "Yüksek":   { color: "#10b981", icon: "✅", desc: "Yüksek ayarlarda sorunsuz oynatabilirsin" },
  "Orta":     { color: "#f59e0b", icon: "⚡", desc: "Orta ayarlarda iyi bir deneyim yaşarsın" },
  "Düşük":    { color: "#f97316", icon: "⚠️", desc: "Düşük ayarlarda oynatabilirsin" },
  "Çalışmaz": { color: "#ef4444", icon: "❌", desc: "Sistem gereksinimleri karşılanmıyor" },
};

const CPU_OPTIONS = ["Core i9-13900K", "Core i7-13700K", "Core i5-13600K", "Core i5-12600K", "Ryzen 9 7900X", "Ryzen 7 7700X", "Ryzen 7 5800X", "Ryzen 5 7600X", "Ryzen 5 5600X", "Diğer"];
const GPU_OPTIONS = ["RTX 4090", "RTX 4080", "RTX 4070 Ti", "RTX 4070", "RTX 3080", "RTX 3070", "RTX 3060 Ti", "RTX 3060", "RTX 2080", "RX 7900 XTX", "RX 7900 XT", "RX 7800 XT", "RX 7700 XT", "RX 6800 XT", "Diğer"];
const RAM_OPTIONS = [4, 8, 16, 32, 64];

export default function SystemChecker({ requirements }: { requirements: GameRequirements }) {
  const [cpu, setCpu] = useState("");
  const [gpu, setGpu] = useState("");
  const [ram, setRam] = useState(16);
  const [result, setResult] = useState<QualityLevel | null>(null);

  function check() {
    if (!cpu || !gpu) return;
    const cpuScore = getScore(cpu, CPU_SCORES);
    const gpuScore = getScore(gpu, GPU_SCORES);
    setResult(calcQuality(cpuScore, gpuScore, ram, requirements));
  }

  return (
    <div className="card-glass overflow-hidden">
      <div className="p-4" style={{ borderBottom: "1px solid var(--color-border)" }}>
        <h2 className="font-bold text-white text-sm">🖥️ Sistem Gereksinimi Testi</h2>
        <p className="text-xs text-slate-500 mt-1">Bu oyunu bilgisayarında hangi ayarda çalıştırabilirsin?</p>
      </div>

      {/* Gereksinimler tablosu */}
      <div className="grid grid-cols-3 divide-x text-xs" style={{ borderBottom: "1px solid var(--color-border)", borderColor: "rgba(255,255,255,0.06)" }}>
        {[
          { label: "Minimum", data: requirements.min, color: "#ef4444" },
          { label: "Önerilen", data: requirements.recommended, color: "#10b981" },
          { label: "Ultra", data: requirements.ultra, color: "#7c3aed" },
        ].map(({ label, data, color }) => (
          <div key={label} className="p-3" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
            <div className="font-semibold mb-2" style={{ color }}>{label}</div>
            <div className="space-y-1 text-slate-400">
              {data.cpu && <div><span className="text-slate-600">CPU:</span> {data.cpu}</div>}
              {data.gpu && <div><span className="text-slate-600">GPU:</span> {data.gpu}</div>}
              {data.ram_gb && <div><span className="text-slate-600">RAM:</span> {data.ram_gb}GB</div>}
            </div>
          </div>
        ))}
      </div>

      {/* Donanım Seçici */}
      <div className="p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs text-slate-500 mb-1 block">İşlemcin</label>
            <select
              id="sys-check-cpu"
              value={cpu}
              onChange={(e) => { setCpu(e.target.value); setResult(null); }}
              className="input-dark text-sm h-10"
            >
              <option value="">Seç...</option>
              {CPU_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Ekran Kartın</label>
            <select
              id="sys-check-gpu"
              value={gpu}
              onChange={(e) => { setGpu(e.target.value); setResult(null); }}
              className="input-dark text-sm h-10"
            >
              <option value="">Seç...</option>
              {GPU_OPTIONS.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">RAM (GB)</label>
            <select
              id="sys-check-ram"
              value={ram}
              onChange={(e) => { setRam(Number(e.target.value)); setResult(null); }}
              className="input-dark text-sm h-10"
            >
              {RAM_OPTIONS.map((r) => <option key={r} value={r}>{r} GB</option>)}
            </select>
          </div>
        </div>

        <button
          id="sys-check-btn"
          onClick={check}
          disabled={!cpu || !gpu}
          className="btn-primary w-full text-sm disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Sistemimi Test Et
        </button>

        {/* Sonuç */}
        {result && (
          <div
            className="p-4 rounded-xl text-center animate-fade-in-up"
            style={{
              background: `${QUALITY_CONFIG[result].color}15`,
              border: `1px solid ${QUALITY_CONFIG[result].color}44`,
            }}
          >
            <div className="text-3xl mb-2">{QUALITY_CONFIG[result].icon}</div>
            <div className="text-lg font-black" style={{ color: QUALITY_CONFIG[result].color }}>
              {result} Ayar
            </div>
            <div className="text-sm text-slate-400 mt-1">{QUALITY_CONFIG[result].desc}</div>
          </div>
        )}
      </div>
    </div>
  );
}
