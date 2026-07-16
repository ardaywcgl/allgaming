import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://hepsigaming.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "HepsiGaming — Türkiye'nin Oyun Donanımı Fiyat Karşılaştırma Platformu",
    template: "%s | HepsiGaming",
  },
  description:
    "Mouse, klavye, kulaklık, GPU, konsol ve daha fazlasını 10+ siteden karşılaştır. En ucuz oyun donanımı fiyatları HepsiGaming'de.",
  keywords: [
    "oyun donanımı", "gaming mouse", "gaming klavye", "en ucuz fiyat",
    "fiyat karşılaştırma", "Trendyol", "Amazon", "Hepsiburada", "gaming",
  ],
  authors: [{ name: "HepsiGaming" }],
  creator: "HepsiGaming",
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: siteUrl,
    siteName: "HepsiGaming",
    title: "HepsiGaming — Oyun Donanımı Fiyat Karşılaştırma",
    description: "10+ siteden en ucuz oyun donanımı fiyatlarını karşılaştır.",
    images: [{ url: "/og-default.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "HepsiGaming",
    description: "Türkiye'nin oyun donanımı fiyat karşılaştırma platformu.",
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/favicon.svg",
    apple: "/icons/apple-touch-icon.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export const viewport: Viewport = {
  themeColor: "#7c3aed",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        {/* Google Fonts preload */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="font-sans antialiased">
        {/* Arka plan grid efekti */}
        <div className="fixed inset-0 -z-10" aria-hidden="true">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(ellipse 80% 60% at 50% -20%, rgba(124,58,237,0.15) 0%, transparent 70%)",
            }}
          />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
              backgroundSize: "50px 50px",
            }}
          />
        </div>

        {/* Ana içerik */}
        {children}
      </body>
    </html>
  );
}
