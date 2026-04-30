import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'https://www.voltris.com.br';

const CRITICAL_ROUTES = [
  '',
  '/servicos',
  '/contato',
  '/sobre',
  '/guias',
  '/todos-os-servicos',
  '/otimizacao-pc',
  '/formatar-windows',
  '/assistencia-tecnica',
  '/tecnico-informatica',
  '/suporte-tecnico-remoto',
  '/manutencao-computador',
  '/erros-jogos',
  '/voltrisoptimizer',
  '/adquirir-licenca',
  '/criar-site',
  '/faq',
  '/exterior',
  '/exterior/servicos',
  '/exterior/contato',
  '/exterior/orcamento',
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

  return allRoutes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: now,
    changeFrequency: route === '' ? 'daily' : route.startsWith('/guias/') ? 'monthly' : 'weekly',
    priority: route === '' ? 1 : route.startsWith('/guias/') ? 0.7 : route.startsWith('/exterior') ? 0.8 : 0.9,
  }));
}