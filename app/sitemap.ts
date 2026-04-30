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
  // FASE 1: High-quality pages (15-25 pages)
  '/otimizacao-windows-jogos',
  '/servicos-combinados',
  '/empresas',
  '/glossario',
  '/como-aumentar-fps-roblox-windows',
  '/como-corrigir-queda-de-wifi-windows-11',
  '/como-desativar-vbs-windows-11-gamer',
  '/como-limpar-cache-nvidia-windows-11',
  '/otimizar-windows-11-para-valorant',
  '/otimizar-windows-11-para-warzone-2026',
  '/otimizar-windows-para-counter-strike-2-cs2',
  '/otimizar-windows-para-fortnite-2026',
  '/otimizar-windows-para-minecraft-ultra-fps',
  '/melhorar-performance-da-steam-windows-11',
  '/melhorar-performance-do-google-chrome-windows',
  '/voltrisoptimizer/como-funciona',
  '/voltrisoptimizer/documentacao',
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
    priority: route === '' ? 1 
      : route.startsWith('/guias/') ? 0.7 
      : route.startsWith('/exterior') ? 0.8 
      : route === '/otimizacao-windows-jogos' ? 0.95
      : route.startsWith('/otimizar-windows-para-') ? 0.9
      : route.startsWith('/como-') ? 0.85
      : route.startsWith('/melhorar-performance-') ? 0.85
      : route.startsWith('/voltrisoptimizer/') ? 0.88
      : 0.9,
  }));
}