import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'https://www.voltris.com.br';

const CRITICAL_ROUTES = [
  { path: '', lastModified: new Date('2026-05-02') },
  { path: '/servicos', lastModified: new Date('2026-05-02') },
  { path: '/contato', lastModified: new Date('2026-05-02') },
  { path: '/sobre', lastModified: new Date('2026-05-02') },
  { path: '/guias', lastModified: new Date('2026-05-02') },
  { path: '/todos-os-servicos', lastModified: new Date('2026-05-02') },
  { path: '/otimizacao-pc', lastModified: new Date('2026-05-02') },
  { path: '/formatar-windows', lastModified: new Date('2026-05-02') },
  { path: '/assistencia-tecnica', lastModified: new Date('2026-05-02') },
  { path: '/tecnico-informatica', lastModified: new Date('2026-05-02') },
  { path: '/suporte-tecnico-remoto', lastModified: new Date('2026-05-02') },
  { path: '/manutencao-computador', lastModified: new Date('2026-05-02') },
  { path: '/erros-jogos', lastModified: new Date('2026-05-02') },
  { path: '/voltrisoptimizer', lastModified: new Date('2026-05-02') },
  { path: '/adquirir-licenca', lastModified: new Date('2026-05-02') },
  { path: '/criar-site', lastModified: new Date('2026-05-02') },
  { path: '/faq', lastModified: new Date('2026-05-02') },
  { path: '/exterior', lastModified: new Date('2026-05-02') },
  { path: '/exterior/servicos', lastModified: new Date('2026-05-02') },
  { path: '/exterior/contato', lastModified: new Date('2026-05-02') },
  { path: '/exterior/orcamento', lastModified: new Date('2026-05-02') },
  // FASE 1: High-quality pages (15-25 pages)
  { path: '/otimizacao-windows-jogos', lastModified: new Date('2026-05-02') },
  { path: '/servicos-combinados', lastModified: new Date('2026-05-02') },
  { path: '/empresas', lastModified: new Date('2026-05-02') },
  { path: '/glossario', lastModified: new Date('2026-05-02') },
  { path: '/como-aumentar-fps-roblox-windows', lastModified: new Date('2026-05-02') },
  { path: '/como-corrigir-queda-de-wifi-windows-11', lastModified: new Date('2026-05-02') },
  { path: '/como-desativar-vbs-windows-11-gamer', lastModified: new Date('2026-05-02') },
  { path: '/como-limpar-cache-nvidia-windows-11', lastModified: new Date('2026-05-02') },
  { path: '/otimizar-windows-11-para-valorant', lastModified: new Date('2026-05-02') },
  { path: '/otimizar-windows-11-para-warzone-2026', lastModified: new Date('2026-05-02') },
  { path: '/otimizar-windows-para-counter-strike-2-cs2', lastModified: new Date('2026-05-02') },
  { path: '/otimizar-windows-para-fortnite-2026', lastModified: new Date('2026-05-02') },
  { path: '/otimizar-windows-para-minecraft-ultra-fps', lastModified: new Date('2026-05-02') },
  { path: '/melhorar-performance-da-steam-windows-11', lastModified: new Date('2026-05-02') },
  { path: '/melhorar-performance-do-google-chrome-windows', lastModified: new Date('2026-05-02') },
  { path: '/voltrisoptimizer/como-funciona', lastModified: new Date('2026-05-02') },
  { path: '/voltrisoptimizer/documentacao', lastModified: new Date('2026-05-02') },
  // Páginas Pilares SEO
  { path: '/aumentar-fps', lastModified: new Date('2026-05-02') },
  { path: '/otimizacao-windows-11', lastModified: new Date('2026-05-02') },
] as const;

function getGuideRoutes(): string[] {
  const guidesDir = path.join(process.cwd(), 'app', 'guias');

  try {
    const entries = fs.readdirSync(guidesDir, { withFileTypes: true });

    return entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .filter((slug) => {
        if (slug.startsWith('_') || slug.startsWith('.')) return false;
        const pageTsx = path.join(guidesDir, slug, 'page.tsx');
        const pageJs = path.join(guidesDir, slug, 'page.js');
        return fs.existsSync(pageTsx) || fs.existsSync(pageJs);
      })
      .map((slug) => `/guias/${slug}`)
      .sort((a, b) => a.localeCompare(b));
  } catch {
    // Never break sitemap endpoint due to filesystem/runtime issues.
    return [];
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const guideRoutes = getGuideRoutes();
  const allRoutes = [...CRITICAL_ROUTES, ...guideRoutes];

  return allRoutes.map((route) => {
    const path = typeof route === 'string' ? route : route.path;
    const lastModified = typeof route === 'string' ? now : route.lastModified;

    return {
      url: `${BASE_URL}${path}`,
      lastModified,
      changeFrequency: path === '' ? 'daily' : path.startsWith('/guias/') ? 'monthly' : 'weekly',
      priority: path === '' ? 1
        : path.startsWith('/guias/') ? 0.7
        : path.startsWith('/exterior') ? 0.8
        : path === '/otimizacao-windows-jogos' ? 0.95
        : path.startsWith('/otimizar-windows-para-') ? 0.9
        : path.startsWith('/como-') ? 0.85
        : path.startsWith('/melhorar-performance-') ? 0.85
        : path.startsWith('/voltrisoptimizer/') ? 0.88
        : 0.9,
    };
  });
}