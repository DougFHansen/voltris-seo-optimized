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
  { path: '/otimizar-windows-11-para-warzone', lastModified: new Date('2026-05-02') },
  { path: '/otimizar-windows-para-counter-strike-2-cs2', lastModified: new Date('2026-05-02') },
  { path: '/otimizar-windows-para-fortnite', lastModified: new Date('2026-05-02') },
  { path: '/otimizar-windows-para-minecraft-ultra-fps', lastModified: new Date('2026-05-02') },
  { path: '/melhorar-performance-da-steam-windows-11', lastModified: new Date('2026-05-02') },
  { path: '/melhorar-performance-do-google-chrome-windows', lastModified: new Date('2026-05-02') },
  { path: '/voltrisoptimizer/como-funciona', lastModified: new Date('2026-05-02') },
  { path: '/voltrisoptimizer/documentacao', lastModified: new Date('2026-05-02') },
  // Páginas Pilares SEO
  { path: '/aumentar-fps', lastModified: new Date('2026-05-02') },
  { path: '/otimizacao-windows-11', lastModified: new Date('2026-05-02') },
  // Páginas Satélites
  { path: '/como-aumentar-fps-valorant', lastModified: new Date('2026-05-02') },
  { path: '/como-aumentar-fps-warzone', lastModified: new Date('2026-05-02') },
  { path: '/como-aumentar-fps-cs2', lastModified: new Date('2026-05-02') },
  { path: '/configurar-nvidia-control-panel-fps', lastModified: new Date('2026-05-02') },
  { path: '/desativar-telemetria-windows-11', lastModified: new Date('2026-05-02') },
] as const;

// Lista de slugs que são origem de redirects (não devem ir para o sitemap)
const REDIRECT_SOURCES = new Set([
  'ssd-vs-hd-qual-melhor', 'hds-vs-ssd-qual-a-diferenca', 'nvme-vs-sata-vale-a-pena-upgrade', 'ssd-nvme-vs-sata-jogos',
  'melhor-dns-para-jogos-google-vs-cloudflare', 'dns-mais-rapido-para-jogos-benchmark', 'debloating-windows-11',
  'overwatch-2-melhores-configuracoes-fps', 'red-dead-redemption-2-melhores-configuracoes', 'euro-truck-simulator-2-otimizacao',
  'rocket-league-melhores-configuracoes-camera', 'manutencao-preventiva', 'roblox-fps-unlocker-guia', 'roblox-fps-unlocker-tutorial',
  'eld-ring-stuttering-fix-dx12', 'elden-ring-fps-unlock-widescreen-fix-stutter', 'obs-studio-melhores-configuracoes-stream',
  'obs-studio-streaming-twitch-youtube-guia-completo', 'cadeira-gamer-ergonomia-postura-aim', 'teclados-mecanicos-switches-guia',
  'water-cooler-vs-air-cooler', 'perifericos-gamer-vale-a-pena', 'bluestacks-ldplayer-otimizacao-free-fire-120fps',
  'bluestacks-vs-ldplayer-qual-mais-leve', 'vpn-vale-a-pena-jogos', 'hdr-windows-vale-a-pena-jogos', 'sync-vertical-g-sync-free-sync-explicacao',
  'reduzir-ping-jogos-online', 'reduzir-ping-exitlag-noping-dns', 'backup-dados', 'the-witcher-3-next-gen-performance',
  'valorant-fix-van-9003-secure-boot', 'gta-iv-complete-edition-lag-fix', 'discord-otimizar-para-jogos', 'formatacao-windows',
  'gta-v-como-resolver-texturas-sumindo-ou-demorando-para-carregar'
]);

function getGuideRoutes(): string[] {
  const guidesDir = path.join(process.cwd(), 'app', 'guias');

  try {
    const entries = fs.readdirSync(guidesDir, { withFileTypes: true });

    return entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .filter((slug) => {
        if (slug.startsWith('_') || slug.startsWith('.')) return false;
        if (REDIRECT_SOURCES.has(slug)) return false;
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