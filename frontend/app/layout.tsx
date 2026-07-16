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
  themeColor: "#050108",
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="font-sans antialiased">
        {/* Ambient depth orbs (organic, slow-drifting) */}
        <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden" aria-hidden="true">
          <div
            className="absolute rounded-full filter blur-[120px] orb-drift-1"
            style={{
              width: "520px",
              height: "520px",
              background: "radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)",
              top: "-10%",
              left: "5%",
            }}
          />
          <div
            className="absolute rounded-full filter blur-[140px] orb-drift-2"
            style={{
              width: "620px",
              height: "620px",
              background: "radial-gradient(circle, rgba(45,212,255,0.08) 0%, transparent 70%)",
              bottom: "5%",
              right: "0%",
            }}
          />
          <div
            className="absolute rounded-full filter blur-[100px] orb-drift-1"
            style={{
              width: "400px",
              height: "400px",
              background: "radial-gradient(circle, rgba(255,45,146,0.06) 0%, transparent 70%)",
              top: "40%",
              right: "25%",
              animationDelay: "4s",
            }}
          />
        </div>

        {children}
      </body>
    </html>
  );
}
