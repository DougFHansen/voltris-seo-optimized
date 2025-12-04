  {/* Canonical Tag */}
  <link rel="canonical" href={fullUrl} />

  {/* Structured Data JSON-LD */}
  <script type="application/ld+json" dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
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
  }} /> 