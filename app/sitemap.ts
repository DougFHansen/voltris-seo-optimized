import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'https://www.voltris.com.br';

const NOW = new Date();

const LOCAL_CITIES = [
  'sao-paulo', 'rio-de-janeiro', 'belo-horizonte', 'curitiba', 'porto-alegre', 'salvador', 'brasilia', 
  'fortaleza', 'recife', 'goiania', 'florianopolis', 'manaus', 'belem', 'vitoria', 'campo-grande', 
  'cuiaba', 'sao-luis', 'natal', 'joao-pessoa', 'maceio', 'teresina', 'aracaju', 'palmas', 
  'rio-branco', 'porto-velho', 'boa-vista', 'macapa'
] as const;

const CORPORATE_CITIES = [
    'sao-paulo', 'rio-de-janeiro', 'curitiba', 'belo-horizonte', 'porto-alegre', 'florianopolis', 'campinas'
];

// Lista de slugs de /guias que são origem de redirects (não devem ir para o sitemap)
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

// Diretórios que NUNCA devem ir para o sitemap
const EXCLUDED_DIRS = new Set([
    'api', 'dashboard', 'admin', 'auth', 'login', 'private', 'debug', 'test-commands', 
    'debug-link', 'debug-commands', 'restricted-area-admin', 'reset-password', 'perfil',
    'criar-test-users', 'processo', 'pix-limitacao', 'integracao-servicos',
    'formatacao', 'formatacao-pc', 'voltris-optimizer', 'como-os-estudio-gravar-tela',
    'gravacao-tela-windows-nativa-dicas'
]);

interface RouteInfo {
    path: string;
    lastModified: Date;
}

/**
 * Varre recursivamente o diretório app procurando por page.tsx e page.js.
 * Garante que 100% das páginas públicas sejam incluídas dinamicamente.
 */
function getAllAppRoutes(dir: string, basePath = ''): RouteInfo[] {
    let results: RouteInfo[] = [];
    
    try {
        const entries = fs.readdirSync(dir, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            const routePath = basePath === '' ? `/${entry.name}` : `${basePath}/${entry.name}`;

            if (entry.isDirectory()) {
                // Pular pastas ocultas ou componentes
                if (entry.name.startsWith('_') || entry.name.startsWith('.') || entry.name === 'components' || entry.name === 'lib') continue;
                
                // Pular diretórios excluídos
                if (EXCLUDED_DIRS.has(entry.name)) continue;

                // Pular pastas de rotas dinâmicas como [slug] (elas são injetadas manualmente)
                if (entry.name.startsWith('[') && entry.name.endsWith(']')) continue;

                // Se for a pasta guias, verificar se o slug não é source de redirect
                if (basePath === '/guias' && REDIRECT_SOURCES.has(entry.name)) continue;

                results = results.concat(getAllAppRoutes(fullPath, routePath));
            } else if (entry.name === 'page.tsx' || entry.name === 'page.js') {
                const stats = fs.statSync(fullPath);
                
                // A própria raiz (app/page.tsx)
                const finalPath = basePath === '' ? '' : basePath;

                // Evitar duplicações em casos estranhos
                if (!results.find(r => r.path === finalPath)) {
                    results.push({
                        path: finalPath,
                        lastModified: stats.mtime
                    });
                }
            }
        }
    } catch (e) {
        console.error('Erro lendo rotas para o sitemap:', e);
    }
    
    return results;
}

export default function sitemap(): MetadataRoute.Sitemap {
    const appDir = path.join(process.cwd(), 'app');
    
    // 1. Busca todas as rotas estáticas dinamicamente varrendo o HD
    const autoRoutes = getAllAppRoutes(appDir);
    
    // 2. Injeta rotas dinâmicas conhecidas manualmente
    const dynamicRoutes: RouteInfo[] = [
        ...LOCAL_CITIES.map(city => ({ path: `/tecnico-informatica-em/${city}`, lastModified: NOW })),
        ...CORPORATE_CITIES.map(city => ({ path: `/corporativo/suporte-ti-em/${city}`, lastModified: NOW }))
    ];

    const allRoutes = [...autoRoutes, ...dynamicRoutes];

    // Ordena para fins de clareza no XML gerado
    allRoutes.sort((a, b) => a.path.localeCompare(b.path));

    return allRoutes.map((route) => {
        return {
            url: `${BASE_URL}${route.path}`,
            lastModified: route.lastModified,
            changeFrequency: route.path === '' ? 'daily' : route.path.startsWith('/guias/') ? 'monthly' : 'weekly',
            priority: route.path === '' ? 1
                : route.path.startsWith('/guias/') ? 0.7
                : route.path.startsWith('/exterior') ? 0.8
                : route.path === '/otimizacao-windows-jogos' ? 0.95
                : route.path.startsWith('/otimizar-windows-para-') ? 0.9
                : route.path.startsWith('/como-') ? 0.85
                : route.path.startsWith('/melhorar-performance-') ? 0.85
                : route.path.startsWith('/voltrisoptimizer/') ? 0.88
                : 0.9,
        };
    });
}
