export const imageOptimization = {
  // Configurações para otimização de imagens
  formats: ['image/webp', 'image/avif'],
  quality: 85,
  sizes: {
    thumbnail: 150,
    small: 300,
    medium: 600,
    large: 1200,
    xlarge: 1920,
  },
  // Configurações para lazy loading
  lazyLoading: true,
  // Configurações para placeholder
  placeholder: 'blur',
  blurDataURL: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=',
};

// Função para gerar URLs otimizadas de imagens
export const getOptimizedImageUrl = (
  src: string,
  width: number,
  quality: number = 85,
  format: 'webp' | 'avif' | 'jpeg' = 'webp'
) => {
  // Se for uma imagem externa, retorna a URL original
  if (src.startsWith('http')) {
    return src;
  }
  
  // Para imagens locais, retorna a URL otimizada
  return `${src}?w=${width}&q=${quality}&f=${format}`;
};

// Função para gerar srcset para imagens responsivas
export const getImageSrcSet = (src: string, sizes: number[] = [300, 600, 900, 1200]) => {
  return sizes
    .map(size => `${getOptimizedImageUrl(src, size)} ${size}w`)
    .join(', ');
}; 