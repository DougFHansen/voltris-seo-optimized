import { Metadata } from 'next';
import { GuideTemplateClient, GuideTemplateProps, ContentSection, RelatedGuide, SummaryTableItem } from './GuideTemplateClient';

// Re-export types if needed by consumers (though usually page.tsx doesn't need them explicitely)
export type { GuideTemplateProps, ContentSection, RelatedGuide, SummaryTableItem };

/**
 * Generates metadata for the guide pages.
 * This is a pure function running on the server (since this file is not 'use client').
 */
export function createGuideMetadata(title: string, description: string, keywords: string[]): Metadata {
  return {
    title: `${title} | VOLTRIS`,
    description,
    keywords,
    openGraph: {
      title: `${title} | VOLTRIS`,
      description,
      type: "article",
      locale: "pt_BR"
    },
    twitter: {
      card: "summary_large_image",
      title,
      description
    }
  };
}

/**
 * Server Component wrapper for the Guide Template.
 * Passes all props down to the Client Component which handles the interactive UI.
 */
export function GuideTemplate(props: GuideTemplateProps) {
  return <GuideTemplateClient {...props} />;
}