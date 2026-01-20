import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = 'https://voltris.com.br';
  
  // Images relevant for SEO
  const images = [
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
    },
    {
      loc: `${baseUrl}/logopwa.webp`,
      title: 'Logo PWA VOLTRIS',
      caption: 'Logo para Progressive Web App da VOLTRIS'
    },
    {
      loc: `${baseUrl}/about-img.webp`,
      title: 'Imagem Sobre a Empresa',
      caption: 'Imagem ilustrativa da equipe e serviços da VOLTRIS'
    }
  ];

  // Generate XML
  const xmlImages = images.map(img => `
    <url>
      <loc>${img.loc}</loc>
      <image:image>
        <image:loc>${img.loc}</image:loc>
        <image:title><![CDATA[${img.title}]]></image:title>
        <image:caption><![CDATA[${img.caption}]]></image:caption>
      </image:image>
    </url>
  `).join('');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  ${xmlImages}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}