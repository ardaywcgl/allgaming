"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Tab = "dashboard" | "products" | "reviews" | "banners" | "users" | "settings" | "scrapers";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [user, setUser] = useState<{ email: string; role: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("hg_token");
    if (!token) { router.push("/admin/login"); return; }
    // Token decode (basit JWT parse)
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUser({ email: payload.sub, role: payload.role });
    } catch { router.push("/admin/login"); }
  }, [router]);

  const NAV: { id: Tab; label: string; icon: string; minRole?: string }[] = [
    { id: "dashboard",  label: "Dashboard",      icon: "📊" },
    { id: "products",   label: "Ürünler",         icon: "📦", minRole: "editor" },
    { id: "reviews",    label: "Yorum Onay",      icon: "💬", minRole: "editor" },
    { id: "banners",    label: "Bannerlar",       icon: "🖼️", minRole: "grafiker" },
    { id: "users",      label: "Kullanıcılar",    icon: "👥", minRole: "admin" },
    { id: "settings",   label: "Ayarlar",         icon: "⚙️", minRole: "admin" },
    { id: "scrapers",   label: "Scraper Durumu",  icon: "🤖", minRole: "admin" },
  ];

  return (
    <div className="flex min-h-screen" style={{ background: "var(--color-bg-primary)" }}>
      {/* Sidebar */}
      <aside className="w-60 shrink-0 flex flex-col" style={{ background: "var(--color-bg-secondary)", borderRight: "1px solid var(--color-border)" }}>
        <div className="p-5 border-b" style={{ borderColor: "var(--color-border)" }}>
          <div className="font-black text-white">Hepsi<span className="text-gradient-purple">Gaming</span></div>
          <div className="text-xs text-slate-500 mt-1">Admin Paneli</div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {NAV.map((item) => (
            <button
              key={item.id}
              id={`admin-nav-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left ${
                activeTab === item.id
                  ? "bg-purple-600/20 text-purple-300 border border-purple-600/30"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
              {item.minRole === "admin" && <span className="ml-auto text-xs text-slate-600">Admin</span>}
            </button>
          ))}
        </nav>

        {/* Kullanıcı bilgisi */}
        {user && (
          <div className="p-4 border-t" style={{ borderColor: "var(--color-border)" }}>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                style={{ background: "var(--gradient-purple)" }}>
                {user.email.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-medium text-slate-300 truncate">{user.email}</div>
                <div className="text-xs text-slate-500 capitalize">{user.role}</div>
              </div>
            </div>
            <button
              onClick={() => { localStorage.removeItem("hg_token"); router.push("/admin/login"); }}
              className="mt-3 text-xs text-slate-500 hover:text-red-400 transition-colors w-full text-left"
            >
              Çıkış Yap
            </button>
          </div>
        )}
      </aside>

      {/* İçerik */}
      <main className="flex-1 overflow-auto p-8">
        <AdminContent tab={activeTab} />
      </main>
    </div>
  );
}


function AdminContent({ tab }: { tab: Tab }) {
  switch (tab) {
    case "dashboard": return <DashboardTab />;
    case "products":  return <ProductsTab />;
    case "reviews":   return <ReviewsTab />;
    case "banners":   return <BannersTab />;
    case "users":     return <UsersTab />;
    case "settings":  return <SettingsTab />;
    case "scrapers":  return <ScrapersTab />;
    default:          return <DashboardTab />;
  }
}


// ── Dashboard ──────────────────────────────────────────────────
function DashboardTab() {
  const stats = [
    { label: "Toplam Ürün",     value: "—", icon: "📦", color: "#7c3aed" },
    { label: "Onay Bekleyen",   value: "—", icon: "💬", color: "#f59e0b" },
    { label: "Eksik Görsel",    value: "—", icon: "⚠️", color: "#ef4444" },
    { label: "Aktif Alarm",     value: "—", icon: "🔔", color: "#10b981" },
  ];
  return (
    <div>
      <h1 className="text-2xl font-black text-white mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="card-glass p-5">
            <div className="text-3xl mb-2">{s.icon}</div>
            <div className="text-2xl font-black" style={{ color: s.color }}>{s.value}</div>
            <div className="text-sm text-slate-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="card-glass p-6">
        <h2 className="font-bold text-white mb-4">Hızlı Başlangıç</h2>
        <div className="space-y-2 text-sm text-slate-400">
          <p>1. <strong className="text-slate-200">Ürünler</strong> sekmesinden CSV ile toplu yükleme yapın</p>
          <p>2. <strong className="text-slate-200">Ayarlar</strong> sekmesinden sosyal medya linklerinizi ekleyin</p>
          <p>3. <strong className="text-slate-200">Yorum Onay</strong> sekmesinden bekleyen yorumları inceleyin</p>
          <p>4. <strong className="text-slate-200">Scraper Durumu</strong> sekmesinden fiyat botlarının durumunu takip edin</p>
        </div>
      </div>
    </div>
  );
}


// ── Ürün Yönetimi ──────────────────────────────────────────────
function ProductsTab() {
  const [showIncomplete, setShowIncomplete] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<string | null>(null);

  async function handleCsvUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const form = new FormData();
    form.append("file", file);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/products/csv`, {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("hg_token")}` },
        body: form,
      });
      const data = await res.json();
      setUploadResult(data.message);
    } catch { setUploadResult("Hata oluştu"); }
    setUploading(false);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-white">Ürün Yönetimi</h1>
        <div className="flex gap-3">
          {showIncomplete && (
            <span className="badge-hot text-sm px-3 py-1">⚠️ Eksik Görsel Filtresi Aktif</span>
          )}
          <button
            id="admin-filter-incomplete"
            onClick={() => setShowIncomplete(!showIncomplete)}
            className={showIncomplete ? "btn-primary text-sm" : "btn-secondary text-sm"}
          >
            {showIncomplete ? "Tümünü Göster" : "Eksik Görseller"}
          </button>
        </div>
      </div>

      {/* CSV Yükleme */}
      <div className="card-glass p-6 mb-6">
        <h2 className="font-bold text-white mb-3">📋 Toplu Ürün Yükleme (CSV/Excel)</h2>
        <p className="text-sm text-slate-400 mb-4">
          Beklenen sütunlar: <code className="text-purple-400">name, brand, category, description, image_url</code>
        </p>
        <div className="flex items-center gap-4">
          <label id="admin-csv-upload-label" className="btn-primary text-sm cursor-pointer">
            {uploading ? "Yükleniyor..." : "📁 Dosya Seç"}
            <input type="file" accept=".csv,.xlsx,.xls" onChange={handleCsvUpload} className="hidden" disabled={uploading} />
          </label>
          {uploadResult && (
            <span className="text-sm text-green-400">✓ {uploadResult}</span>
          )}
        </div>
      </div>

      <div className="card-glass p-6 text-center text-slate-500 text-sm">
        Ürün tablosu — API bağlandıktan sonra burada listelenecek
      </div>
    </div>
  );
}


// ── Yorum Onay ─────────────────────────────────────────────────
function ReviewsTab() {
  return (
    <div>
      <h1 className="text-2xl font-black text-white mb-6">Yorum Onay</h1>
      <div className="card-glass p-6 text-center text-slate-500 text-sm">
        Onay bekleyen yorumlar — Backend bağlandıktan sonra burada görünecek
      </div>
    </div>
  );
}

function BannersTab() {
  return (
    <div>
      <h1 className="text-2xl font-black text-white mb-6">Banner Yönetimi</h1>
      <div className="card-glass p-6 text-center text-slate-500 text-sm">
        Banner listesi ve tık analitikleri
      </div>
    </div>
  );
}

function UsersTab() {
  return (
    <div>
      <h1 className="text-2xl font-black text-white mb-6">Kullanıcı & Rol Yönetimi</h1>
      <div className="card-glass p-6 text-center text-slate-500 text-sm">
        Kullanıcı listesi ve rol ataması
      </div>
    </div>
  );
}


// ── Ayarlar (Sosyal Medya + Logo) ──────────────────────────────
function SettingsTab() {
  const [settings, setSettings] = useState({
    social_instagram: "", social_youtube: "", social_discord: "",
    social_twitch: "", social_tiktok: "", social_x: "",
    logo_dark: "", logo_light: "",
    affiliate_amazon_tag: "", affiliate_trendyol_id: "",
  });
  const [saved, setSaved] = useState(false);

  async function save() {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/settings`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("hg_token")}`,
        },
        body: JSON.stringify(settings),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch { /* offline */ }
  }

  const SOCIAL_FIELDS = [
    { key: "social_instagram", label: "Instagram", placeholder: "@hepsigaming" },
    { key: "social_youtube",   label: "YouTube",   placeholder: "@hepsigaming" },
    { key: "social_discord",   label: "Discord",   placeholder: "discord.gg/hepsigaming" },
    { key: "social_twitch",    label: "Twitch",    placeholder: "twitch.tv/hepsigaming" },
    { key: "social_tiktok",    label: "TikTok",    placeholder: "@hepsigaming" },
    { key: "social_x",         label: "X (Twitter)", placeholder: "@hepsigaming" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-white">Genel Ayarlar</h1>

      {/* Sosyal Medya */}
      <div className="card-glass p-6">
        <h2 className="font-bold text-white mb-4">📱 Sosyal Medya Linkleri</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {SOCIAL_FIELDS.map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="text-sm text-slate-400 mb-1 block">{label}</label>
              <input
                id={`settings-${key}`}
                type="text"
                className="input-dark text-sm h-10"
                placeholder={placeholder}
                value={settings[key as keyof typeof settings]}
                onChange={(e) => setSettings({ ...settings, [key]: e.target.value })}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Logo */}
      <div className="card-glass p-6">
        <h2 className="font-bold text-white mb-4">🖼️ Logo (SVG URL)</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-slate-400 mb-1 block">Koyu Tema Logo</label>
            <input id="settings-logo-dark" type="text" className="input-dark text-sm h-10" placeholder="/logos/logo-dark.svg"
              value={settings.logo_dark} onChange={(e) => setSettings({ ...settings, logo_dark: e.target.value })} />
          </div>
          <div>
            <label className="text-sm text-slate-400 mb-1 block">Açık Tema Logo</label>
            <input id="settings-logo-light" type="text" className="input-dark text-sm h-10" placeholder="/logos/logo-light.svg"
              value={settings.logo_light} onChange={(e) => setSettings({ ...settings, logo_light: e.target.value })} />
          </div>
        </div>
      </div>

      {/* Affiliate */}
      <div className="card-glass p-6">
        <h2 className="font-bold text-white mb-4">💰 Affiliate Kodları</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-slate-400 mb-1 block">Amazon Affiliate Tag</label>
            <input id="settings-amazon-tag" type="text" className="input-dark text-sm h-10" placeholder="hepsigaming-21"
              value={settings.affiliate_amazon_tag} onChange={(e) => setSettings({ ...settings, affiliate_amazon_tag: e.target.value })} />
          </div>
          <div>
            <label className="text-sm text-slate-400 mb-1 block">Trendyol Partner ID</label>
            <input id="settings-trendyol-id" type="text" className="input-dark text-sm h-10" placeholder="12345"
              value={settings.affiliate_trendyol_id} onChange={(e) => setSettings({ ...settings, affiliate_trendyol_id: e.target.value })} />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button id="admin-settings-save" onClick={save} className="btn-primary">Kaydet</button>
        {saved && <span className="text-green-400 text-sm">✓ Kaydedildi</span>}
      </div>
    </div>
  );
}

function ScrapersTab() {
  return (
    <div>
      <h1 className="text-2xl font-black text-white mb-6">🤖 Scraper Durumu</h1>
      <div className="card-glass p-6 text-center text-slate-500 text-sm">
        Celery worker durumu — Backend bağlandıktan sonra aktif görevler burada görünecek
      </div>
    </div>
  );
}
