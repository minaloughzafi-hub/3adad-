const CACHE_NAME = "percent-clock-pwa-v4";
const ASSETS = [
  "./", "./index.html", "./style.css", "./app.js", "./manifest.json",
  "./icon.svg", "./icon-192.png", "./icon-512.png", "./icon-maskable-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  const req = event.request;
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;

  // الصفحات: الأول من الكاش (باش تخدم offline دايما)، ونحدّثو فالخلفية
  if (req.mode === "navigate") {
    event.respondWith(
      caches.match("./index.html").then(cached => {
        const update = fetch(req).then(res => {
          if (res && res.ok) {
            const copy = res.clone();
            caches.open(CACHE_NAME).then(c => c.put("./index.html", copy));
          }
          return res;
        }).catch(() => cached);
        return cached || update;
      })
    );
    return;
  }

  // باقي الملفات: من الكاش، وإلا من النت مع تخزينها
  event.respondWith(
    caches.match(req, { ignoreSearch: true }).then(cached =>
      cached || fetch(req).then(res => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(req, copy));
        }
        return res;
      })
    )
  );
});
