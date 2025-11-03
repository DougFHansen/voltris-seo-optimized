// Configurações para otimização de performance
export const performanceConfig = {
  // Configurações para cache
  cache: {
    maxAge: 31536000, // 1 ano
    staleWhileRevalidate: 86400, // 1 dia
  },
  
  // Configurações para compressão
  compression: {
    enabled: true,
    level: 6,
  },
  
  // Configurações para lazy loading
  lazyLoading: {
    enabled: true,
    threshold: 0.1,
    rootMargin: '50px',
  },
  
  // Configurações para preload
  preload: {
    critical: [
      '/fonts/roboto.woff2',
      '/logo.png',
    ],
    fonts: [
      'https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap',
    ],
  },
  
  // Configurações para service worker
  serviceWorker: {
    enabled: true,
    cacheName: 'voltris-cache-v1',
    strategies: {
      images: 'cache-first',
      fonts: 'cache-first',
      api: 'network-first',
      pages: 'network-first',
    },
  },
};

// Função para adicionar preload de recursos críticos
export const addPreloadLinks = () => {
  const links = [
    {
      rel: 'preload',
      href: '/fonts/roboto.woff2',
      as: 'font',
      type: 'font/woff2',
      crossOrigin: 'anonymous',
    },
    {
      rel: 'preload',
      href: '/logo.png',
      as: 'image',
    },
  ];
  
  return links;
};

// Função para otimizar carregamento de fontes
export const optimizeFonts = () => {
  return {
    display: 'swap',
    preload: true,
    fallback: ['system-ui', 'arial'],
  };
};

// Função para configurar cache de API
export const configureApiCache = () => {
  return {
    maxAge: 300, // 5 minutos
    staleWhileRevalidate: 60, // 1 minuto
  };
}; 