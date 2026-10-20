const CACHE_NAME = "fs-cache-v2";
const PRECACHE = ["./", "./index.html", "./manifest.json", "./icon-192.png", "./icon-512.png"];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE)));
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(names => Promise.all(names.filter(n => n !== CACHE_NAME).map(n => caches.delete(n))))
  );
  self.clients.claim();
});

// Die App-Seite selbst (index.html) immer frisch aus dem Netz laden, wenn
// online -- sonst zeigt die App nach jedem Update erst beim ZWEITEN Oeffnen
// den neuen Stand (klassisches stale-while-revalidate-Problem). Nur wenn
// offline wird auf die zwischengespeicherte Version zurueckgefallen.
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  const isAppShell = event.request.mode === "navigate" || url.pathname.endsWith("/") || url.pathname.endsWith("index.html");

  if (isAppShell) {
    event.respondWith(
      fetch(event.request).then(resp => {
        if (resp && resp.status === 200) caches.open(CACHE_NAME).then(cache => cache.put(event.request, resp.clone()));
        return resp;
      }).catch(() => caches.open(CACHE_NAME).then(cache => cache.match(event.request)))
    );
    return;
  }

  event.respondWith(
    caches.open(CACHE_NAME).then(async cache => {
      const cached = await cache.match(event.request);
      const networkFetch = fetch(event.request).then(resp => {
        if (resp && resp.status === 200) cache.put(event.request, resp.clone());
        return resp;
      }).catch(() => cached);
      return cached || networkFetch;
    })
  );
});
