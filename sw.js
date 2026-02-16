const CACHE_NAME = "toolraja-v2";

/* Files to cache (App Shell) */
const ASSETS = [
  "/",
  "/index.html",
  "/category.html",
  "/style.css",
  "/app.js",
  "/tools.json",
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png"
];

/* ========================= */
/* INSTALL */
/* ========================= */
self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
  );
});

/* ========================= */
/* ACTIVATE */
/* ========================= */
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

/* ========================= */
/* FETCH */
/* ========================= */
self.addEventListener("fetch", event => {

  // Only handle GET requests
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        return cachedResponse || fetch(event.request)
          .then(networkResponse => {

            // Cache new requests dynamically
            return caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, networkResponse.clone());
                return networkResponse;
              });

          })
          .catch(() => {
            // Optional fallback
            if (event.request.mode === "navigate") {
              return caches.match("/index.html");
            }
          });
      })
  );

});