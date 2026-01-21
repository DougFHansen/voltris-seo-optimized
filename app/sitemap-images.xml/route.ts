import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = 'https://voltris.com.br';

  // Map pages to images
  const pages = [
    {
      loc: `${baseUrl}/`,
      images: [
        {
          loc: `${baseUrl}/logo.png`,
          title: 'Logo Principal VOLTRIS',
          caption: 'Logo oficial da VOLTRIS para identidade visual e Google Snippet'
        },
        {
          loc: `${baseUrl}/logo-v2.webp`,
          title: 'Logo VOLTRIS Versão 2',
          caption: 'Logo atualizado da VOLTRIS em formato otimizado WebP'
        },
        {
          loc: `${baseUrl}/logogoogle.webp`,
          title: 'Logo Google VOLTRIS',
          caption: 'Logo otimizado para integração com Google Services'
        }
      ]
    },
    {
      loc: `${baseUrl}/about`,
      images: [
        {
          loc: `${baseUrl}/about-img.webp`,
          title: 'Imagem Sobre a Empresa',
          caption: 'Imagem ilustrativa da equipe e serviços da VOLTRIS'
        }
      ]
    }
  ];

  // Generate XML
  const xmlContent = pages.map(page => `
    <url>
      <loc>${page.loc}</loc>
      ${page.images.map(img => `
      <image:image>
        <image:loc>${img.loc}</image:loc>
        <image:title><![CDATA[${img.title}]]></image:title>
        <image:caption><![CDATA[${img.caption}]]></image:caption>
      </image:image>
      `).join('')}
    </url>
  `).join('');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  ${xmlContent}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}