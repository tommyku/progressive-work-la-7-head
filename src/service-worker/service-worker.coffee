cacheName = 'pwa-wl7h-2'
filesToCache = [
  '/'
  'index.html'
  'vendor/js/bootstrap.min.js'
  'vendor/js/jquery-1.11.1.min.js'
  'vendor/css/bootstrap.css'
  'css/todo.css'
  'js/app.js'
]

self.addEventListener 'install', (e)->
  console.log('[ServiceWorker] Install')
  e.waitUntil(caches
    .open(cacheName)
    .then (cache)->
      console.log('[ServiceWorker] Caching app shell')
      cache.addAll(filesToCache)
  )

self.addEventListener 'fetch', (e)->
  console.log '[ServiceWorker] Fetch', e.request.url
  e.respondWith(caches
    .match e.request
    .then (response)->
      return response || fetch(e.request)
  )

self.addEventListener 'activate', (e)->
  console.log '[ServiceWorker] Activate'
  e.waitUntil(caches.keys()
    .then (keyList)->
      Promise.all keyList.map (key)->
        if key != cacheName
          console.log '[ServiceWorker] Removing old cache', key
          caches.delete key
  )
