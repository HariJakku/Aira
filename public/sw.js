// AIRA PWA Service Worker v1.0
const CACHE_NAME = "aira-v1";
const OFFLINE_URL = "/offline";

// Assets to cache immediately on install
const STATIC_ASSETS = [
  "/",
  "/offline",
  "/manifest.json",
  "/aira-logo.jpeg",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
];

// ── Install ───────────────────────────────────────────────
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// ── Activate ──────────────────────────────────────────────
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== CACHE_NAME)
          .map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// ── Fetch strategy ────────────────────────────────────────
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET and cross-origin (Supabase API etc.)
  if (request.method !== "GET") return;
  if (url.origin !== self.location.origin) return;

  // Skip Next.js internals
  if (url.pathname.startsWith("/_next/")) {
    event.respondWith(networkFirst(request));
    return;
  }

  // API routes — network only, no cache
  if (url.pathname.startsWith("/api/")) return;

  // HTML pages — network first, fallback to cache, then offline page
  if (request.headers.get("accept")?.includes("text/html")) {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(request, clone));
          return res;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          return cached ?? (await caches.match(OFFLINE_URL));
        })
    );
    return;
  }

  // Static assets — cache first
  event.respondWith(
    caches.match(request).then(
      (cached) => cached ?? fetch(request).then((res) => {
        const clone = res.clone();
        caches.open(CACHE_NAME).then((c) => c.put(request, clone));
        return res;
      })
    )
  );
});

async function networkFirst(request) {
  try {
    const res = await fetch(request);
    const clone = res.clone();
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, clone);
    return res;
  } catch {
    return caches.match(request);
  }
}
