// Utilitários para otimização de performance

// Compressão de dados
export const compressData = async (data: any): Promise<string> => {
  if (typeof data === 'string') {
    return data;
  }
  
  const jsonString = JSON.stringify(data);
  
  // Compressão simples para strings longas
  if (jsonString.length > 1000) {
    try {
      // Usar compressão nativa se disponível
      if ('CompressionStream' in window) {
        const stream = new CompressionStream('gzip');
        const writer = stream.writable.getWriter();
        const reader = stream.readable.getReader();
        
        const encoder = new TextEncoder();
        const encoded = encoder.encode(jsonString);
        
        await writer.write(encoded);
        await writer.close();
        
        const chunks: Uint8Array[] = [];
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          chunks.push(value);
        }
        
        const compressed = new Uint8Array(chunks.reduce((acc, chunk) => acc + chunk.length, 0));
        let offset = 0;
        for (const chunk of chunks) {
          compressed.set(chunk, offset);
          offset += chunk.length;
        }
        
        return btoa(String.fromCharCode(...compressed));
      }
    } catch (error) {
      console.warn('Compression failed, using original data:', error);
    }
  }
  
  return jsonString;
};

// Descompressão de dados
export const decompressData = async (compressedData: string): Promise<any> => {
  try {
    // Verificar se é JSON simples
    if (compressedData.startsWith('{') || compressedData.startsWith('[')) {
      return JSON.parse(compressedData);
    }
    
    // Tentar descompressão
    if ('DecompressionStream' in window) {
      const stream = new DecompressionStream('gzip');
      const writer = stream.writable.getWriter();
      const reader = stream.readable.getReader();
      
      const compressed = new Uint8Array(
        atob(compressedData).split('').map(char => char.charCodeAt(0))
      );
      
      await writer.write(compressed);
      await writer.close();
      
      const chunks: Uint8Array[] = [];
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
      }
      
      const decompressed = new Uint8Array(chunks.reduce((acc, chunk) => acc + chunk.length, 0));
      let offset = 0;
      for (const chunk of chunks) {
        decompressed.set(chunk, offset);
        offset += chunk.length;
      }
      
      const decoder = new TextDecoder();
      const jsonString = decoder.decode(decompressed);
      return JSON.parse(jsonString);
    }
  } catch (error) {
    console.warn('Decompression failed:', error);
  }
  
  return compressedData;
};

// Cache otimizado
export class PerformanceCache {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  private maxSize = 100;
  
  constructor(maxSize = 100) {
    this.maxSize = maxSize;
  }
  
  set(key: string, data: any, ttl: number = 3600000): void {
    // Limpar cache se necessário
    if (this.cache.size >= this.maxSize) {
      this.cleanup();
    }
    
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }
  
  get(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }
  
  has(key: string): boolean {
    return this.get(key) !== null;
  }
  
  delete(key: string): boolean {
    return this.cache.delete(key);
  }
  
  clear(): void {
    this.cache.clear();
  }
  
  private cleanup(): void {
    const now = Date.now();
    const entries = Array.from(this.cache.entries());
    
    // Remover itens expirados
    entries.forEach(([key, item]) => {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key);
      }
    });
    
    // Se ainda estiver cheio, remover itens mais antigos
    if (this.cache.size >= this.maxSize) {
      const sortedEntries = entries
        .filter(([_, item]) => now - item.timestamp <= item.ttl)
        .sort((a, b) => a[1].timestamp - b[1].timestamp);
      
      const toRemove = sortedEntries.slice(0, this.cache.size - this.maxSize + 1);
      toRemove.forEach(([key]) => this.cache.delete(key));
    }
  }
  
  size(): number {
    return this.cache.size;
  }
  
  keys(): string[] {
    return Array.from(this.cache.keys());
  }
}

// Métricas de performance
export class PerformanceMetrics {
  private metrics: Map<string, number[]> = new Map();
  
  startTimer(name: string): () => void {
    const start = performance.now();
    return () => this.endTimer(name, start);
  }
  
  endTimer(name: string, start: number): void {
    const duration = performance.now() - start;
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    this.metrics.get(name)!.push(duration);
  }
  
  getAverage(name: string): number {
    const values = this.metrics.get(name);
    if (!values || values.length === 0) return 0;
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  }
  
  getMin(name: string): number {
    const values = this.metrics.get(name);
    if (!values || values.length === 0) return 0;
    return Math.min(...values);
  }
  
  getMax(name: string): number {
    const values = this.metrics.get(name);
    if (!values || values.length === 0) return 0;
    return Math.max(...values);
  }
  
  getCount(name: string): number {
    const values = this.metrics.get(name);
    return values ? values.length : 0;
  }
  
  clear(name?: string): void {
    if (name) {
      this.metrics.delete(name);
    } else {
      this.metrics.clear();
    }
  }
  
  getAllMetrics(): Record<string, { avg: number; min: number; max: number; count: number }> {
    const result: Record<string, { avg: number; min: number; max: number; count: number }> = {};
    
    for (const [name, values] of this.metrics.entries()) {
      result[name] = {
        avg: this.getAverage(name),
        min: this.getMin(name),
        max: this.getMax(name),
        count: this.getCount(name),
      };
    }
    
    return result;
  }
}

// Otimização de imagens
export const optimizeImage = async (
  file: File,
  options: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    format?: 'webp' | 'jpeg' | 'png';
  } = {}
): Promise<Blob> => {
  const {
    maxWidth = 1920,
    maxHeight = 1080,
    quality = 0.8,
    format = 'webp',
  } = options;
  
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Calcular dimensões mantendo proporção
      let { width, height } = img;
      
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      if (height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Desenhar imagem redimensionada
      ctx?.drawImage(img, 0, 0, width, height);
      
      // Converter para blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create blob'));
          }
        },
        `image/${format}`,
        quality
      );
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};

// Debounce para otimização de performance
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle para otimização de performance
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Preload de recursos
export const preloadResource = (url: string, type: 'image' | 'script' | 'style'): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (type === 'image') {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => reject(new Error(`Failed to preload image: ${url}`));
      img.src = url;
    } else if (type === 'script') {
      const script = document.createElement('script');
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to preload script: ${url}`));
      script.src = url;
      document.head.appendChild(script);
    } else if (type === 'style') {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.onload = () => resolve();
      link.onerror = () => reject(new Error(`Failed to preload style: ${url}`));
      link.href = url;
      document.head.appendChild(link);
    }
  });
};

// Detecção de conexão lenta
export const isSlowConnection = (): boolean => {
  if ('connection' in navigator) {
    const connection = (navigator as any).connection;
    return connection.effectiveType === 'slow-2g' || 
           connection.effectiveType === '2g' ||
           connection.effectiveType === '3g';
  }
  return false;
};

// Otimização baseada na conexão
export const getOptimizationLevel = (): 'high' | 'medium' | 'low' => {
  if (isSlowConnection()) {
    return 'low';
  }
  
  if ('deviceMemory' in navigator) {
    const memory = (navigator as any).deviceMemory;
    if (memory < 4) {
      return 'medium';
    }
  }
  
  return 'high';
};

// Lazy loading de scripts
export const loadScript = (src: string, async = true): Promise<void> => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = async;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.head.appendChild(script);
  });
};

// Otimização de CSS crítico
export const extractCriticalCSS = (): string => {
  const criticalSelectors = [
    'body', 'html', '.container', '.header', '.footer',
    '.btn', '.card', '.loading', '.error'
  ];
  
  const styles: string[] = [];
  
  // Extrair estilos críticos
  for (const selector of criticalSelectors) {
    const elements = document.querySelectorAll(selector);
    if (elements.length > 0) {
      const computedStyle = window.getComputedStyle(elements[0]);
      const importantProperties = [
        'display', 'position', 'width', 'height',
        'margin', 'padding', 'background', 'color',
        'font-family', 'font-size', 'font-weight'
      ];
      
      const styleRules: string[] = [];
      for (const prop of importantProperties) {
        const value = computedStyle.getPropertyValue(prop);
        if (value) {
          styleRules.push(`${prop}: ${value};`);
        }
      }
      
      if (styleRules.length > 0) {
        styles.push(`${selector} { ${styleRules.join(' ') } }`);
      }
    }
  }
  
  return styles.join('\n');
};

// Singleton para cache global
export const globalCache = new PerformanceCache(200);
export const performanceMetrics = new PerformanceMetrics(); 

// Função de registro para instrumentação
export const register = () => {
  if (typeof window !== 'undefined') {
    // Registrar métricas de performance no cliente
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'navigation') {
          const navEntry = entry as PerformanceNavigationTiming;
          console.log('Navigation Performance:', {
            dns: navEntry.domainLookupEnd - navEntry.domainLookupStart,
            tcp: navEntry.connectEnd - navEntry.connectStart,
            ttfb: navEntry.responseStart - navEntry.requestStart,
            domContentLoaded: navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart,
            load: navEntry.loadEventEnd - navEntry.loadEventStart,
          });
        }
      }
    });
    
    observer.observe({ entryTypes: ['navigation', 'paint', 'largest-contentful-paint'] });
  }
  
  if (typeof global !== 'undefined') {
    // Registrar métricas de performance no servidor
    const startTime = process.hrtime.bigint();
    
    process.on('exit', () => {
      const endTime = process.hrtime.bigint();
      const duration = Number(endTime - startTime) / 1000000; // Convert to milliseconds
      console.log(`Server uptime: ${duration}ms`);
    });
  }
}; 