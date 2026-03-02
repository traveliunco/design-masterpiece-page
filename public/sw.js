// Service Worker for Traveliun PWA
// Version 1.0.0

const CACHE_NAME = 'traveliun-v3';
const STATIC_CACHE = 'traveliun-static-v3';
const DYNAMIC_CACHE = 'traveliun-dynamic-v3';
const IMAGE_CACHE = 'traveliun-images-v3';
const DISABLE_CACHE_IN_PREVIEW = self.location.hostname.includes('lovableproject.com') || self.location.hostname.includes('localhost');

// الملفات الثابتة التي يجب تخزينها
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/manifest.json',
    '/offline.html',
];

// أقصى حجم للذاكرة المؤقتة الديناميكية
const MAX_DYNAMIC_CACHE_SIZE = 50;
const MAX_IMAGE_CACHE_SIZE = 100;

// تثبيت Service Worker
self.addEventListener('install', (event) => {
    console.log('[SW] Installing Service Worker...');

    if (DISABLE_CACHE_IN_PREVIEW) {
        event.waitUntil(self.skipWaiting());
        return;
    }

    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => {
                console.log('[SW] Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => self.skipWaiting())
    );
});

// تفعيل Service Worker
self.addEventListener('activate', (event) => {
    console.log('[SW] Activating Service Worker...');

    event.waitUntil(
        caches.keys()
            .then((keys) => {
                return Promise.all(keys.map((key) => caches.delete(key)));
            })
            .then(async () => {
                if (DISABLE_CACHE_IN_PREVIEW) {
                    await self.registration.unregister();
                }
                return self.clients.claim();
            })
    );
});

// استراتيجية التخزين المؤقت
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Disable SW request handling in preview/dev to prevent stale Vite chunks
    if (DISABLE_CACHE_IN_PREVIEW) {
        return;
    }

    // تجاهل الطلبات غير HTTP(S)
    if (!request.url.startsWith('http')) {
        return;
    }

    // Never cache Vite dev modules/chunks
    if (request.url.includes('/node_modules/.vite/') || request.url.includes('/src/')) {
        return event.respondWith(fetch(request));
    }

    // تجاهل طلبات API
    if (url.pathname.startsWith('/api') || url.hostname.includes('supabase')) {
        return event.respondWith(networkFirst(request));
    }

    // الصور - Cache First
    if (request.destination === 'image') {
        return event.respondWith(cacheFirstWithRefresh(request, IMAGE_CACHE, MAX_IMAGE_CACHE_SIZE));
    }

    // الصفحات - Network First
    if (request.mode === 'navigate') {
        return event.respondWith(networkFirstWithFallback(request));
    }

    // الملفات الثابتة - Cache First
    if (
        request.destination === 'script' ||
        request.destination === 'style' ||
        request.destination === 'font'
    ) {
        return event.respondWith(cacheFirst(request, STATIC_CACHE));
    }

    // باقي الطلبات - Stale While Revalidate
    return event.respondWith(staleWhileRevalidate(request));
});

// استراتيجية Cache First
async function cacheFirst(request, cacheName) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
        return cachedResponse;
    }

    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(cacheName);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        console.log('[SW] Fetch failed:', error);
        return new Response('Offline', { status: 503 });
    }
}

// استراتيجية Cache First مع تحديث في الخلفية
async function cacheFirstWithRefresh(request, cacheName, maxSize) {
    const cachedResponse = await caches.match(request);

    const fetchPromise = fetch(request)
        .then(async (networkResponse) => {
            if (networkResponse.ok) {
                const cache = await caches.open(cacheName);
                await trimCache(cacheName, maxSize - 1);
                cache.put(request, networkResponse.clone());
            }
            return networkResponse;
        })
        .catch(() => null);

    return cachedResponse || fetchPromise;
}

// استراتيجية Network First
async function networkFirst(request) {
    try {
        const networkResponse = await fetch(request);
        return networkResponse;
    } catch (error) {
        const cachedResponse = await caches.match(request);
        return cachedResponse || new Response('Offline', { status: 503 });
    }
}

// استراتيجية Network First مع Fallback
async function networkFirstWithFallback(request) {
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        return caches.match('/offline.html');
    }
}

// استراتيجية Stale While Revalidate
async function staleWhileRevalidate(request) {
    const cachedResponse = await caches.match(request);

    const fetchPromise = fetch(request)
        .then(async (networkResponse) => {
            if (networkResponse.ok) {
                const cache = await caches.open(DYNAMIC_CACHE);
                await trimCache(DYNAMIC_CACHE, MAX_DYNAMIC_CACHE_SIZE - 1);
                cache.put(request, networkResponse.clone());
            }
            return networkResponse;
        })
        .catch(() => cachedResponse);

    return cachedResponse || fetchPromise;
}

// تقليم حجم الذاكرة المؤقتة
async function trimCache(cacheName, maxSize) {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();

    if (keys.length > maxSize) {
        const keysToDelete = keys.slice(0, keys.length - maxSize);
        await Promise.all(keysToDelete.map((key) => cache.delete(key)));
    }
}

// التعامل مع الإشعارات
self.addEventListener('push', (event) => {
    console.log('[SW] Push received:', event);

    const data = event.data?.json() || {
        title: 'Traveliun',
        body: 'لديك إشعار جديد',
        icon: '/icons/icon-192x192.png',
    };

    event.waitUntil(
        self.registration.showNotification(data.title, {
            body: data.body,
            icon: data.icon || '/icons/icon-192x192.png',
            badge: '/icons/badge-72x72.png',
            dir: 'rtl',
            lang: 'ar',
            vibrate: [100, 50, 100],
            data: data.data,
        })
    );
});

// التعامل مع النقر على الإشعار
self.addEventListener('notificationclick', (event) => {
    console.log('[SW] Notification click:', event);

    event.notification.close();

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then((clientList) => {
                if (clientList.length > 0) {
                    return clientList[0].focus();
                }
                return clients.openWindow(event.notification.data?.url || '/');
            })
    );
});

// Background Sync
self.addEventListener('sync', (event) => {
    console.log('[SW] Background sync:', event.tag);

    if (event.tag === 'sync-bookings') {
        event.waitUntil(syncBookings());
    }
});

async function syncBookings() {
    // يمكن إضافة منطق مزامنة الحجوزات هنا
    console.log('[SW] Syncing bookings...');
}

console.log('[SW] Service Worker loaded');
