// Service Worker dla DAGAS - podstawowe cache'owanie
const CACHE_NAME = 'dagas-v1.0.0';
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/styles.css',
    '/script.js',
    '/favicon.png',
    '/logo/logo przeźroczyste-ikona.png',
    '/logo/logo przeźroczyste.png',
    '/logo/logo niebieskie.png',
    '/logo/logo białe.png'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    console.log('Service Worker: Installing...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Service Worker: Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
    );
    self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activating...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Service Worker: Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Fetch event - serve from cache when possible
self.addEventListener('fetch', (event) => {
    // Only handle GET requests
    if (event.request.method !== 'GET') return;
    
    // Skip cross-origin requests
    if (!event.request.url.startsWith(self.location.origin)) return;
    
    event.respondWith(
        (async () => {
            // Check if navigation preload is available
            const preloadResponse = event.preloadResponse;
            const cachedResponse = await caches.match(event.request);
            
            // If we have a cached response, return it
            if (cachedResponse) {
                return cachedResponse;
            }
            
            // If navigation preload is available, wait for it
            if (preloadResponse) {
                try {
                    const preloadResult = await preloadResponse;
                    if (preloadResult) {
                        // Cache the preload response
                        const responseClone = preloadResult.clone();
                        const cache = await caches.open(CACHE_NAME);
                        cache.put(event.request, responseClone);
                        return preloadResult;
                    }
                } catch (error) {
                    console.log('Navigation preload failed:', error);
                }
            }
            
            // Fallback to regular fetch
            try {
                const fetchResponse = await fetch(event.request);
                
                // Cache successful responses
                if (fetchResponse.status === 200) {
                    const responseClone = fetchResponse.clone();
                    const cache = await caches.open(CACHE_NAME);
                    cache.put(event.request, responseClone);
                }
                
                return fetchResponse;
            } catch (error) {
                console.log('Fetch failed:', error);
                
                // Fallback for offline scenarios
                if (event.request.destination === 'document') {
                    return caches.match('/index.html');
                }
                
                throw error;
            }
        })()
    );
});
