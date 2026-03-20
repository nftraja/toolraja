const CACHE_NAME = "toolraja-auto-v1";

self.addEventListener("install", (e) => {
  self.skipWaiting(); // 🔥 तुरंत नया SW activate
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if(key !== CACHE_NAME){
            return caches.delete(key); // 🔥 पुराना cache delete
          }
        })
      )
    )
  );
  self.clients.claim(); // 🔥 तुरंत control ले
});

/* 🔥 NO CACHE FOR CSS & JS (IMPORTANT) */
self.addEventListener("fetch", (e) => {

  const url = new URL(e.request.url);

  // CSS / JS हमेशा fresh load होंगे
  if(url.pathname.endsWith(".css") || url.pathname.endsWith(".js")){
    e.respondWith(fetch(e.request));
    return;
  }

  // बाकी files cache हो सकते हैं
  e.respondWith(
    caches.match(e.request).then(res => {
      return res || fetch(e.request);
    })
  );

});