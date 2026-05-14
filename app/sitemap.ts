import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'https://www.voltris.com.br';

// CORREÇÃO: Usar data atual dinâmica em vez de hardcoded
const NOW = new Date();

const CRITICAL_ROUTES = [
  { path: '', lastModified: NOW },
  { path: '/servicos', lastModified: NOW },
  { path: '/contato', lastModified: NOW },
  { path: '/sobre', lastModified: NOW },
  { path: '/guias', lastModified: NOW },
  { path: '/todos-os-servicos', lastModified: NOW },
  { path: '/otimizacao-pc', lastModified: NOW },
  { path: '/formatar-windows', lastModified: NOW },
  { path: '/assistencia-tecnica', lastModified: NOW },
  { path: '/tecnico-informatica', lastModified: NOW },
  { path: '/suporte-tecnico-remoto', lastModified: NOW },
  { path: '/manutencao-computador', lastModified: NOW },
  { path: '/erros-jogos', lastModified: NOW },
  { path: '/voltrisoptimizer', lastModified: NOW },
  { path: '/adquirir-licenca', lastModified: NOW },
  { path: '/criar-site', lastModified: NOW },
  { path: '/faq', lastModified: NOW },
  { path: '/exterior', lastModified: NOW },
  { path: '/exterior/portugal', lastModified: NOW },
  { path: '/exterior/servicos', lastModified: NOW },
  { path: '/exterior/contato', lastModified: NOW },
  { path: '/exterior/orcamento', lastModified: NOW },
  { path: '/corporativo', lastModified: NOW },
  { path: '/corporativo/servicos', lastModified: NOW },
  { path: '/corporativo/planos', lastModified: NOW },
  { path: '/corporativo/cases', lastModified: NOW },
  { path: '/gamer', lastModified: NOW },
  { path: '/home', lastModified: NOW },
  // FASE 1: High-quality pages (15-25 pages)
  { path: '/otimizacao-windows-jogos', lastModified: NOW },
  { path: '/servicos-combinados', lastModified: NOW },
  { path: '/empresas', lastModified: NOW },
  { path: '/glossario', lastModified: NOW },
  { path: '/como-aumentar-fps-roblox-windows', lastModified: NOW },
  { path: '/como-corrigir-queda-de-wifi-windows-11', lastModified: NOW },
  { path: '/como-desativar-vbs-windows-11-gamer', lastModified: NOW },
  { path: '/como-limpar-cache-nvidia-windows-11', lastModified: NOW },
  { path: '/otimizar-windows-11-para-valorant', lastModified: NOW },
  { path: '/otimizar-windows-11-para-warzone', lastModified: NOW },
  { path: '/otimizar-windows-para-counter-strike-2-cs2', lastModified: NOW },
  { path: '/otimizar-windows-para-fortnite', lastModified: NOW },
  { path: '/otimizar-windows-para-minecraft-ultra-fps', lastModified: NOW },
  { path: '/melhorar-performance-da-steam-windows-11', lastModified: NOW },
  { path: '/melhorar-performance-do-google-chrome-windows', lastModified: NOW },
  { path: '/voltrisoptimizer/como-funciona', lastModified: NOW },
  { path: '/voltrisoptimizer/documentacao', lastModified: NOW },
  // Páginas Pilares SEO
  { path: '/aumentar-fps', lastModified: NOW },
  { path: '/otimizacao-windows-11', lastModified: NOW },
  // Páginas Satélites
  { path: '/como-aumentar-fps-valorant', lastModified: NOW },
  { path: '/como-aumentar-fps-warzone', lastModified: NOW },
  { path: '/como-aumentar-fps-cs2', lastModified: NOW },
  { path: '/configurar-nvidia-control-panel-fps', lastModified: NOW },
  { path: '/desativar-telemetria-windows-11', lastModified: NOW },
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

function getGuideRoutes(): { path: string; lastModified: Date }[] {
  const guidesDir = path.join(process.cwd(), 'app', 'guias');

  try {
    const entries = fs.readdirSync(guidesDir, { withFileTypes: true });

    return entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => {
        const slug = entry.name;
        if (slug.startsWith('_') || slug.startsWith('.')) return null;
        if (REDIRECT_SOURCES.has(slug)) return null;
        
        const pageTsx = path.join(guidesDir, slug, 'page.tsx');
        const pageJs = path.join(guidesDir, slug, 'page.js');
        
        if (!fs.existsSync(pageTsx) && !fs.existsSync(pageJs)) return null;
        
        // Get real modification time from filesystem
        const filePath = fs.existsSync(pageTsx) ? pageTsx : pageJs;
        const stats = fs.statSync(filePath);
        const lastModified = stats.mtime;
        
        return {
          path: `/guias/${slug}`,
          lastModified
        };
      })
      .filter((item): item is { path: string; lastModified: Date } => item !== null)
      .sort((a, b) => a.path.localeCompare(b.path));
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
