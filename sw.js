// Service Worker for Syafiq Hadzir Portfolio
// Version: 2.2.0 (2025-12-31)

const CACHE_VERSION = '2025-12-31';
const CACHE_NAME = `syafiq-portfolio-${CACHE_VERSION}`;
const OFFLINE_URL = '/offline.html';

// Assets to cache on install
const PRECACHE_ASSETS = [
    '/',
    '/index.html',
    '/contact.html',
    '/sitemap.html',
    '/offline.html',
    '/404.html',
    '/fonts/fa-solid-900.woff2',
    '/fonts/fa-brands-400.woff2',
    '/favicons/favicon.ico',
    '/favicons/android-chrome-192x192.png',
    '/favicons/android-chrome-512x512.png',
    '/images/headshot.webp',
];

// Install event - cache core assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches
            .open(CACHE_NAME)
            .then((cache) => {
                console.log('[SW] Precaching assets');
                return cache.addAll(PRECACHE_ASSETS);
            })
            .then(() => self.skipWaiting())
    );
});

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches
            .keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames
                        .filter(
                            (name) => name.startsWith('syafiq-portfolio-') && name !== CACHE_NAME
                        )
                        .map((name) => {
                            console.log('[SW] Deleting old cache:', name);
                            return caches.delete(name);
                        })
                );
            })
            .then(() => self.clients.claim())
    );
});

// Fetch event - network first, fallback to cache, then offline page
self.addEventListener('fetch', (event) => {
    // Only handle GET requests
    if (event.request.method !== 'GET') return;

    // Skip cross-origin requests
    if (!event.request.url.startsWith(self.location.origin)) return;

    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // Clone and cache successful responses
                if (response.status === 200) {
                    const responseClone = response.clone();
                    caches
                        .open(CACHE_NAME)
                        .then((cache) => cache.put(event.request, responseClone));
                }
                return response;
            })
            .catch(async () => {
                // Try cache first
                const cachedResponse = await caches.match(event.request);
                if (cachedResponse) return cachedResponse;

                // For navigation requests, show offline page
                if (event.request.mode === 'navigate') {
                    return caches.match(OFFLINE_URL);
                }

                // Return empty response for other failed requests
                return new Response('', { status: 503, statusText: 'Service Unavailable' });
            })
    );
});
