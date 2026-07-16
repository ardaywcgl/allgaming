"use client";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { label: "Kategoriler", href: "/kategoriler" },
  { label: "Markalar", href: "/markalar" },
  { label: "Karşılaştır", href: "/karsilastir" },
  { label: "Fırsatlar", href: "/firsatlar" },
  { label: "İndirimler", href: "/indirimler" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-50"
      style={{
        background: "rgba(5,1,8,0.7)",
        backdropFilter: "blur(28px) saturate(1.4)",
        WebkitBackdropFilter: "blur(28px) saturate(1.4)",
        borderBottom: "1px solid var(--color-border)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0 no-underline group">
            <motion.div
              whileHover={{ rotate: -8, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-sm relative overflow-hidden"
              style={{
                background: "var(--gradient-magenta)",
                boxShadow: "0 4px 16px rgba(255,45,146,0.3), inset 0 1px 0 rgba(255,255,255,0.2)",
              }}
            >
              HG
            </motion.div>
            <span className="font-black text-lg text-white hidden sm:block">
              Hepsi<span className="text-gradient-hot">Gaming</span>
            </span>
          </Link>

          {/* Search */}
          <div className="flex-1 max-w-md hidden md:block">
            <form action="/arama" method="GET" className="relative group">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4 group-focus-within:text-cyan-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

          {/* Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-slate-400 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition-all no-underline relative group"
              >
                {link.label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-pink-500 to-cyan-400 group-hover:w-2/3 transition-all duration-300 rounded-full" />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <motion.button
              id="header-alerts-btn"
              whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
              transition={{ duration: 0.4 }}
              className="btn-icon"
              title="Fiyat Alarmlarım"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </motion.button>

            <Link href="/admin" className="btn-primary text-sm py-2 px-4 no-underline">
              Giriş Yap
            </Link>

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

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="lg:hidden overflow-hidden"
            >
              <div className="pb-4 pt-2">
                <input
                  type="text"
                  placeholder="Ara..."
                  className="input-dark h-10 text-sm mb-3"
                />
                <nav className="flex flex-col gap-1">
                  {NAV_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-sm text-slate-300 hover:text-white px-3 py-2.5 rounded-lg hover:bg-white/5 transition-all no-underline"
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
