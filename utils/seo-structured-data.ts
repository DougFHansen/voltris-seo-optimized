import { Metadata } from 'next';

export interface BreadcrumbItem {
  name: string;
  href: string;
}

export function generateBreadcrumbJsonLd(breadcrumbs: BreadcrumbItem[]) {
  const itemListElement = breadcrumbs.map((breadcrumb, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: breadcrumb.name,
    item: `https://voltris.com.br${breadcrumb.href}`
  }));

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement
  };
}

export function generateArticleJsonLd({
  title,
  description,
  author,
  datePublished,
  dateModified,
  image,
  keywords
}: {
  title: string;
  description: string;
  author: string;
  datePublished: string;
  dateModified: string;
  image: string;
  keywords: string[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description,
    author: {
      '@type': 'Person',
      name: author,
      url: 'https://voltris.com.br'
    },
    publisher: {
      '@type': 'Organization',
      name: 'VOLTRIS',
      logo: {
        '@type': 'ImageObject',
        url: 'https://voltris.com.br/logo.png'
      }
    },
    datePublished: datePublished,
    dateModified: dateModified,
    image: image,
    keywords: keywords,
    articleBody: description,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': 'https://voltris.com.br'
    }
  };
}

export function generateWebsiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'VOLTRIS',
    url: 'https://voltris.com.br',
    description: 'Suporte técnico remoto especializado em Windows e criação de sites profissionais',
    publisher: {
      '@type': 'Organization',
      name: 'VOLTRIS',
      logo: {
        '@type': 'ImageObject',
        url: 'https://voltris.com.br/logo.png'
      }
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://voltris.com.br/buscar?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  };
}