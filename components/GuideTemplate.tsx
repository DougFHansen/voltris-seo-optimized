import { Metadata } from 'next';
import { GuideTemplateClient, GuideTemplateProps, ContentSection, RelatedGuide, SummaryTableItem } from './GuideTemplateClient';

// Re-export types if needed by consumers (though usually page.tsx doesn't need them explicitely)
export type { GuideTemplateProps, ContentSection, RelatedGuide, SummaryTableItem };

const BASE_URL = 'https://voltris.com.br';

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
    },
    twitter: {
      card: "summary_large_image",
      title,
      description
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
    },
  };
}

/**
 * Server Component wrapper for the Guide Template.
 * Passes all props down to the Client Component which handles the interactive UI.
 */
export function GuideTemplate(props: GuideTemplateProps) {
  return <GuideTemplateClient {...props} />;
}