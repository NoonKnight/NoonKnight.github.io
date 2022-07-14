const CACHE_NAME = "version-1";
const urlsToCache = ["index.html", "offline.html"];

self.addEventListener("install", (event) => {
  console.log("<addEventListener_install>");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log(`<caches open="${CACHE_NAME}" />`);
      return cache.addAll(urlsToCache);
    })
  );
  console.log("</addEventListener_install>");
});
self.addEventListener("activate", (event) => {
  console.log("<addEventListener_activate>");
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
  console.log("</addEventListener_activate>");
});
self.addEventListener("fetch", (event) => {
  console.log("<addEventListener_fetch>");
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
  console.log("</addEventListener_fetch>");
});
