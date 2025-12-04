import React from 'react';
import Head from 'next/head';

interface AdvancedSEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product';
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    section?: string;
    tags?: string[];
  };
  product?: {
    price?: string;
    priceCurrency?: string;
    availability?: string;
    brand?: string;
    category?: string;
  };
  breadcrumbs?: Array<{
    name: string;
    url: string;
  }>;
  faq?: Array<{
    question: string;
    answer: string;
  }>;
  localBusiness?: {
    name: string;
    address: {
      streetAddress?: string;
      addressLocality?: string;
      addressRegion?: string;
      postalCode?: string;
      addressCountry?: string;
    };
    telephone?: string;
    email?: string;
    openingHours?: string;
    priceRange?: string;
  };
  service?: {
    name: string;
    description: string;
    provider: string;
    areaServed: string;
    serviceType: string;
  };
}

const AdvancedSEO: React.FC<AdvancedSEOProps> = ({
  title = "VOLTRIS - Suporte Técnico Remoto e Criação de Sites Profissionais",
  description = "Suporte técnico remoto especializado em Windows, criação de sites profissionais, otimização de computadores e manutenção de sistemas. Atendimento em todo Brasil, 100% online e seguro.",
  keywords = [],
  canonical,
  ogImage = "/logo.png",
  ogType = "website",
  article,
  product,
  breadcrumbs,
  faq,
  localBusiness,
  service
}) => {
  const fullTitle = title.includes('VOLTRIS') ? title : `${title} | VOLTRIS`;
  const fullDescription = description.length > 160 ? description.substring(0, 157) + '...' : description;
  const fullKeywords = [
    "suporte técnico remoto",
    "manutenção de computador",
    "criação de sites",
    "otimização de Windows",
    "formatação de computador",
    "remoção de vírus",
    "instalação de programas",
    "suporte Windows",
    "manutenção remota",
    "tecnologia",
    "informática",
    "desenvolvimento web",
    "design de sites",
    "SEO",
    "marketing digital",
    ...keywords
  ].join(', ');

  // Schema.org structured data
  const generateStructuredData = () => {
    const structuredData: any = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": fullTitle,
      "description": fullDescription,
      "url": canonical || "https://voltris.com.br",
      "mainEntity": {
        "@type": "Organization",
        "name": "VOLTRIS",
        "url": "https://voltris.com.br",
        "logo": "https://voltris.com.br/logo.png",
        "description": "Suporte técnico remoto especializado em Windows, criação de sites profissionais, otimização de computadores e manutenção de sistemas.",
        "address": {
          "@type": "PostalAddress",
          "addressCountry": "BR",
          "addressRegion": "São Paulo",
          "addressLocality": "São Paulo"
        },
        "contactPoint": {
          "@type": "ContactPoint",
          "contactType": "customer service",
          "availableLanguage": "Portuguese"
        },
        "sameAs": [
          "https://www.facebook.com/voltris",
          "https://www.instagram.com/voltris",
          "https://www.linkedin.com/company/voltris"
        ]
      }
    };

    // Adicionar dados de artigo se disponível
    if (article) {
      structuredData["@type"] = "Article";
      structuredData.publisher = {
        "@type": "Organization",
        "name": "VOLTRIS",
        "logo": {
          "@type": "ImageObject",
          "url": "https://voltris.com.br/logo.png"
        }
      };
      if (article.publishedTime) structuredData.datePublished = article.publishedTime;
      if (article.modifiedTime) structuredData.dateModified = article.modifiedTime;
      if (article.author) structuredData.author = { "@type": "Person", "name": article.author };
      if (article.section) structuredData.articleSection = article.section;
      if (article.tags) structuredData.keywords = article.tags.join(', ');
    }

    // Adicionar dados de produto se disponível
    if (product) {
      structuredData["@type"] = "Product";
      if (product.price) structuredData.offers = {
        "@type": "Offer",
        "price": product.price,
        "priceCurrency": product.priceCurrency || "BRL",
        "availability": product.availability || "https://schema.org/InStock"
      };
      if (product.brand) structuredData.brand = { "@type": "Brand", "name": product.brand };
      if (product.category) structuredData.category = product.category;
    }

    // Adicionar breadcrumbs se disponível
    if (breadcrumbs && breadcrumbs.length > 0) {
      structuredData.breadcrumb = {
        "@type": "BreadcrumbList",
        "itemListElement": breadcrumbs.map((item, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "name": item.name,
          "item": item.url
        }))
      };
    }

    // Adicionar FAQ se disponível
    if (faq && faq.length > 0) {
      structuredData.mainEntity = {
        "@type": "FAQPage",
        "mainEntity": faq.map(item => ({
          "@type": "Question",
          "name": item.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": item.answer
          }
        }))
      };
    }

    // Adicionar dados de negócio local se disponível
    if (localBusiness) {
      structuredData["@type"] = "LocalBusiness";
      structuredData.name = localBusiness.name;
      if (localBusiness.address) structuredData.address = {
        "@type": "PostalAddress",
        ...localBusiness.address
      };
      if (localBusiness.telephone) structuredData.telephone = localBusiness.telephone;
      if (localBusiness.email) structuredData.email = localBusiness.email;
      if (localBusiness.openingHours) structuredData.openingHours = localBusiness.openingHours;
      if (localBusiness.priceRange) structuredData.priceRange = localBusiness.priceRange;
    }

    // Adicionar dados de serviço se disponível
    if (service) {
      structuredData["@type"] = "Service";
      structuredData.name = service.name;
      structuredData.description = service.description;
      structuredData.provider = {
        "@type": "Organization",
        "name": service.provider
      };
      structuredData.areaServed = {
        "@type": "Country",
        "name": service.areaServed
      };
      structuredData.serviceType = service.serviceType;
    }

    return structuredData;
  };

  return (
    <Head>
      {/* Meta tags básicas */}
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />
      <meta name="keywords" content={fullKeywords} />
      <meta name="author" content="VOLTRIS" />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="bingbot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      
      {/* Canonical */}
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* Open Graph */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:url" content={canonical || "https://voltris.com.br"} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="VOLTRIS" />
      <meta property="og:locale" content="pt_BR" />
      
      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:creator" content="@voltris" />
      <meta name="twitter:site" content="@voltris" />
      
      {/* Meta tags específicas para artigo */}
      {article && (
        <>
          {article.publishedTime && <meta property="article:published_time" content={article.publishedTime} />}
          {article.modifiedTime && <meta property="article:modified_time" content={article.modifiedTime} />}
          {article.author && <meta property="article:author" content={article.author} />}
          {article.section && <meta property="article:section" content={article.section} />}
          {article.tags && article.tags.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
        </>
      )}
      
      {/* Meta tags específicas para produto */}
      {product && (
        <>
          {product.price && <meta property="product:price:amount" content={product.price} />}
          {product.priceCurrency && <meta property="product:price:currency" content={product.priceCurrency} />}
          {product.availability && <meta property="product:availability" content={product.availability} />}
          {product.brand && <meta property="product:brand" content={product.brand} />}
          {product.category && <meta property="product:category" content={product.category} />}
        </>
      )}
      
      {/* Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateStructuredData())
        }}
      />
      
      {/* Preload de recursos críticos */}
      <link rel="preload" as="image" href={ogImage} />
      
      {/* Meta tags de performance */}
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      <meta name="theme-color" content="#8B31FF" />
      <meta name="color-scheme" content="dark" />
      
      {/* Meta tags de segurança */}
      <meta name="referrer" content="strict-origin-when-cross-origin" />
      <meta name="format-detection" content="telephone=no" />
      
      {/* Meta tags de localização */}
      <meta name="geo.region" content="BR" />
      <meta name="geo.country" content="Brasil" />
      <meta name="language" content="Portuguese" />
      
      {/* Meta tags de distribuição */}
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />
      <meta name="revisit-after" content="7 days" />
    </Head>
  );
};

export default AdvancedSEO; 