/* Caches the app shell so it opens instantly. Data calls to Apps Script are never cached. */
var V = 'mc-v1';
self.addEventListener('install', function (e) { e.waitUntil(caches.open(V).then(function (c) { return c.addAll(['./', 'index.html', 'manifest.webmanifest', 'icon-192.png']); })); self.skipWaiting(); });
self.addEventListener('activate', function (e) { e.waitUntil(caches.keys().then(function (k) { return Promise.all(k.filter(function (x) { return x !== V; }).map(function (x) { return caches.delete(x); })); })); self.clients.claim(); });
self.addEventListener('fetch', function (e) {
  var u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  e.respondWith(fetch(e.request).then(function (r) { var c = r.clone(); caches.open(V).then(function (x) { x.put(e.request, c); }); return r; }).catch(function () { return caches.match(e.request); }));
});
