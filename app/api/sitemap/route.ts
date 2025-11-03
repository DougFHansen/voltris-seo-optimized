import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const baseUrl = 'https://voltris.com.br';
  
  // URLs principais do site
  const mainUrls = [
    {
      url: '/',
      lastmod: new Date().toISOString(),
      changefreq: 'daily',
      priority: '1.0'
    },
    {
      url: '/servicos',
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: '0.9'
    },
    {
      url: '/todos-os-servicos',
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: '0.9'
    },
    {
      url: '/todos-os-servicos/criacao-de-sites',
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: '0.8'
    },
    {
      url: '/todos-os-servicos/criacao-de-sites/plano-basico',
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: '0.8'
    },
    {
      url: '/todos-os-servicos/criacao-de-sites/plano-profissional',
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: '0.8'
    },
    {
      url: '/todos-os-servicos/criacao-de-sites/plano-empresarial',
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: '0.8'
    },
    {
      url: '/todos-os-servicos/instalacao-de-programas',
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: '0.8'
    },
    {
      url: '/todos-os-servicos/suporte-windows',
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: '0.8'
    },
    {
      url: '/blog',
      lastmod: new Date().toISOString(),
      changefreq: 'daily',
      priority: '0.8'
    },
    {
      url: '/about',
      lastmod: new Date().toISOString(),
      changefreq: 'monthly',
      priority: '0.7'
    },
    {
      url: '/faq',
      lastmod: new Date().toISOString(),
      changefreq: 'monthly',
      priority: '0.7'
    },
    {
      url: '/reviews',
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: '0.7'
    },
    {
      url: '/login',
      lastmod: new Date().toISOString(),
      changefreq: 'monthly',
      priority: '0.6'
    },
    {
      url: '/profile',
      lastmod: new Date().toISOString(),
      changefreq: 'monthly',
      priority: '0.6'
    },
    {
      url: '/dashboard',
      lastmod: new Date().toISOString(),
      changefreq: 'monthly',
      priority: '0.6'
    },
    {
      url: '/criadores-de-site',
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: '0.8'
    },
    {
      url: '/criar-site',
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: '0.8'
    },
    {
      url: '/formatacao',
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: '0.8'
    },
    {
      url: '/otimizacao-pc',
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: '0.8'
    },
    {
      url: '/instalacao-office',
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: '0.8'
    },
    {
      url: '/erros-jogos',
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: '0.8'
    },
    {
      url: '/tecnico-informatica',
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: '0.8'
    },
    {
      url: '/tecnico-informatica-atende-casa',
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: '0.8'
    },
    {
      url: '/tecnico-informatica-minha-regiao',
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: '0.8'
    },
    {
      url: '/gamers',
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: '0.8'
    },
    {
      url: '/lgpd',
      lastmod: new Date().toISOString(),
      changefreq: 'monthly',
      priority: '0.5'
    },
    {
      url: '/politica-privacidade',
      lastmod: new Date().toISOString(),
      changefreq: 'monthly',
      priority: '0.5'
    },
    {
      url: '/termos-uso',
      lastmod: new Date().toISOString(),
      changefreq: 'monthly',
      priority: '0.5'
    }
  ];

  // URLs de serviços específicos
  const serviceUrls = [
    '/servicos?service=correcao-windows',
    '/servicos?service=formatacao',
    '/servicos?service=otimizacao',
    '/servicos?service=recuperacao',
    '/servicos?service=impressora',
    '/servicos?service=remocao-virus'
  ].map(service => ({
    url: service,
    lastmod: new Date().toISOString(),
    changefreq: 'weekly',
    priority: '0.8'
  }));

  // URLs de categorias do blog
  const blogCategoryUrls = [
    '/blog/category/tecnologia',
    '/blog/category/suporte-tecnico',
    '/blog/category/windows',
    '/blog/category/jogos',
    '/blog/category/otimizacao',
    '/blog/category/seguranca',
    '/blog/category/dicas'
  ].map(category => ({
    url: category,
    lastmod: new Date().toISOString(),
    changefreq: 'weekly',
    priority: '0.7'
  }));

  // URLs de posts do blog (exemplo)
  const blogPostUrls = [
    {
      url: '/blog/gta6-guia-completo',
      lastmod: new Date().toISOString(),
      changefreq: 'monthly',
      priority: '0.6'
    }
  ];

  // Combinar todas as URLs
  const allUrls = [...mainUrls, ...serviceUrls, ...blogCategoryUrls, ...blogPostUrls];

  // Gerar XML do sitemap
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${allUrls.map(url => `  <url>
    <loc>${baseUrl}${url.url}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
} 