import React from 'react';

interface SEOStructuredDataProps {
  type: 'organization' | 'localBusiness' | 'article' | 'breadcrumb' | 'website';
  data: any;
}

export default function SEOStructuredData({ type, data }: SEOStructuredDataProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data)
      }}
    />
  );
}

// Componente específico para Organization
export function OrganizationSchema() {
  const data = {
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

  return <SEOStructuredData type="organization" data={data} />;
}

// Componente específico para LocalBusiness
export function LocalBusinessSchema({ services }: { services?: Array<{ name: string; description: string }> }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "VOLTRIS - Suporte Técnico Remoto e Criação de Sites Profissionais",
    "description": "Especialistas em suporte técnico remoto, criação de sites e soluções digitais para todo o Brasil.",
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
    ...(services && {
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Serviços de Suporte Técnico",
        "itemListElement": services.map((service, index) => ({
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": service.name,
            "description": service.description
          },
          "position": index + 1
        }))
      }
    })
  };

  return <SEOStructuredData type="localBusiness" data={data} />;
}

// Componente específico para WebSite
export function WebSiteSchema() {
  const data = {
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

  return <SEOStructuredData type="website" data={data} />;
}

// Componente específico para Breadcrumb
export function BreadcrumbSchema({ breadcrumbs }: { breadcrumbs: Array<{ name: string; url: string }> }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": `https://voltris.com.br${crumb.url}`
    }))
  };

  return <SEOStructuredData type="breadcrumb" data={data} />;
}

// Componente específico para FAQPages
export function FAQSchema({ faqItems }: { faqItems: Array<{ question: string; answer: string }> }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };

  return <SEOStructuredData type="article" data={data} />;
} 