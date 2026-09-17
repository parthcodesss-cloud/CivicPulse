const CACHE_NAME = 'civicpulse-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/css/base.css',
  '/css/variables.css',
  '/css/layout.css',
  '/js/app.js'
];

// Install event: cache assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      // Best effort caching, don't fail if some requests fail
      return cache.addAll(ASSETS).catch(err => console.warn('Cache addAll error:', err));
    })
  );
  self.skipWaiting();
});

// Fetch event: network first, fallback to cache
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .catch(() => caches.match(event.request))
  );
});
