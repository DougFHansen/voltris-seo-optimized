'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

interface JsonLdGuideProps {
  title: string;
  description: string;
  url?: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  author?: string;
  estimatedTime?: string;
  difficulty?: string;
  category?: string;
  faqItems?: Array<{ question: string; answer: string }>;
  steps?: Array<{ name: string; text: string }>;
}

export default function JsonLdGuide({
  title,
  description,
  url,
  image = 'https://www.voltris.com.br/logo.png',
  datePublished = new Date().toISOString(),
  dateModified = new Date().toISOString(),
  author = 'VOLTRIS - Especialista em Performance',
  estimatedTime,
  difficulty,
  category,
  faqItems,
  steps
}: JsonLdGuideProps) {
  const pathname = usePathname();
  const finalUrl = url || `https://www.voltris.com.br${pathname}`;
  
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: title,
    description,
    image,
    url: finalUrl,
    datePublished,
    dateModified,
    author: {
      '@type': 'Organization',
      name: 'VOLTRIS',
      url: 'https://www.voltris.com.br'
    },
    publisher: {
      '@type': 'Organization',
      name: 'VOLTRIS',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.voltris.com.br/logo.png'
      }
    },
    estimatedCost: {
      '@type': 'MonetaryAmount',
      currency: 'BRL',
      value: '0'
    },
    totalTime: estimatedTime ? `PT${estimatedTime}M` : 'PT10M',
    supply: [
      {
        '@type': 'HowToSupply',
        name: 'Computador com Windows 10/11'
      },
      {
        '@type': 'HowToSupply',
        name: 'Conexão com internet'
      }
    ],
    tool: [
      {
        '@type': 'HowToTool',
        name: 'Software de gravação'
      }
    ],
    ...(steps && steps.length > 0 && {
      "step": steps.map((step, index) => ({
        "@type": "HowToStep",
        "url": `https://www.voltris.com.br${pathname}/#section-${index}`,
        position: index + 1,
        name: step.name,
        text: step.text,
        image: 'https://www.voltris.com.br/logo.png'
      }))
    }),
    ...(category && {
      about: {
        '@type': 'Thing',
        name: category
      }
    }),
    ...(difficulty && {
      difficulty: difficulty === 'Iniciante' ? 'Easy' : difficulty === 'Intermediário' ? 'Medium' : 'Hard'
    })
  };

  // Adiciona FAQ Schema se houver itens de FAQ
  const faqSchema = faqItems && faqItems.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer
      }
    }))
  } : null;

  // Adiciona Article Schema para SEO
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    image,
    url: finalUrl,
    datePublished,
    dateModified,
    author: {
      '@type': 'Person',
      name: 'Doug FHansen',
      jobTitle: 'Especialista em Performance de PC',
      url: 'https://www.voltris.com.br'
    },
    publisher: {
      '@type': 'Organization',
      name: 'VOLTRIS',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.voltris.com.br/logo.png'
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': finalUrl
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
    </>
  );
}
