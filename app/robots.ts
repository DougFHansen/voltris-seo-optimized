import { MetadataRoute } from 'next'

/**
 * Technical SEO Control: robots.ts
 * Configured for maximum visibility to indexable content while
 * strictly forbidding non-existent or administrative paths.
 */
export default function robots(): MetadataRoute.Robots {
  const domain = 'https://www.voltris.com.br';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard/',
          '/api/',
          '/admin/',
          '/restricted-area-admin/',
          '/auth/',
          '/private/',
          '/debug/',
          '/debug-commands',
          '/debug-link',
          '/test-commands',
          '/blog/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/dashboard/',
          '/restricted-area-admin/',
          '/auth/',
          '/private/',
          '/debug/',
          '/debug-commands',
          '/debug-link',
          '/test-commands',
          '/blog/',
        ],
      },
      {
        userAgent: 'bingbot',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/dashboard/',
          '/restricted-area-admin/',
          '/auth/',
          '/private/',
          '/debug/',
          '/debug-commands',
          '/debug-link',
          '/test-commands',
          '/blog/',
        ],
      }
    ],
    sitemap: `${domain}/sitemap.xml`,
    host: domain,
  }
}