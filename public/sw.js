/* public/sw.js */
/* global self, caches, clients */

const SW_VERSION = 'v3';                       // 🔁 súbelo cuando cambies el SW
const APP_SHELL_CACHE = `app-shell-${SW_VERSION}`;
const DYNAMIC_CACHE   = `dynamic-${SW_VERSION}`;
const OFFLINE_URL     = '/offline.html';

const APP_SHELL = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/style.css',
  '/vite.svg',
  '/icon-192.png',
  '/icon-512.png',
];

// ✅ Precarga del App Shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(APP_SHELL_CACHE)
      .then((c) => c.addAll(APP_SHELL))
      .catch(() => {/* ignora fallos de precache para no bloquear instalación */})
  );
  self.skipWaiting();
});

// ✅ Limpieza de cachés antiguos y toma de control
self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys
        .filter(k => ![APP_SHELL_CACHE, DYNAMIC_CACHE].includes(k))
        .map(k => caches.delete(k))
    );
    await self.clients.claim();
  })());
});

// ✅ Estrategias por tipo de request
self.addEventListener('fetch', (event) => {
  const req = event.request;

  // No interceptar métodos que no sean GET
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Navegaciones (SPA): network-first con fallback a offline.html
  if (req.mode === 'navigate') {
    event.respondWith(networkFirst(req, OFFLINE_URL));
    return;
  }

  // Estáticos (incluye /assets de Vite): cache-first
  if (
    url.pathname.startsWith('/assets/') ||
    /\.(css|js|mjs|woff2?|ttf|eot)$/.test(url.pathname)
  ) {
    event.respondWith(cacheFirst(req));
    return;
  }

  // Imágenes: stale-while-revalidate
  if (/\.(png|jpg|jpeg|gif|svg|webp|ico)$/.test(url.pathname)) {
    event.respondWith(staleWhileRevalidate(req));
    return;
  }

  // Datos frescos (cuando tengas API): network-first
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(req, OFFLINE_URL));
    return;
  }

  // Por defecto: stale-while-revalidate
  event.respondWith(staleWhileRevalidate(req));
});

async function cacheFirst(req) {
  const cache = await caches.open(APP_SHELL_CACHE);
  const hit = await cache.match(req);
  if (hit) return hit;
  const res = await fetch(req);
  // Evita cachear respuestas inválidas
  if (res && res.status === 200) cache.put(req, res.clone());
  return res;
}

async function staleWhileRevalidate(req) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cached = await cache.match(req);
  const fetcher = fetch(req)
    .then((res) => {
      if (res && res.status === 200) cache.put(req, res.clone());
      return res;
    })
    .catch(() => cached);
  return cached || fetcher;
}

async function networkFirst(req, offlineFallback) {
  const cache = await caches.open(DYNAMIC_CACHE);
  try {
    const fresh = await fetch(req);
    if (fresh && fresh.status === 200) cache.put(req, fresh.clone());
    return fresh;
  } catch {
    const cached = await cache.match(req);
    if (cached) return cached;
    if (offlineFallback) return caches.match(offlineFallback);
    throw new Error('offline');
  }
}

// ✅ Background Sync (sin backend): pide al cliente marcar como sent
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-entries') {
    event.waitUntil((async () => {
      const all = await clients.matchAll({ includeUncontrolled: true, type: 'window' });
      all.forEach(c => c.postMessage({ type: 'SYNC_ENTRIES_REQUEST' }));
    })());
  }
});

// ✅ Push real o “manual” (si luego configuras FCM/VAPID)
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : { title: 'Notificación', body: 'Push recibido.' };
  event.waitUntil(
    self.registration.showNotification(data.title || 'Notificación', {
      body: data.body || 'Mensaje',
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      data: data.data || { url: '/' },
      requireInteraction: false,
      tag: 'push-incoming',
      renotify: true
    })
  );
});

// ✅ Notificación manual enviada desde la página (postMessage)
self.addEventListener('message', (event) => {
  const { type, payload } = event.data || {};
  if (type === 'TEST_PUSH') {
    const title = payload?.title || 'Test';
    const body  = payload?.body  || 'Notificación de prueba';
    event.waitUntil(
      self.registration.showNotification(title, {
        body,
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        data: { url: '/' },
        requireInteraction: false,
        tag: 'test-manual',
        renotify: true,
        vibrate: [80, 40, 80]
      })
    );
  }
});

// ✅ Abrir/centrar la app al tocar la notificación
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/';
  event.waitUntil((async () => {
    const windowClients = await clients.matchAll({ type: 'window', includeUncontrolled: true });
    // Si ya hay una pestaña de la app, llévala al frente
    for (const c of windowClients) {
      const cUrl = new URL(c.url);
      if (cUrl.origin === self.location.origin) {
        c.focus();
        c.navigate(url).catch(() => {}); // opcional
        return;
      }
    }
    // Si no existe, abre una nueva
    await clients.openWindow(url);
  })());
});
