const CACHE = "btm-v1";
const ASSETS = [
  "./", "index.html", "fonts.css", "manifest.webmanifest",
  "icons/apple-touch-icon.png",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/icon-maskable-512.png",
  "fonts/heebo-hebrew-400-normal.woff2",
  "fonts/heebo-hebrew-500-normal.woff2",
  "fonts/heebo-hebrew-700-normal.woff2",
  "fonts/heebo-hebrew-900-normal.woff2",
  "fonts/heebo-latin-400-normal.woff2",
  "fonts/heebo-latin-500-normal.woff2",
  "fonts/heebo-latin-700-normal.woff2",
  "fonts/heebo-latin-900-normal.woff2",
  "fonts/orbitron-latin-600-normal.woff2",
  "fonts/orbitron-latin-800-normal.woff2",
  "fonts/secular-one-hebrew-400-normal.woff2",
  "fonts/secular-one-latin-400-normal.woff2",
];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
// Network first for the page (so updates arrive), cache first for everything else; always works offline.
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;
  if (req.mode === "navigate") {
    e.respondWith(fetch(req).then(r => { const cp = r.clone(); caches.open(CACHE).then(c => c.put("index.html", cp)); return r; })
      .catch(() => caches.match("index.html")));
    return;
  }
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => {
    if (r.ok) { const cp = r.clone(); caches.open(CACHE).then(c => c.put(req, cp)); }
    return r;
  })));
});
