// Service Worker for caching and performance optimization
// Use timestamp to ensure cache is invalidated on new builds
const CACHE_NAME = 'master-management-v1';
const FILES_TO_CACHE = [
  './master-management-icon.png',
  './robots.txt',
  './../index.html',
  './../styles/index.css',
];

// Install event - cache static resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    }).then(() => {
      return self.skipWaiting();
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Fetch event - use network-first for HTML, cache-first for assets
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event?.request?.url.startsWith(self.location.origin)) {
    return;
  }

  const request = event?.request;

  // Network-first strategy for HTML and navigation requests
  if (request?.mode === 'navigate' || request?.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache the new HTML response
          if (response && response.status === 200) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return response;
        })
        .catch(() => {
          // Fallback to cache if network fails
          return caches.match(request).then((cachedResponse) => cachedResponse || caches.match('/'));
        })
    );
    return;
  }

  // Cache-first strategy for static assets (CSS, JS, images, fonts)
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        // Fetch from network and cache
        return fetch(request)
          .then((response) => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone and cache the response
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseToCache);
            });

            return response;
          })
          .catch(() => {
            // Return cached version if available
            return caches.match(request);
          });
      })
  );
});
