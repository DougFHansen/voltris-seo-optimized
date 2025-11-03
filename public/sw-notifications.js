// Service Worker para Notificações Push
const CACHE_NAME = 'voltris-notifications-v2';

// Evento de instalação
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker de notificações instalado');
  console.log('📱 User Agent:', navigator.userAgent);
  console.log('🌐 Location:', self.location.href);
  
  // Forçar ativação imediata
  self.skipWaiting();
});

// Evento de ativação
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker de notificações ativado');
  
  // Limpar caches antigos
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Removendo cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  // Reivindicar controle de todos os clientes
  event.waitUntil(self.clients.claim());
});

// Evento de mensagem push
self.addEventListener('push', (event) => {
  console.log('📱 Notificação push recebida:', event);
  
  if (event.data) {
    try {
      const data = event.data.json();
      console.log('📋 Dados da notificação:', data);
      
      const options = {
        body: data.body || 'Nova notificação do VOLTRIS',
        icon: '/logo-v2.webp',
        badge: '/logo-v2.webp',
        tag: data.tag || 'voltris-notification',
        data: data.data || {},
        requireInteraction: true,
        actions: [
          {
            action: 'view',
            title: 'Ver',
            icon: '/logo-v2.webp'
          },
          {
            action: 'close',
            title: 'Fechar',
            icon: '/logo-v2.webp'
          }
        ]
      };

      console.log('🔔 Mostrando notificação com opções:', options);
      event.waitUntil(
        self.registration.showNotification(data.title || 'VOLTRIS', options)
      );
    } catch (error) {
      console.error('❌ Erro ao processar notificação push:', error);
      // Fallback: mostrar notificação básica
      event.waitUntil(
        self.registration.showNotification('VOLTRIS', {
          body: 'Nova notificação do VOLTRIS',
          icon: '/logo-v2.webp',
          tag: 'voltris-notification-fallback'
        })
      );
    }
  } else {
    console.log('⚠️ Notificação push sem dados');
  }
});

// Evento de clique na notificação
self.addEventListener('notificationclick', (event) => {
  console.log('👆 Notificação clicada:', event);
  
  event.notification.close();
  
  if (event.action === 'view') {
    console.log('🔗 Abrindo dashboard de pedidos...');
    // Abrir o site quando clicar em "Ver"
    event.waitUntil(
      self.clients.openWindow('/dashboard/orders')
    );
  } else {
    // Se clicou na notificação (sem ação específica)
    console.log('🔗 Abrindo site principal...');
    event.waitUntil(
      self.clients.openWindow('/')
    );
  }
});

// Evento de fechar notificação
self.addEventListener('notificationclose', (event) => {
  console.log('❌ Notificação fechada:', event);
});

// Evento de mensagem do cliente
self.addEventListener('message', (event) => {
  console.log('💬 Mensagem recebida do cliente:', event.data);
  
  if (event.data && event.data.type === 'TEST_NOTIFICATION') {
    console.log('🧪 Enviando notificação de teste...');
    event.waitUntil(
      self.registration.showNotification('VOLTRIS - Teste', {
        body: 'Esta é uma notificação de teste!',
        icon: '/logo-v2.webp',
        badge: '/logo-v2.webp',
        tag: 'test-notification',
        requireInteraction: true
      })
    );
  }
  
  // Responder ao cliente
  if (event.ports && event.ports[0]) {
    event.ports[0].postMessage({
      type: 'SERVICE_WORKER_READY',
      message: 'Service Worker ativo e funcionando'
    });
  }
});

// Função para enviar notificação para todos os clientes
function sendNotificationToClients(data) {
  console.log('📤 Enviando notificação para clientes:', data);
  self.clients.matchAll().then(clients => {
    console.log(`📱 ${clients.length} clientes encontrados`);
    clients.forEach(client => {
      client.postMessage({
        type: 'PUSH_NOTIFICATION',
        data: data
      });
    });
  }).catch(error => {
    console.error('❌ Erro ao enviar para clientes:', error);
  });
}

// Log de inicialização
console.log('🔔 Service Worker de notificações carregado e pronto!');
console.log('📱 Versão:', CACHE_NAME);
console.log('🌐 Escopo:', self.registration?.scope || 'N/A');
