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
      },
      {
        userAgent: 'Slurp',
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
    ],
    sitemap: 'https://voltris.com.br/sitemap.xml',
    host: 'https://voltris.com.br',
  }
}