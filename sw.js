const CACHE_NAME = "version-1";
const urlsToCache = ["index.html", "offline.html"];

self.addEventListener("install", (event) => {
  console.log('<addEventListener event="install" />');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log(`<caches open="${CACHE_NAME}" />`);
      return cache.addAll(urlsToCache);
    })
  );
  // console.log("</addEventListener>");
});
self.addEventListener("activate", (event) => {
  console.log('<addEventListener event="activate" />');
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      )
    )
  );
  console.log("</addEventListener>");
});
self.addEventListener("fetch", (event) => {
  console.log('<addEventListener event="fetch">');
  event.respondWith(
    caches
      .match(event.request)
      .then(() => {
        return fetch(event.request);
      })
      .catch(() => {
        return caches.match("offline.html");
      })
  );
  console.log("</addEventListener>");
});
