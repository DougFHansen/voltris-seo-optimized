'use client';

import Script from 'next/script';
import { generateSoftwareApplicationSchema } from '../utils/seo-structured-data';

interface SoftwareApplicationSchemaProps {
  name: string;
  description: string;
  url: string;
  applicationCategory?: string;
  operatingSystem?: string;
  offers?: {
    price: string;
    priceCurrency: string;
    availability: string;
  };
  features?: string[];
  softwareVersion?: string;
  datePublished?: string;
  dateModified?: string;
}

export default function SoftwareApplicationSchema({
  name,
  description,
  url,
  applicationCategory = 'GameApplication',
  operatingSystem = 'Windows',
  offers = {
    price: '0',
    priceCurrency: 'BRL',
    availability: 'https://schema.org/InStock'
  },
  features = [],
  softwareVersion = '1.0.0.9',
  datePublished = '2024-01-01',
  dateModified = new Date().toISOString()
}: SoftwareApplicationSchemaProps) {
  const schema = generateSoftwareApplicationSchema({
    name,
    description,
    url,
    applicationCategory,
    operatingSystem,
    offers,
    features,
    softwareVersion,
    datePublished,
    dateModified
  });

  return (
    <Script
      id="software-application-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      strategy="afterInteractive"
    />
  );
}

interface FAQSchemaProps {
  faqItems: Array<{
    question: string;
    answer: string;
  }>;
}

export function FAQSchema({ faqItems }: FAQSchemaProps) {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer.replace(/<[^>]*>/g, '') // Remover tags HTML da resposta
      }
    }))
  };

  return (
    <Script
      id="faq-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      strategy="afterInteractive"
    />
  );
}