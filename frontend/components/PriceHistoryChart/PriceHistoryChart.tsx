"use client";
import { useEffect, useRef, useState } from "react";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

interface PricePoint {
  date: string;
  price: number;
  source: string;
}

// Mock veri — backend bağlandıktan sonra API'den gelecek
const MOCK_HISTORY: PricePoint[] = [
  { date: "2026-06-01", price: 2899, source: "Trendyol" },
  { date: "2026-06-08", price: 2750, source: "Trendyol" },
  { date: "2026-06-15", price: 2650, source: "Amazon" },
  { date: "2026-06-22", price: 2799, source: "Trendyol" },
  { date: "2026-06-29", price: 2499, source: "Amazon" },
  { date: "2026-07-06", price: 2599, source: "Hepsiburada" },
  { date: "2026-07-13", price: 2449, source: "Amazon" },
];

export default function PriceHistoryChart({
  productId,
  productName,
}: {
  productId: string;
  productName: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);
  const [period, setPeriod] = useState<"30" | "90" | "180">("30");

  useEffect(() => {
    if (!canvasRef.current) return;

    // Önceki chart'ı temizle
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const labels = MOCK_HISTORY.map((p) =>
      new Date(p.date).toLocaleDateString("tr-TR", { day: "numeric", month: "short" })
    );
    const prices = MOCK_HISTORY.map((p) => p.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    chartRef.current = new Chart(canvasRef.current, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "En Düşük Fiyat (₺)",
            data: prices,
            borderColor: "#7c3aed",
            backgroundColor: "rgba(124,58,237,0.08)",
            borderWidth: 2.5,
            pointBackgroundColor: prices.map((p) =>
              p === minPrice ? "#10b981" : p === maxPrice ? "#ef4444" : "#7c3aed"
            ),
            pointRadius: 5,
            pointHoverRadius: 7,
            fill: true,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: "index", intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "rgba(13,19,33,0.95)",
            borderColor: "rgba(124,58,237,0.4)",
            borderWidth: 1,
            titleColor: "#94a3b8",
            bodyColor: "#f8fafc",
            callbacks: {
              label: (ctx) => ` ${(ctx.parsed.y ?? 0).toLocaleString("tr-TR")}₺`,
            },
          },
        },
        scales: {
          x: {
            grid: { color: "rgba(255,255,255,0.04)" },
            ticks: { color: "#475569", font: { size: 11 } },
          },
          y: {
            grid: { color: "rgba(255,255,255,0.04)" },
            ticks: {
              color: "#475569",
              font: { size: 11, family: "JetBrains Mono, monospace" },
              callback: (v) => `${Number(v).toLocaleString("tr-TR")}₺`,
            },
          },
        },
      },
    });

    return () => {
      chartRef.current?.destroy();
    };
  }, [period]);

  const minPrice = Math.min(...MOCK_HISTORY.map((p) => p.price));
  const maxPrice = Math.max(...MOCK_HISTORY.map((p) => p.price));
  const saving = maxPrice - minPrice;

  return (
    <div className="card-glass overflow-hidden">
      <div className="p-4 flex items-center justify-between" style={{ borderBottom: "1px solid var(--color-border)" }}>
        <h2 className="font-bold text-white text-sm">📈 Fiyat Geçmişi</h2>
        <div className="flex gap-1">
          {(["30", "90", "180"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`text-xs px-3 py-1 rounded-md transition-all ${
                period === p
                  ? "bg-purple-600 text-white"
                  : "text-slate-500 hover:text-white hover:bg-white/5"
              }`}
            >
              {p}G
            </button>
          ))}
        </div>
      </div>

      {/* Mini istatistikler */}
      <div className="grid grid-cols-3 divide-x" style={{ borderBottom: "1px solid var(--color-border)", borderColor: "rgba(255,255,255,0.06)" }}>
        {[
          { label: "En Düşük", value: `${minPrice.toLocaleString("tr-TR")}₺`, color: "text-green-400" },
          { label: "En Yüksek", value: `${maxPrice.toLocaleString("tr-TR")}₺`, color: "text-red-400" },
          { label: "Max Tasarruf", value: `${saving.toLocaleString("tr-TR")}₺`, color: "text-cyan-400" },
        ].map((stat) => (
          <div key={stat.label} className="p-3 text-center" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
            <div className={`font-mono font-bold text-sm ${stat.color}`}>{stat.value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="p-4 h-48">
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}
