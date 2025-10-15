/* public/sw.js */
/* global self, caches, clients */

const SW_VERSION = 'v4'; // ⬅️ súbelo cada vez que cambies este archivo
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

// ---------- INSTALACIÓN / ACTIVACIÓN ----------
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(APP_SHELL_CACHE).then((c) => c.addAll(APP_SHELL)).catch(() => {})
  );
  self.skipWaiting();
});

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

// ---------- FETCH ESTRATEGIAS ----------
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return; // no tocar POST/PUT/…
  const url = new URL(req.url);

  // Navegaciones: network-first con fallback a offline.html
  if (req.mode === 'navigate') {
    event.respondWith(networkFirst(req, OFFLINE_URL));
    return;
  }

  // Estáticos (incluye /assets de Vite): cache-first
  if (url.pathname.startsWith('/assets/') || /\.(css|js|mjs|woff2?|ttf|eot)$/.test(url.pathname)) {
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

  // Por defecto
  event.respondWith(staleWhileRevalidate(req));
});

async function cacheFirst(req) {
  const cache = await caches.open(APP_SHELL_CACHE);
  const hit = await cache.match(req);
  if (hit) return hit;
  try {
    const res = await fetch(req);
    if (res.ok && res.type !== 'opaque') cache.put(req, res.clone());
    return res;
  } catch {
    return caches.match(OFFLINE_URL);
  }
}

async function staleWhileRevalidate(req) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cached = await cache.match(req);
  const fetcher = fetch(req)
    .then((res) => {
      if (res.ok && res.type !== 'opaque') cache.put(req, res.clone());
      return res;
    })
    .catch(() => cached);
  return cached || fetcher;
}

async function networkFirst(req, offlineFallback) {
  const cache = await caches.open(DYNAMIC_CACHE);
  try {
    const fresh = await fetch(req);
    if (fresh.ok && fresh.type !== 'opaque') cache.put(req, fresh.clone());
    return fresh;
  } catch {
    const cached = await cache.match(req);
    if (cached) return cached;
    if (offlineFallback) return caches.match(offlineFallback);
    throw new Error('offline');
  }
}

// ---------- BACKGROUND SYNC (simulado) ----------
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-entries') {
    event.waitUntil((async () => {
      const all = await clients.matchAll({ includeUncontrolled: true, type: 'window' });
      all.forEach(c => c.postMessage({ type: 'SYNC_ENTRIES_REQUEST' }));
    })());
  }
});

// ---------- PUSH (real/manual) ----------
self.addEventListener('push', (event) => {
  const data = event.data ? safeJson(event.data.text()) : { title: 'Notification', body: 'Push received.' };
  event.waitUntil(
    self.registration.showNotification(data.title || 'Notification', {
      body: data.body || 'Message',
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      data: data.data || { url: '/' },
      requireInteraction: false,
      tag: 'push-incoming',
      renotify: true
    })
  );
});

function safeJson(textPromise) {
  try {
    // event.data.text() devuelve una Promise<string>
    // manejamos ambos casos (cadena o promesa)
    if (typeof textPromise === 'string') return JSON.parse(textPromise);
    // si es promesa, devolvemos un objeto por defecto y no rompemos
    return {};
  } catch { return {}; }
}

// ---------- MENSAJE DESDE LA PÁGINA (postMessage → TEST_PUSH) ----------
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

// ---------- CLIC EN NOTIFICACIÓN ----------
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/';
  event.waitUntil((async () => {
    const windowClients = await clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const c of windowClients) {
      const cUrl = new URL(c.url);
      if (cUrl.origin === self.location.origin) {
        c.focus();
        c.navigate(url).catch(() => {});
        return;
      }
    }
    await clients.openWindow(url);
  })());
});
