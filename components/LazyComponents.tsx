import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Componente de loading para lazy components
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-4">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8B31FF]"></div>
  </div>
);

// Lazy load para componentes pesados
export const LazyReviewsSlider = dynamic(
  () => import('./ReviewsSlider'),
  {
    loading: () => <LoadingSpinner />,
    ssr: false
  }
);

export const LazyBlogCarousel = dynamic(
  () => import('./blog/PostsCarousel'),
  {
    loading: () => <LoadingSpinner />,
    ssr: false
  }
);

export const LazyNewsletterForm = dynamic(
  () => import('./NewsletterForm'),
  {
    loading: () => <LoadingSpinner />,
    ssr: true
  }
);

export const LazyPWAInstall = dynamic(
  () => import('./PWAInstall'),
  {
    loading: () => <LoadingSpinner />,
    ssr: false
  }
);

export const LazyGoogleAnalytics = dynamic(
  () => import('./GoogleAnalytics'),
  {
    loading: () => <LoadingSpinner />,
    ssr: false
  }
);

// Wrapper para componentes lazy com Suspense
export const LazyComponent = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<LoadingSpinner />}>
    {children}
  </Suspense>
); 