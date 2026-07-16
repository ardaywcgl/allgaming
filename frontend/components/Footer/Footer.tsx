"use client";
import Link from "next/link";
import { motion } from "framer-motion";

const FOOTER_LINKS = {
  Platform: [
    { label: "Nasıl Çalışır?", href: "/info/hakkimizda" },
    { label: "Fiyat Takibi", href: "/info/fiyat-takibi" },
    { label: "Karşılaştırma", href: "/karsilastir" },
    { label: "İndirimler", href: "/indirimler" },
  ],
  Kategoriler: [
    { label: "Mouse", href: "/kategori/mouse" },
    { label: "Klavye", href: "/kategori/klavye" },
    { label: "Kulaklık", href: "/kategori/kulaklik" },
    { label: "Monitör", href: "/kategori/monitor" },
    { label: "GPU & CPU", href: "/kategori/ekran-karti" },
    { label: "Konsol", href: "/kategori/konsol" },
  ],
  Markalar: [
    { label: "Razer", href: "/marka/razer" },
    { label: "Logitech", href: "/marka/logitech" },
    { label: "ASUS ROG", href: "/marka/asus-rog" },
    { label: "Corsair", href: "/marka/corsair" },
    { label: "SteelSeries", href: "/marka/steelseries" },
  ],
  Destek: [
    { label: "İletişim", href: "/info/iletisim" },
    { label: "Gizlilik Politikası", href: "/info/gizlilik" },
    { label: "Kullanım Koşulları", href: "/info/kosullar" },
    { label: "Admin Paneli", href: "/admin" },
  ],
};

const FEATURED_SOCIAL = [
  { id: "footer-discord", label: "Discord", href: "#", emoji: "💬", color: "#5865F2" },
  { id: "footer-twitch",  label: "Twitch",  href: "#", emoji: "🎮", color: "#9146FF" },
];

const OTHER_SOCIAL = [
  { id: "footer-youtube",    label: "YouTube",     href: "#", emoji: "▶️" },
  { id: "footer-instagram",  label: "Instagram",   href: "#", emoji: "📸" },
  { id: "footer-x",          label: "X (Twitter)", href: "#", emoji: "𝕏" },
  { id: "footer-tiktok",     label: "TikTok",      href: "#", emoji: "♪" },
];

export default function Footer() {
  return (
    <footer
      className="relative"
      style={{
        borderTop: "1px solid var(--color-border)",
        background: "linear-gradient(180deg, transparent 0%, rgba(10,4,24,0.6) 50%, rgba(5,1,8,0.9) 100%)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04), 0 -8px 32px rgba(0,0,0,0.3)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Top: Logo + Social */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-12">
          <div className="max-w-sm">
            <div className="flex items-center gap-2 mb-3">
              <motion.div
                whileHover={{ rotate: -8, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-sm"
                style={{
                  background: "var(--gradient-magenta)",
                  boxShadow: "0 4px 16px rgba(255,45,146,0.3), inset 0 1px 0 rgba(255,255,255,0.2)",
                }}
              >
                HG
              </motion.div>
              <span className="font-black text-xl text-white">
                Hepsi<span className="text-gradient-hot">Gaming</span>
              </span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              Türkiye&apos;nin en kapsamlı oyun donanımı fiyat karşılaştırma platformu.
              10+ siteden anlık fiyat güncellemesi.
            </p>
          </div>

          {/* Social */}
          <div className="flex flex-col gap-3">
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Bizi Takip Edin</p>
            <div className="flex items-center flex-wrap gap-3">
              {FEATURED_SOCIAL.map((social) => (
                <motion.a
                  key={social.id}
                  id={social.id}
                  href={social.href}
                  aria-label={social.label}
                  whileHover={{ scale: 1.08, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all no-underline"
                  style={{
                    background: `${social.color}18`,
                    color: social.color,
                    border: `1px solid ${social.color}38`,
                  }}
                >
                  <span>{social.emoji}</span>
                  <span>{social.label}</span>
                </motion.a>
              ))}

              {OTHER_SOCIAL.map((social) => (
                <motion.a
                  key={social.id}
                  id={social.id}
                  href={social.href}
                  aria-label={social.label}
                  title={social.label}
                  whileHover={{ scale: 1.15, rotate: -5 }}
                  whileTap={{ scale: 0.92 }}
                  className="btn-icon no-underline"
                >
                  <span className="text-base">{social.emoji}</span>
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        <div className="neon-divider" />

        {/* Link columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10">
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">{section}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-500 hover:text-cyan-400 transition-colors no-underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="neon-divider" />

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6 text-sm text-slate-600">
          <p>© 2026 HepsiGaming. Tüm hakları saklıdır.</p>
          <p className="text-xs text-center">
            Bu sitedeki fiyatlar otomatik olarak güncellenmektedir. Satın almadan önce ilgili sitenin güncel fiyatını kontrol edin.
          </p>
        </div>
      </div>
    </footer>
  );
}
