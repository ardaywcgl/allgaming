"use client";
import Link from "next/link";

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

// Sosyal medya linkleri — emoji ikon kullanıyoruz (JSX sorununu önlemek için)
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
    <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "var(--color-bg-secondary)" }}>
      <div className="max-w-7xl mx-auto px-4 py-12">

        {/* Üst: Logo + Sosyal Medya */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-12">
          <div className="max-w-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-black text-sm"
                style={{ background: "var(--gradient-purple)" }}>
                HG
              </div>
              <span className="font-black text-xl text-white">
                Hepsi<span className="text-gradient-purple">Gaming</span>
              </span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              Türkiye&apos;nin en kapsamlı oyun donanımı fiyat karşılaştırma platformu.
              10+ siteden anlık fiyat güncellemesi.
            </p>
          </div>

          {/* Sosyal Medya */}
          <div className="flex flex-col gap-3">
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Bizi Takip Edin</p>
            <div className="flex items-center flex-wrap gap-3">
              {/* Discord & Twitch — özel vurgulu butonlar */}
              {FEATURED_SOCIAL.map((social) => (
                <a
                  key={social.id}
                  id={social.id}
                  href={social.href}
                  aria-label={social.label}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:scale-105 no-underline"
                  style={{
                    background: `${social.color}22`,
                    color: social.color,
                    border: `1px solid ${social.color}44`,
                  }}
                >
                  <span>{social.emoji}</span>
                  <span>{social.label}</span>
                </a>
              ))}

              {/* Diğer sosyal linkler */}
              {OTHER_SOCIAL.map((social) => (
                <a
                  key={social.id}
                  id={social.id}
                  href={social.href}
                  aria-label={social.label}
                  title={social.label}
                  className="btn-icon hover:scale-110 transition-transform no-underline"
                >
                  <span className="text-base">{social.emoji}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Neon Çizgi */}
        <div className="neon-divider" />

        {/* Link Sütunları */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10">
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">{section}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-500 hover:text-slate-200 transition-colors no-underline"
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

        {/* Alt Bar */}
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
