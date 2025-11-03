const CACHE_NAME = 'voltris-v1.0.0';
const STATIC_CACHE = 'voltris-static-v1.0.0';
const DYNAMIC_CACHE = 'voltris-dynamic-v1.0.0';

// Recursos para cache estático
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/logo.webp',
  '/favicon.ico',
  '/robots.txt',
  '/sitemap.xml',
  '/sitemap-images.xml',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/webfonts/fa-solid-900.woff2',
];

// Recursos para cache dinâmico
const DYNAMIC_ASSETS = [
  '/api/sitemap',
  '/api/sitemap-images',
];

// Estratégias de cache
const CACHE_STRATEGIES = {
  STATIC: 'cache-first',
  DYNAMIC: 'network-first',
  API: 'network-first',
  IMAGES: 'cache-first',
  FONTS: 'cache-first',
};

// Instalação do Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    Promise.all([
      // Cache estático
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      }),
      // Cache dinâmico
      caches.open(DYNAMIC_CACHE).then((cache) => {
        console.log('Service Worker: Caching dynamic assets');
        return cache.addAll(DYNAMIC_ASSETS);
      }),
    ])
  );
  
  self.skipWaiting();
});

// Ativação do Service Worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    Promise.all([
      // Limpar caches antigos
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Service Worker: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Tomar controle imediatamente
      self.clients.claim(),
    ])
  );
});

// Interceptação de requisições
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Pular requisições não-GET
  if (request.method !== 'GET') {
    return;
  }
  
  // Pular requisições de analytics
  if (url.hostname.includes('google-analytics') || 
      url.hostname.includes('googletagmanager') ||
      url.hostname.includes('googlesyndication')) {
    return;
  }
  
  // Estratégia baseada no tipo de recurso
  if (isStaticAsset(url)) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
  } else if (isImage(url)) {
    event.respondWith(cacheFirst(request, DYNAMIC_CACHE));
  } else if (isAPI(url)) {
    event.respondWith(networkFirst(request, DYNAMIC_CACHE));
  } else {
    event.respondWith(networkFirst(request, DYNAMIC_CACHE));
  }
});

// Estratégia Cache First
async function cacheFirst(request, cacheName) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Cache First failed:', error);
    return new Response('Offline content not available', { status: 503 });
  }
}

// Estratégia Network First
async function networkFirst(request, cacheName) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Network First failed, trying cache:', error);
    
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    return new Response('Offline content not available', { status: 503 });
  }
}

// Verificações de tipo de recurso
function isStaticAsset(url) {
  return STATIC_ASSETS.some(asset => url.pathname === asset || url.href === asset);
}

function isImage(url) {
  return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/i.test(url.pathname);
}

function isAPI(url) {
  return url.pathname.startsWith('/api/');
}

// Background sync para funcionalidades offline
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  try {
    // Sincronizar dados offline quando conexão for restaurada
    console.log('Background sync: Syncing offline data...');
    
    // Aqui você pode implementar sincronização de dados offline
    // Por exemplo, enviar formulários salvos offline
    
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Push notifications (para futuras implementações)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: data.icon || '/logo.webp',
      badge: data.badge || '/logo.webp',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: data.id || 1,
        category: data.category || 'system',
        sound: data.sound || null
      },
      actions: [
        {
          action: 'explore',
          title: 'Ver mais',
          icon: '/logo.webp'
        },
        {
          action: 'close',
          title: 'Fechar',
          icon: '/logo.webp'
        }
      ]
    };
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
    // Tocar som via BroadcastChannel/postMessage
    if (data.sound) {
      if ('BroadcastChannel' in self) {
        const bc = new BroadcastChannel('voltris_notifications');
        bc.postMessage({ type: 'PLAY_NOTIFICATION_SOUND', sound: data.sound });
        setTimeout(() => bc.close(), 1000);
      } else {
        self.clients.matchAll({ includeUncontrolled: true, type: 'window' }).then(clients => {
          clients.forEach(client => {
            client.postMessage({ type: 'PLAY_NOTIFICATION_SOUND', sound: data.sound });
          });
        });
      }
    }
  }
});

// Clique em notificação
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Mensagens do cliente
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});

// Limpeza periódica de cache
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'cache-cleanup') {
    event.waitUntil(cleanupOldCaches());
  }
});

async function cleanupOldCaches() {
  try {
    const cacheNames = await caches.keys();
    const currentCaches = [STATIC_CACHE, DYNAMIC_CACHE];
    
    for (const cacheName of cacheNames) {
      if (!currentCaches.includes(cacheName)) {
        await caches.delete(cacheName);
        console.log('Cleaned up old cache:', cacheName);
      }
    }
  } catch (error) {
    console.error('Cache cleanup failed:', error);
  }
} 