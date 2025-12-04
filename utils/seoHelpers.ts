import { Metadata } from 'next';

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
}

export function generateMetadata(config: SEOConfig): Metadata {
  const baseUrl = 'https://voltris.com.br';
  const defaultImage = 'https://voltris.com.br/logo.png';
  
  return {
    title: config.title,
    description: config.description,
    keywords: config.keywords || [
      'suporte técnico remoto',
      'manutenção de computador',
      'criação de sites',
      'otimização de Windows',
      'formatação de computador',
      'remoção de vírus',
      'instalação de programas',
      'suporte Windows',
      'manutenção remota',
      'tecnologia',
      'informática',
      'desenvolvimento web',
      'design de sites',
      'SEO',
      'marketing digital'
    ],
    authors: [{ name: config.author || "VOLTRIS" }],
    creator: "VOLTRIS",
    publisher: "VOLTRIS",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: config.url || '/',
    },
    openGraph: {
      type: config.type || 'website',
      locale: 'pt_BR',
      url: `${baseUrl}${config.url || ''}`,
      siteName: 'VOLTRIS',
      title: config.title,
      description: config.description,
      images: [
        {
          url: config.image || defaultImage,
          width: 1200,
          height: 630,
          alt: config.title,
        },
      ],
      publishedTime: config.publishedTime,
      modifiedTime: config.modifiedTime,
      authors: config.author ? [config.author] : undefined,
      section: config.section,
      tags: config.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: config.title,
      description: config.description,
      images: [config.image || defaultImage],
      creator: '@voltris',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: 'googlee3ce0f951f1010fe',
    },
    category: 'technology',
  };
}

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "VOLTRIS",
    "url": "https://voltris.com.br",
    "logo": "https://voltris.com.br/logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+55-11-99671-6235",
      "contactType": "customer service",
      "areaServed": "BR",
      "availableLanguage": ["Portuguese", "English"]
    }
  };
}

export function generateLocalBusinessSchema(config: {
  name: string;
  description: string;
  services?: Array<{ name: string; description: string }>;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": config.name,
    "description": config.description,
    "image": "https://voltris.com.br/logo.png",
    "logo": "https://voltris.com.br/logo.png",
    "@id": "https://voltris.com.br",
    "url": "https://voltris.com.br",
    "telephone": "+55-11-99671-6235",
    "email": "contato@voltris.com.br",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "BR",
      "addressRegion": "São Paulo",
      "addressLocality": "São Paulo"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "-23.5505",
      "longitude": "-46.6333"
    },
    "openingHours": "Mo-Su 08:00-22:00",
    "priceRange": "R$ 29,90 - R$ 997,90",
    "paymentAccepted": ["Credit Card", "Debit Card", "PIX", "Bank Transfer"],
    "currenciesAccepted": "BRL",
    "serviceArea": {
      "@type": "Country",
      "name": "Brasil"
    },
    "areaServed": [
      "São Paulo", "Rio de Janeiro", "Minas Gerais", "Paraná", "Bahia", "Brasil"
    ],
    "hasMap": "https://goo.gl/maps/2Qw6Qw6Qw6Qw6Qw6A",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+55-11-99671-6235",
      "email": "contato@voltris.com.br",
      "contactType": "customer service",
      "areaServed": "BR"
    },
    "sameAs": [
      "https://www.instagram.com/voltris.com.br"
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "120"
    },
    "review": [
      {
        "@type": "Review",
        "author": { "@type": "Person", "name": "Ana Silva" },
        "datePublished": "2024-06-01",
        "reviewBody": "Ótimo atendimento, resolveu meu problema rapidamente!",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5"
        }
      }
    ],
    ...(config.services && {
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Serviços de Suporte Técnico",
        "itemListElement": config.services.map(service => ({
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": service.name,
            "description": service.description
          }
        }))
      }
    })
  };
}

export function generateBreadcrumbSchema(breadcrumbs: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": `https://voltris.com.br${crumb.url}`
    }))
  };
}

export function generateArticleSchema(config: {
  title: string;
  description: string;
  publishedTime: string;
  modifiedTime?: string;
  author: string;
  image?: string;
  section?: string;
  tags?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": config.title,
    "description": config.description,
    "image": config.image || "https://voltris.com.br/logo.png",
    "author": {
      "@type": "Person",
      "name": config.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "VOLTRIS",
      "logo": {
        "@type": "ImageObject",
        "url": "https://voltris.com.br/logo.png"
      }
    },
    "datePublished": config.publishedTime,
    "dateModified": config.modifiedTime || config.publishedTime,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://voltris.com.br"
    },
    ...(config.section && { "articleSection": config.section }),
    ...(config.tags && { "keywords": config.tags.join(", ") })
  };
}

export function generateWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "VOLTRIS",
    "url": "https://voltris.com.br",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://voltris.com.br/?s={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };
} 