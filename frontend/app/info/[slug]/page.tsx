import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import ChatWidget from "@/components/ChatWidget/ChatWidget";
import Link from "next/link";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const titles: Record<string, string> = {
    hakkimizda: "Hakkımızda",
    "fiyat-takibi": "Fiyat Takibi Nasıl Çalışır?",
    iletisim: "İletişim",
    gizlilik: "Gizlilik Politikası",
    kosullar: "Kullanım Koşulları",
  };
  const title = titles[slug] || "Destek & Bilgi";
  return {
    title: `${title} — HepsiGaming`,
    description: `HepsiGaming ${title} dökümanı ve detayları.`,
  };
}

const INFO_PAGES: Record<string, { title: string; content: React.ReactNode }> = {
  hakkimizda: {
    title: "Hakkımızda",
    content: (
      <>
        <p>HepsiGaming, Türkiye'deki oyuncuların en doğru oyun donanımı ve ekipman fiyatlarına en hızlı şekilde ulaşabilmesi amacıyla kurulmuş bağımsız bir fiyat karşılaştırma platformudur.</p>
        <p>Amacımız, Trendyol'dan Amazon'a, Hepsiburada'dan yerel donanım satıcılarına kadar tüm e-ticaret sitelerindeki fiyatları tek bir çatı altında toplayarak oyuncuların bütçelerine en uygun ekipmana sahip olmasını kolaylaştırmaktır.</p>
        <p>Tüm sorgulamalar, otomatik botlarımız ve gelişmiş veri işleme altyapımızla günde birkaç kez taranarak güncellenir.</p>
      </>
    ),
  },
  "fiyat-takibi": {
    title: "Fiyat Takibi Nasıl Çalışır?",
    content: (
      <>
        <p>Takip etmek istediğiniz ürünün sayfasında bulunan <strong>Fiyat Alarmı</strong> butonuna tıklayarak veya e-posta adresinizle hedef fiyatınızı girerek fiyat alarmı kurabilirsiniz.</p>
        <p>Sistemimiz, ürünün fiyatını her gün düzenli olarak kontrol eder. Ürün sizin belirlediğiniz fiyata veya altına düştüğünde, otomatik olarak e-posta adresinize veya tarayıcı anlık bildirimi (Web Push) ile sizi bilgilendiririz.</p>
        <p>Bu hizmet tamamen ücretsizdir ve dilediğiniz zaman alarmlarınızı iptal edebilirsiniz.</p>
      </>
    ),
  },
  iletisim: {
    title: "İletişim",
    content: (
      <>
        <p>Bizimle iletişime geçmek için aşağıdaki yolları kullanabilirsiniz:</p>
        <ul>
          <li><strong>E-posta:</strong> destek@hepsigaming.com</li>
          <li><strong>Adres:</strong> HepsiGaming Teknoloji Ltd. Şti. - Kadıköy, İstanbul</li>
          <li><strong>Çalışma Saatleri:</strong> Hafta içi 09:00 - 18:00</li>
        </ul>
        <p>Görüş, öneri veya hata bildirimlerinizi bizimle paylaşmaktan çekinmeyin. En geç 24 saat içinde geri dönüş sağlıyoruz.</p>
      </>
    ),
  },
  gizlilik: {
    title: "Gizlilik Politikası",
    content: (
      <>
        <p>HepsiGaming olarak kişisel verilerinizin güvenliği hususunda azami hassasiyet göstermekteyiz. E-posta adresleriniz ve tarayıcı abonelikleriniz sadece fiyat alarmlarını size ulaştırmak amacıyla saklanır.</p>
        <p>Kişisel verileriniz hiçbir üçüncü şahıs veya kurumla paylaşılmaz ve pazarlama amacıyla satılmaz.</p>
        <p>Verilerinizi silmek veya bilgi almak istediğinizde destek@hepsigaming.com üzerinden bizimle doğrudan iletişim kurabilirsiniz.</p>
      </>
    ),
  },
  kosullar: {
    title: "Kullanım Koşulları",
    content: (
      <>
        <p>HepsiGaming sitesinde yer alan tüm fiyatlar ve stok bilgileri üçüncü taraf satıcılardan (Amazon, Trendyol vb.) çekilmektedir. Fiyatların doğruluğu için azami çaba gösterilse de nihai fiyat satın alım yaptığınız sitedeki fiyattır.</p>
        <p>Satın alım aşamasında yaşanabilecek kargo, iade veya ürün kusuru durumlarında HepsiGaming sorumluluk kabul etmemektedir; tüm işlemler ilgili satıcı firma üzerinden yürütülür.</p>
        <p>Sitemizdeki içeriklerin ve fiyat takip botu verilerinin izinsiz olarak ticari amaçla çekilmesi ve kopyalanması yasaktır.</p>
      </>
    ),
  },
};

export default async function InfoDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = INFO_PAGES[slug];

  if (!page) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="min-h-[80vh] py-12 px-4 max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <Link href="/" className="hover:text-slate-300 transition-colors no-underline">Ana Sayfa</Link>
          <span>/</span>
          <span className="text-slate-300 capitalize">{page.title}</span>
        </nav>

        <div className="card-glass p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-black mb-8 text-white">
            {page.title}
          </h1>
          <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed space-y-6">
            {page.content}
          </div>
        </div>
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}
