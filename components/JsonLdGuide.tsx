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
  image = 'https://voltris.com.br/logo.png',
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
  const finalUrl = url || `https://voltris.com.br${pathname}`;
  
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
      step: steps.map((step, index) => ({
        '@type': 'HowToStep',
        position: index + 1,
        name: step.name,
        text: step.text,
        image: 'https://voltris.com.br/logo.png'
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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
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
