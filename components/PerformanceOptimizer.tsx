'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

interface PerformanceOptimizerProps {
  children: React.ReactNode;
  preloadUrls?: string[];
  criticalResources?: string[];
}

export default function PerformanceOptimizer({ 
  children, 
  preloadUrls = [], 
  criticalResources = [] 
}: PerformanceOptimizerProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Preload critical resources
    preloadUrls.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = url;
      link.as = getResourceType(url);
      document.head.appendChild(link);
    });

    // Preload critical CSS and JS
    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource;
      link.as = getResourceType(resource);
      document.head.appendChild(link);
    });

    // Lazy load images
    const lazyImages = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          img.src = img.dataset.src || '';
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    });

    lazyImages.forEach(img => imageObserver.observe(img));

    // Lazy load components
    const lazyComponents = document.querySelectorAll('[data-lazy]');
    const componentObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const component = entry.target as HTMLElement;
          component.classList.remove('lazy-component');
          componentObserver.unobserve(component);
        }
      });
    });

    lazyComponents.forEach(component => componentObserver.observe(component));

    // Resource hints optimization
    optimizeResourceHints();

    // Service Worker registration
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('SW registered: ', registration);
        })
        .catch(registrationError => {
          console.log('SW registration failed: ', registrationError);
        });
    }

    // Performance monitoring for Google Analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
          if (perfData) {
            (window as any).gtag('event', 'timing_complete', {
              name: 'load',
              value: Math.round(perfData.loadEventEnd - perfData.loadEventStart),
              event_category: 'Performance'
            });
          }
        }, 0);
      });
    }

    setIsLoading(false);

    return () => {
      imageObserver.disconnect();
      componentObserver.disconnect();
    };
  }, [preloadUrls, criticalResources]);

  const getResourceType = (url: string): string => {
    if (url.endsWith('.css')) return 'style';
    if (url.endsWith('.js')) return 'script';
    if (url.match(/\.(jpg|jpeg|png|webp|avif|gif|svg)$/i)) return 'image';
    if (url.endsWith('.woff2') || url.endsWith('.woff') || url.endsWith('.ttf')) return 'font';
    return 'fetch';
  };

  const optimizeResourceHints = () => {
    // DNS prefetch for external domains
    const externalDomains = [
      'fonts.googleapis.com',
      'fonts.gstatic.com',
      'cdnjs.cloudflare.com',
      'www.googletagmanager.com',
      'pagead2.googlesyndication.com',
      'www.google-analytics.com',
    ];

    externalDomains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = `//${domain}`;
      document.head.appendChild(link);
    });

    // Preconnect for critical domains
    const criticalDomains = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
      'https://cdnjs.cloudflare.com',
    ];

    criticalDomains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = domain;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });
  };

  // Performance optimization styles
  const performanceStyles = `
    .lazy {
      opacity: 0;
      transition: opacity 0.3s ease-in-out;
    }
    
    .lazy.loaded {
      opacity: 1;
    }
    
    .lazy-component {
      opacity: 0;
      transform: translateY(20px);
      transition: all 0.5s ease-out;
    }
    
    .lazy-component.loaded {
      opacity: 1;
      transform: translateY(0);
    }
    
    /* Critical CSS for above-the-fold content */
    .critical-content {
      content-visibility: auto;
      contain-intrinsic-size: 0 500px;
    }
    
    /* Optimize paint and layout */
    .optimize-paint {
      will-change: transform;
      transform: translateZ(0);
    }
    
    /* Reduce layout shifts */
    .prevent-shift {
      aspect-ratio: 16/9;
      width: 100%;
      height: auto;
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: performanceStyles }} />
      {children}
    </>
  );
}

// Hook para lazy loading
export function useLazyLoad<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            element.classList.add('loaded');
            observer.unobserve(element);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, []);

  return ref;
}

// Componente para lazy loading de imagens
export function LazyImage({ 
  src = '', 
  alt = '', 
  className = '', 
  width = 320, 
  height = 180, 
  ...props 
}: React.ImgHTMLAttributes<HTMLImageElement> & { width?: number, height?: number }) {
  const imgRef = useLazyLoad<HTMLImageElement>();

  return (
    <Image
      ref={imgRef as any}
      src={typeof src === 'string' ? src : ''}
      alt={typeof alt === 'string' ? alt : ''}
      width={typeof width === 'number' ? width : 320}
      height={typeof height === 'number' ? height : 180}
      className={`lazy ${className}`}
      loading="lazy"
      {...props}
    />
  );
}

// Componente para lazy loading de componentes
export function LazyComponent({ 
  children, 
  className = '', 
  ...props 
}: React.HTMLAttributes<HTMLDivElement>) {
  const componentRef = useLazyLoad<HTMLDivElement>();

  return (
    <div
      ref={componentRef}
      className={`lazy-component ${className}`}
      {...props}
    >
      {children}
    </div>
  );
} 