"use client";
import { useState } from "react";
import Link from "next/link";

const NAV_LINKS = [
  { label: "Kategoriler", href: "/kategoriler" },
  { label: "Markalar", href: "/markalar" },
  { label: "Karşılaştır", href: "/karsilastir" },
  { label: "Fırsatlar", href: "/firsatlar" },
  { label: "İndirimler", href: "/indirimler" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="sticky top-0 z-50" style={{
      background: "rgba(3,0,8,0.85)",
      backdropFilter: "blur(24px)",
      WebkitBackdropFilter: "blur(24px)",
      borderBottom: "1px solid var(--color-border)",
    }}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0 no-underline">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-black text-sm"
              style={{ background: "var(--gradient-purple)" }}>
              HG
            </div>
            <span className="font-black text-lg text-white hidden sm:block">
              Hepsi<span className="text-gradient-purple">Gaming</span>
            </span>
          </Link>

          {/* Orta: Arama */}
          <div className="flex-1 max-w-md hidden md:block">
            <form action="/arama" method="GET" className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                name="q"
                type="text"
                placeholder="Ürün, marka veya kategori ara..."
                className="input-dark pl-9 h-9 text-sm"
              />
            </form>
          </div>

          {/* Sağ: Nav + Butonlar */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-slate-400 hover:text-white px-3 py-2 rounded-md hover:bg-white/5 transition-all no-underline"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            {/* Fiyat Alarmı */}
            <button id="header-alerts-btn" className="btn-icon" title="Fiyat Alarmlarım">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>

            {/* Giriş Yap */}
            <Link href="/admin" className="btn-primary text-sm py-2 px-4 no-underline">
              Giriş Yap
            </Link>

            {/* Mobil menü */}
            <button
              id="mobile-menu-btn"
              className="btn-icon lg:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menüyü aç"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d={mobileOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobil Menü */}
        {mobileOpen && (
          <div className="lg:hidden pb-4 border-t border-white/5 mt-1">
            <div className="py-3">
              <input
                type="text"
                placeholder="Ara..."
                className="input-dark h-10 text-sm"
              />
            </div>
            <nav className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-slate-300 hover:text-white px-3 py-2.5 rounded-md hover:bg-white/5 transition-all no-underline"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
