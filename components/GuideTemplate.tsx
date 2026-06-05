import { Metadata } from 'next';
import GuideTemplateServer from './GuideTemplateServer';
import GuideTemplateClient from './GuideTemplateClient';
import type { ContentSection, RelatedGuide, SummaryTableItem, ExternalReference } from './GuideTemplateServer';
import { GuideMetadata } from '@/lib/guides';

// Re-export types if needed by consumers
export type { ContentSection, RelatedGuide, SummaryTableItem, ExternalReference };

const BASE_URL = 'https://www.voltris.com.br';

/**
 * Generates metadata for the guide pages.
 * slug: path segment of the guide (e.g. 'formatacao-windows') — used for canonical to fix indexation.
 */
export function createGuideMetadata(slug: string, title: string, description: string, keywords: string[]): Metadata {
  const canonical = `${BASE_URL}/guias/${slug}`;
  return {
    title: `${title} | VOLTRIS`,
    description,
    keywords,
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: `/guias/${slug}`,
    },
    openGraph: {
      title: `${title} | VOLTRIS`,
      description,
      type: "article",
      locale: "pt_BR",
      url: canonical,
      siteName: "VOLTRIS",
      images: [
        {
          url: `${BASE_URL}/logo.png`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${BASE_URL}/logo.png`],
      creator: "@voltris",
      site: "@voltris",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { 
        index: true, 
        follow: true, 
        'max-image-preview': 'large', 
        'max-snippet': -1, 
        'max-video-preview': -1
      },
    },
    verification: {
      google: 'fThNqPzp5iyhs4616KxDU0Zit0vLiz3XaQHLIilW5p4',
      other: {
        'msvalidate.01': 'B3EA85422343FBF303FC4E7243937093',
      },
    },
    category: 'technology',
    authors: [{ name: 'VOLTRIS - Especialista em Performance' }],
    creator: 'VOLTRIS',
    publisher: 'VOLTRIS',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
  };
}

/**
 * Server Component wrapper for the Guide Template.
 * Enterprise-grade hybrid architecture:
 * - GuideTemplateServer: Renders SEO content on server (H1, article, FAQ, schema markup)
 * - GuideTemplateClient: Adds interactivity on client (progress bar, floating buttons, animations)
 * 
 * This ensures Google receives complete HTML with all SEO content while preserving
 * premium UI/UX with animations and interactivity.
 */
export function GuideTemplate(props: {
  title: string;
  description: string;
  keywords: string[];
  estimatedTime: string;
  difficultyLevel: string;
  contentSections: ContentSection[];
  relatedGuides?: RelatedGuide[];
  author?: string;
  authorBio?: string;
  authorCredentials?: string[];
  lastUpdated?: string;
  summaryTable?: SummaryTableItem[];
  faqItems?: Array<{ question: string; answer: string }>;
  externalReferences?: ExternalReference[];
  advancedContentSections?: ContentSection[];
  additionalContentSections?: ContentSection[];
  showVoltrisOptimizerCTA?: boolean;
  keyPoints?: string[];
  warningNote?: string;
  isHowTo?: boolean;
  pathname: string;
  category?: string;
  allGuides?: GuideMetadata[];
  quickSolution?: string;
  aiSummary?: string; // Nova prop para AEO/GEO - Answer-First Block
}) {
  return (
    <>
      {/* Server Component: Renders SEO content on server */}
      <GuideTemplateServer {...props} />
      
      {/* Client Component: Adds interactivity (progress bar, floating buttons, animations) */}
      <GuideTemplateClient 
        title={props.title} 
        showVoltrisOptimizerCTA={props.showVoltrisOptimizerCTA} 
      />
    </>
  );
}
