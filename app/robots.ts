import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard/',
          '/restricted-area-admin/',
          '/api/',
          '/auth/',
          '/admin/',
          '/private/',
          '*.json',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/dashboard/',
          '/restricted-area-admin/',
          '/api/',
          '/auth/',
          '/admin/',
          '/private/',
        ],
      },
      {
        userAgent: 'bingbot',
        allow: '/',
        disallow: [
          '/dashboard/',
          '/restricted-area-admin/',
          '/api/',
          '/auth/',
          '/admin/',
          '/private/',
        ],
        crawlDelay: 1,
      },
      {
        userAgent: 'Slurp', // Yahoo
        allow: '/',
        disallow: [
          '/dashboard/',
          '/restricted-area-admin/',
          '/api/',
          '/auth/',
          '/admin/',
          '/private/',
        ],
        crawlDelay: 1,
      },
    ],
    sitemap: 'https://voltris.com.br/sitemap.xml',
    host: 'https://voltris.com.br',
  }
}