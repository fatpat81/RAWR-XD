const CACHE_NAME = 'rawr-x-games-cache-v1';
const urlsToCache = [
  './',
  './index.html',
  './style.css',
  './js/game-utils.js',
  './js/economy.js',
  './js/games/safety-pin-sniper.js',
  './js/games/liner-layer.js',
  './js/games/plushie-plunge.js',
  './js/games/chain-linker.js',
  './js/games/vinyl-spin.js',
  './js/games/skull-shuffle.js',
  './js/games/peg-punk.js',
  './js/games/vans-vault.js',
  './js/main.js'
];

// Install Event: Cache all critical assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch Event: Serve from cache gracefully, fallback to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request).catch(() => {
           // If network fails and it's not in cache, fallback gracefully
           console.log('Network request failed and no cache available for: ', event.request.url);
        });
      })
  );
});

// Activate Event: Clean up old caches if versions change
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
