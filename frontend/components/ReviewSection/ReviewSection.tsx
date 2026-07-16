"use client";
import { useState } from "react";

interface Review {
  id: string;
  user_name: string;
  badge?: string;
  rating: number;
  title?: string;
  content: string;
  helpful_count: number;
  created_at: string;
}

// Mock yorumlar (API bağlandıkça gerçek veri gelecek)
const MOCK_REVIEWS: Review[] = [
  { id: "1", user_name: "TurkGamer", badge: "Pro Gamer", rating: 5, title: "Harika bir ürün!", content: "Fiyat performans açısından piyasadaki en iyi seçenek. Hızlı kargo, sorunsuz teslimat.", helpful_count: 42, created_at: "2026-07-10T10:00:00Z" },
  { id: "2", user_name: "DonanımGurusu", badge: "Donanım Gurusu", rating: 4, title: "Kaliteli ama pahalı", content: "Ürün gerçekten kaliteli, ancak fiyatı biraz yüksek. Alternatifler de değerlendirilebilir.", helpful_count: 28, created_at: "2026-07-08T14:30:00Z" },
  { id: "3", user_name: "Yeni_Gamer", badge: "Gamer", rating: 5, content: "İlk gaming ürünüm ve çok memnunum. Kesinlikle tavsiye ederim.", helpful_count: 15, created_at: "2026-07-05T09:15:00Z" },
];

const BADGE_STYLES: Record<string, string> = {
  "Donanım Gurusu": "user-badge-guru",
  "Pro Gamer": "user-badge-pro",
  "Gamer": "user-badge-gamer",
};

export default function ReviewSection({ productId }: { productId: string }) {
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [formData, setFormData] = useState({ title: "", content: "" });
  const [submitted, setSubmitted] = useState(false);

  async function submitReview(e: React.FormEvent) {
    e.preventDefault();
    // Admin onayı için backend'e gönder
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id: productId, rating, ...formData }),
      });
    } catch { /* offline mode */ }
    setSubmitted(true);
    setShowForm(false);
  }

  const avgRating = (MOCK_REVIEWS.reduce((a, r) => a + r.rating, 0) / MOCK_REVIEWS.length).toFixed(1);
  const dist = [5, 4, 3, 2, 1].map((s) => ({
    star: s,
    count: MOCK_REVIEWS.filter((r) => r.rating === s).length,
    pct: Math.round((MOCK_REVIEWS.filter((r) => r.rating === s).length / MOCK_REVIEWS.length) * 100),
  }));

  return (
    <div className="space-y-6">
      {/* Özet */}
      <div className="card-glass p-6">
        <h2 className="section-title mb-6">Kullanıcı Yorumları</h2>

        <div className="flex flex-col sm:flex-row gap-6 items-start">
          {/* Büyük skor */}
          <div className="text-center shrink-0">
            <div className="text-6xl font-black text-white">{avgRating}</div>
            <div className="star-rating text-2xl mt-1">
              {"★".repeat(Math.round(Number(avgRating)))}
            </div>
            <div className="text-sm text-slate-500 mt-1">{MOCK_REVIEWS.length} yorum</div>
          </div>

          {/* Dağılım barları */}
          <div className="flex-1 space-y-2 w-full">
            {dist.map(({ star, count, pct }) => (
              <div key={star} className="flex items-center gap-3">
                <span className="text-xs text-slate-400 w-6 text-right">{star}★</span>
                <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "var(--color-bg-secondary)" }}>
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${pct}%`, background: "var(--gradient-purple)" }}
                  />
                </div>
                <span className="text-xs text-slate-500 w-6">{count}</span>
              </div>
            ))}
          </div>

          {/* Yorum yaz */}
          <div className="shrink-0">
            <button
              id="write-review-btn"
              onClick={() => setShowForm(!showForm)}
              className="btn-primary text-sm"
            >
              Yorum Yaz
            </button>
            {submitted && (
              <p className="text-xs text-green-400 mt-2">✓ Yorumunuz incelemeye alındı</p>
            )}
          </div>
        </div>

        {/* Yorum Formu */}
        {showForm && (
          <form onSubmit={submitReview} className="mt-6 p-4 rounded-xl space-y-4 animate-fade-in-up"
            style={{ background: "var(--color-bg-secondary)", border: "1px solid var(--color-border)" }}>
            <p className="text-xs text-slate-500">⚠️ Yorumlar yayınlanmadan önce admin onayından geçer.</p>

            {/* Yıldız seçici */}
            <div>
              <label className="text-sm text-slate-400 mb-2 block">Puanınız *</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setRating(s)}
                    onMouseEnter={() => setHoverRating(s)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="text-2xl transition-transform hover:scale-125"
                    style={{ color: s <= (hoverRating || rating) ? "#f59e0b" : "#334155" }}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm text-slate-400 mb-1 block">Başlık</label>
              <input
                type="text"
                className="input-dark text-sm h-9"
                placeholder="Yorumunuza kısa bir başlık..."
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm text-slate-400 mb-1 block">Yorumunuz *</label>
              <textarea
                required
                rows={3}
                className="input-dark text-sm resize-none"
                placeholder="Ürün hakkında deneyimlerinizi paylaşın..."
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              />
            </div>

            <div className="flex gap-3">
              <button type="submit" disabled={!rating || !formData.content} className="btn-primary text-sm disabled:opacity-40">
                Gönder
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary text-sm">
                İptal
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Yorum Listesi */}
      <div className="space-y-4">
        {MOCK_REVIEWS.map((review) => (
          <div key={review.id} className="card-glass p-5">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
                  style={{ background: "var(--gradient-purple)" }}>
                  {review.user_name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-200">{review.user_name}</span>
                    {review.badge && (
                      <span className={`text-xs font-semibold ${BADGE_STYLES[review.badge] || ""}`}>
                        • {review.badge}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="star-rating text-sm">{"★".repeat(review.rating)}</span>
                    <span className="text-xs text-slate-500">
                      {new Date(review.created_at).toLocaleDateString("tr-TR")}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {review.title && <h3 className="font-semibold text-slate-200 mb-1 text-sm">{review.title}</h3>}
            <p className="text-sm text-slate-400 leading-relaxed">{review.content}</p>

            <div className="flex items-center gap-2 mt-3">
              <button className="text-xs text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1">
                👍 Faydalı ({review.helpful_count})
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
