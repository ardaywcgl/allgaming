// HepsiGaming Service Worker — PWA + Push Notifications
const CACHE_NAME = "hepsigaming-v1";
const STATIC_ASSETS = ["/", "/arama", "/firsatlar", "/manifest.json"];

// Kurulum: Statik varlıkları cache'e al
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// Aktivasyon: Eski cache'leri temizle
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: Cache-First statikler, Network-First API
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // API isteklerini her zaman network'ten al
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Statik varlıklar: Cache-First
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        if (response.ok && event.request.method === "GET") {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      });
    })
  );
});

// Push Bildirim: Fiyat düşünce tetiklenir
self.addEventListener("push", (event) => {
  const data = event.data?.json() || {};
  const title = data.title || "HepsiGaming";
  const options = {
    body: data.body || "Takip ettiğin ürünün fiyatı düştü!",
    icon: "/icons/icon-192.png",
    badge: "/icons/icon-96.png",
    tag: data.tag || "price-alert",
    data: { url: data.url || "/" },
    actions: [
      { action: "view", title: "İncele" },
      { action: "dismiss", title: "Kapat" },
    ],
    vibrate: [200, 100, 200],
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

// Bildirime tıklandığında ürün sayfasını aç
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  if (event.action === "dismiss") return;
  const url = event.notification.data?.url || "/";
  event.waitUntil(
    clients.matchAll({ type: "window" }).then((clientList) => {
      const existing = clientList.find((c) => c.url === url && "focus" in c);
      if (existing) return existing.focus();
      return clients.openWindow(url);
    })
  );
});
