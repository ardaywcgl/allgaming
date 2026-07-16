"use client";
import { useState, useRef, useEffect } from "react";

interface Message {
  id: string;
  role: "user" | "bot";
  text: string;
  products?: Product[];
  timestamp: Date;
}

interface Product {
  id: string;
  name: string;
  minPrice: string;
  img: string;
  slug: string;
}

const INITIAL_MESSAGE: Message = {
  id: "init",
  role: "bot",
  text: "Merhaba! 👋 Ben HepsiGaming asistanıyım. Bütçeni ve ihtiyaçlarını söyle, sana en uygun oyun donanımını bulayım!\n\n💡 *\"5000 TL'ye FPS için kablosuz mouse\"* gibi yazabilirsin.",
  timestamp: new Date(),
};

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [unread, setUnread] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/v1/chat`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: text }),
        }
      );

      if (res.ok) {
        const data = await res.json();
        const botMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: "bot",
          text: data.message,
          products: data.products || [],
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMsg]);
        if (!open) setUnread((n) => n + 1);
      } else {
        throw new Error("API error");
      }
    } catch {
      const errMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "bot",
        text: "Üzgünüm, şu an bir sorun yaşıyorum. Lütfen tekrar deneyin. 🙏",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  }

  const QUICK_ACTIONS = [
    "Bugünün fırsatları neler?",
    "3000 TL altı gaming mouse öner",
    "PS5 fiyatı ne kadar?",
  ];

  return (
    <>
      {/* Floating Buton */}
      <button
        id="chat-widget-toggle"
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all hover:scale-110 active:scale-95"
        style={{ background: "var(--gradient-purple)", boxShadow: "var(--glow-purple)" }}
        aria-label="Chatbot'u aç"
      >
        {open ? (
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
        {/* Okunmamış sayacı */}
        {unread > 0 && !open && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">
            {unread}
          </span>
        )}
      </button>

      {/* Chat Paneli */}
      {open && (
        <div
          id="chat-widget-panel"
          className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-24px)] rounded-2xl overflow-hidden shadow-2xl animate-fade-in-up"
          style={{
            background: "var(--color-bg-card)",
            border: "1px solid var(--color-border-accent)",
            boxShadow: "var(--glow-purple), 0 25px 50px rgba(0,0,0,0.6)",
          }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 p-4" style={{ borderBottom: "1px solid var(--color-border)", background: "rgba(124,58,237,0.1)" }}>
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ background: "var(--gradient-purple)" }}>
              AI
            </div>
            <div className="flex-1">
              <div className="font-semibold text-sm text-white">HepsiGaming Asistan</div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs text-slate-400">Çevrimiçi · TR/EN</span>
              </div>
            </div>
          </div>

          {/* Mesajlar */}
          <div className="flex flex-col gap-3 p-4 h-[340px] overflow-y-auto">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={msg.role === "bot" ? "chat-bubble-bot" : "chat-bubble-user"}>
                  <p className="text-sm leading-relaxed whitespace-pre-line">{msg.text}</p>

                  {/* Ürün kartları (bot cevabında) */}
                  {msg.products && msg.products.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {msg.products.map((p) => (
                        <a
                          key={p.id}
                          href={`/urun/${p.slug}`}
                          className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 transition-colors no-underline"
                          style={{ border: "1px solid var(--color-border)" }}
                        >
                          <span className="text-xl">{p.img}</span>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-medium text-slate-200 truncate">{p.name}</div>
                            <div className="text-xs font-mono font-bold text-green-400">{p.minPrice}₺'den</div>
                          </div>
                          <svg className="w-4 h-4 text-slate-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Yazıyor animasyonu */}
            {loading && (
              <div className="flex justify-start">
                <div className="chat-bubble-bot">
                  <div className="flex gap-1.5 items-center h-5">
                    {[0, 1, 2].map((i) => (
                      <span key={i} className="w-2 h-2 rounded-full bg-slate-400 animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Hızlı Eylemler */}
          {messages.length <= 1 && (
            <div className="px-4 pb-2 flex flex-wrap gap-2">
              {QUICK_ACTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => { setInput(q); inputRef.current?.focus(); }}
                  className="text-xs px-3 py-1.5 rounded-full border text-slate-400 hover:text-white hover:border-purple-500 transition-all"
                  style={{ borderColor: "var(--color-border)" }}
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-3" style={{ borderTop: "1px solid var(--color-border)" }}>
            <div className="flex gap-2">
              <input
                ref={inputRef}
                id="chat-input"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Mesajınızı yazın..."
                className="input-dark h-10 text-sm flex-1"
                disabled={loading}
              />
              <button
                id="chat-send-btn"
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="btn-primary h-10 px-4 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
