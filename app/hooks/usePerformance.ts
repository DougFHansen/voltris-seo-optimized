import { useEffect, useRef, useState, useCallback } from 'react';

// Hook para lazy loading com Intersection Observer
export const useLazyLoad = (options: IntersectionObserverInit = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options,
      }
    );

    const currentElement = elementRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [options]);

  return { elementRef, isVisible };
};

// Hook para preload de recursos
export const usePreload = (urls: string[]) => {
  const [loadedUrls, setLoadedUrls] = useState<Set<string>>(new Set());

  const preloadResource = useCallback(async (url: string) => {
    try {
      if (url.endsWith('.css')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = url;
        document.head.appendChild(link);
      } else if (url.endsWith('.js')) {
        const script = document.createElement('script');
        script.src = url;
        script.async = true;
        document.head.appendChild(script);
      } else {
        const img = new Image();
        img.src = url;
      }
      setLoadedUrls(prev => new Set(prev).add(url));
    } catch (error) {
      console.warn(`Failed to preload: ${url}`, error);
    }
  }, []);

  useEffect(() => {
    urls.forEach(url => {
      if (!loadedUrls.has(url)) {
        preloadResource(url);
      }
    });
  }, [urls, loadedUrls, preloadResource]);

  return { loadedUrls };
};

// Hook para otimização de scroll
export const useScrollOptimization = (threshold = 100) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up');
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const direction = currentScrollY > lastScrollY.current ? 'down' : 'up';
      
      setIsScrolled(currentScrollY > threshold);
      setScrollDirection(direction);
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return { isScrolled, scrollDirection };
};

// Hook para otimização de performance de animações
export const useAnimationOptimization = () => {
  const [shouldAnimate, setShouldAnimate] = useState(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setShouldAnimate(!mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setShouldAnimate(!e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return { shouldAnimate };
};

// Hook para otimização de imagens
export const useImageOptimization = (src: string) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!src) return;

    const img = new Image();
    img.onload = () => setIsLoaded(true);
    img.onerror = () => setHasError(true);
    img.src = src;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  return { isLoaded, hasError };
};

// Hook para otimização de fontes
export const useFontOptimization = (fontFamily: string) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (document.fonts && document.fonts.load) {
      document.fonts.load(`1em ${fontFamily}`).then(() => {
        setIsLoaded(true);
      });
    } else {
      // Fallback para navegadores que não suportam Font Loading API
      setIsLoaded(true);
    }
  }, [fontFamily]);

  return { isLoaded };
};

// Hook para otimização de cache
export const useCacheOptimization = (key: string, data: any, ttl: number = 3600000) => {
  const [cachedData, setCachedData] = useState<any>(null);

  useEffect(() => {
    try {
      const cached = localStorage.getItem(key);
      if (cached) {
        const { value, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < ttl) {
          setCachedData(value);
          return;
        }
      }
    } catch (error) {
      console.warn('Cache read error:', error);
    }
  }, [key, ttl]);

  const setCache = useCallback((value: any) => {
    try {
      const cacheData = {
        value,
        timestamp: Date.now(),
      };
      localStorage.setItem(key, JSON.stringify(cacheData));
      setCachedData(value);
    } catch (error) {
      console.warn('Cache write error:', error);
    }
  }, [key]);

  const clearCache = useCallback(() => {
    try {
      localStorage.removeItem(key);
      setCachedData(null);
    } catch (error) {
      console.warn('Cache clear error:', error);
    }
  }, [key]);

  return { cachedData, setCache, clearCache };
};

// Hook para otimização de performance geral
export const usePerformanceOptimization = () => {
  const [performanceMetrics, setPerformanceMetrics] = useState({
    fcp: 0,
    lcp: 0,
    fid: 0,
    cls: 0,
  });

  useEffect(() => {
    if ('PerformanceObserver' in window) {
      // First Contentful Paint
      const fcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const fcp = entries[entries.length - 1];
        setPerformanceMetrics(prev => ({ ...prev, fcp: fcp.startTime }));
      });
      fcpObserver.observe({ entryTypes: ['paint'] });

      // Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lcp = entries[entries.length - 1];
        setPerformanceMetrics(prev => ({ ...prev, lcp: lcp.startTime }));
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // First Input Delay
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const fid = entries[entries.length - 1] as any;
        setPerformanceMetrics(prev => ({ ...prev, fid: fid.processingStart - fid.startTime }));
      });
      fidObserver.observe({ entryTypes: ['first-input'] });

      // Cumulative Layout Shift
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const layoutShiftEntry = entry as any;
          if (!layoutShiftEntry.hadRecentInput) {
            clsValue += layoutShiftEntry.value;
          }
        }
        setPerformanceMetrics(prev => ({ ...prev, cls: clsValue }));
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });

      return () => {
        fcpObserver.disconnect();
        lcpObserver.disconnect();
        fidObserver.disconnect();
        clsObserver.disconnect();
      };
    }
  }, []);

  return performanceMetrics;
}; 