import React, { Suspense, lazy, useState, useEffect } from 'react';
import { useLazyLoad } from '@/app/hooks/usePerformance';

interface LazyPageProps {
  component: React.ComponentType<any>;
  fallback?: React.ReactNode;
  threshold?: number;
  rootMargin?: string;
  className?: string;
  style?: React.CSSProperties;
}

const LazyPage: React.FC<LazyPageProps> = ({
  component: Component,
  fallback,
  threshold = 0.1,
  rootMargin = '50px',
  className = '',
  style,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { elementRef, isVisible } = useLazyLoad({
    threshold,
    rootMargin,
  });

  useEffect(() => {
    if (isVisible && !isLoaded) {
      setIsLoaded(true);
    }
  }, [isVisible, isLoaded]);

  const defaultFallback = (
    <div className="flex items-center justify-center min-h-[200px] bg-gray-100 rounded-lg">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );

  if (!isVisible) {
    return (
      <div
        ref={elementRef}
        className={`lazy-placeholder ${className}`}
        style={style}
      >
        {fallback || defaultFallback}
      </div>
    );
  }

  return (
    <div ref={elementRef} className={className} style={style}>
      <Suspense fallback={fallback || defaultFallback}>
        <Component />
      </Suspense>
    </div>
  );
};

// Hook para lazy loading de componentes
export const useLazyComponent = <T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback?: React.ReactNode
) => {
  const [Component, setComponent] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    importFunc()
      .then((module) => {
        setComponent(() => module.default);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err);
        setIsLoading(false);
      });
  }, [importFunc]);

  const LazyComponent = React.useMemo(() => {
    if (error) {
      return () => (
        <div className="flex items-center justify-center min-h-[200px] bg-red-50 rounded-lg">
          <div className="text-red-600 text-center">
            <p className="font-semibold">Erro ao carregar componente</p>
            <p className="text-sm">{error.message}</p>
          </div>
        </div>
      );
    }

    if (isLoading || !Component) {
      return () => fallback || (
        <div className="flex items-center justify-center min-h-[200px] bg-gray-100 rounded-lg">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    return Component;
  }, [Component, isLoading, error, fallback]);

  return LazyComponent;
};

// Componente para lazy loading com intersection observer
export const LazyLoadComponent: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
  threshold?: number;
  rootMargin?: string;
  className?: string;
  style?: React.CSSProperties;
}> = ({
  children,
  fallback,
  threshold = 0.1,
  rootMargin = '50px',
  className = '',
  style,
}) => {
  const { elementRef, isVisible } = useLazyLoad({
    threshold,
    rootMargin,
  });

  const defaultFallback = (
    <div className="flex items-center justify-center min-h-[200px] bg-gray-100 rounded-lg">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div
      ref={elementRef}
      className={`lazy-component ${className}`}
      style={style}
    >
      {isVisible ? children : (fallback || defaultFallback)}
    </div>
  );
};

// Hook para preload de componentes
export const usePreloadComponent = <T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>
) => {
  const preload = React.useCallback(() => {
    return importFunc();
  }, [importFunc]);

  return preload;
};

// Componente para carregamento progressivo
export const ProgressiveLoad: React.FC<{
  children: React.ReactNode;
  priority?: 'high' | 'medium' | 'low';
  className?: string;
  style?: React.CSSProperties;
}> = ({
  children,
  priority = 'medium',
  className = '',
  style,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadTime, setLoadTime] = useState(0);

  useEffect(() => {
    const startTime = performance.now();
    
    // Simula carregamento baseado na prioridade
    const delay = priority === 'high' ? 0 : priority === 'medium' ? 100 : 300;
    
    const timer = setTimeout(() => {
      setIsLoaded(true);
      setLoadTime(performance.now() - startTime);
    }, delay);

    return () => clearTimeout(timer);
  }, [priority]);

  if (!isLoaded) {
    return (
      <div
        className={`progressive-loading ${className}`}
        style={style}
      >
        <div className="flex items-center justify-center min-h-[200px] bg-gray-100 rounded-lg">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`progressive-loaded ${className}`}
      style={{
        ...style,
        animation: `fadeIn 0.3s ease-in-out`,
      }}
    >
      {children}
    </div>
  );
};

export default LazyPage; 