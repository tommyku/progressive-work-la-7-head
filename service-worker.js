var cacheName, filesToCache;

cacheName = 'pwa-wl7h-4';

filesToCache = ['/', 'index.html', 'bundle.js'];

self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  return e.waitUntil(caches.open(cacheName).then(function(cache) {
    console.log('[ServiceWorker] Caching app shell');
    return cache.addAll(filesToCache);
  }));
});

self.addEventListener('fetch', function(e) {
  console.log('[ServiceWorker] Fetch', e.request.url);
  return e.respondWith(caches.match(e.request).then(function(response) {
    return response || fetch(e.request);
  }));
});

self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
  return e.waitUntil(caches.keys().then(function(keyList) {
    return Promise.all(keyList.map(function(key) {
      if (key !== cacheName) {
        console.log('[ServiceWorker] Removing old cache', key);
        return caches["delete"](key);
      }
    }));
  }));
});
