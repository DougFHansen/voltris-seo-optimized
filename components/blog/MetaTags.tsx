'use client';

import Head from 'next/head';

interface MetaTagsProps {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url: string;
  type?: string;
  author?: string;
  date?: string;
}

export default function MetaTags({
  title,
  description,
  keywords = [],
  image,
  url,
  type = 'website',
  author,
  date
}: MetaTagsProps) {
  const fullUrl = `https://voltris.com.br${url}`;
  const imageUrl = image ? `https://voltris.com.br${image}` : 'https://voltris.com.br/og-image.jpg';

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{title} | Voltris</title>
      <meta name="description" content={description} />
      {keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />

      {/* Article Specific Meta Tags */}
      {type === 'article' && (
        <>
          {author && <meta name="author" content={author} />}
          {date && <meta property="article:published_time" content={date} />}
        </>
      )}

      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />

      {/* Structured Data JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': type === 'article' ? 'BlogPosting' : 'WebPage',
            'mainEntityOfPage': {
              '@type': 'WebPage',
              '@id': fullUrl
            },
            'headline': title,
            'description': description,
            'image': imageUrl,
            'author': {
              '@type': 'Person',
              'name': author || 'Equipe VOLTRIS'
            },
            'publisher': {
              '@type': 'Organization',
              'name': 'VOLTRIS',
              'logo': {
                '@type': 'ImageObject',
                'url': 'https://voltris.com.br/logo.png'
              }
            },
            'datePublished': date,
            'dateModified': date
          })
        }}
      />
    </Head>
  );
} 