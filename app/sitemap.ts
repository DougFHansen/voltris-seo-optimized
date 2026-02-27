import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';

/**
 * Helper to get real last modified date from file system.
 * This is crucial for Google to know which pages to re-index.
 */
function getLastModified(filePath: string): Date {
  try {
    const stats = fs.statSync(filePath);
    return stats.mtime;
  } catch (error) {
    return new Date(); // Fallback to now
  }
}

/**
 * Deep recursive scanner to find all "page.tsx" files in the "app" directory.
 * Filters out admin, auth, and deleted "blog" pages to ensure absolute SEO cleanliness.
 */
function getPageRoutes(dir: string, baseUrl: string = ''): string[] {
  let results: string[] = [];
  if (!fs.existsSync(dir)) return results;

  const list = fs.readdirSync(dir);

  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat && stat.isDirectory()) {
      // SKIP: Admin, Dashboard, Auth, Restricted Area, and the DELETED Blog
      const skipDirs = [
        'api', 'components', 'dashboard', 'admin',
        'restricted-area-admin', 'auth', 'private', 'blog',
        '_', '.'
      ];

      const shouldSkip = skipDirs.some(skip =>
        file.startsWith(skip) || file === skip
      );

      if (!shouldSkip) {
        results = results.concat(getPageRoutes(filePath, `${baseUrl}/${file}`));
      }
    } else if (file === 'page.tsx' || file === 'page.js') {
      // Found a valid public page
      const route = baseUrl || '/';
      // Double check it's not a dynamic bracket route which needs specific params
      if (!route.includes('[') && !route.includes('blog')) {
        results.push(route);
      }
    }
  });

  return results;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const domain = 'https://voltris.com.br';
  const appDir = path.join(process.cwd(), 'app');

  // Business-Critical Priorities for Google (Siloing Strategy)
  const priorityMap: Record<string, number> = {
    '/': 1.0,
    '/servicos': 0.9,
    '/todos-os-servicos': 0.9,
    '/formatar-windows': 0.9,
    '/otimizacao-pc': 0.9,
    '/assistencia-tecnica': 0.9,
    '/tecnico-informatica': 0.9,
    '/suporte-tecnico-remoto': 0.9,
    '/erros-jogos': 0.9,
    '/manutencao-computador': 0.9,
    '/voltrisoptimizer': 0.9,
    '/adquirir-licenca': 0.8,
    '/guias': 0.8,
    '/exterior': 0.8,
    '/criar-site': 0.8,
    '/contato': 0.7,
  };

  // 1. Dynamic Discovery of all static pages (including 300+ guides)
  const allRoutes = getPageRoutes(appDir);

  const sitemapEntries = allRoutes.map(route => {
    // Determine the physical file for modification date
    const relativePath = route === '/' ? 'page.tsx' : `${route}/page.tsx`;
    const filePath = path.join(appDir, relativePath);

    // Determine category priority
    let priority = 0.6; // Default
    if (priorityMap[route]) {
      priority = priorityMap[route];
    } else if (route.startsWith('/guias/')) {
      priority = 0.7; // Deep content guides
    } else if (route.startsWith('/tecnico-informatica-em/')) {
      priority = 0.8; // High-value regional pages
    }

    const changeFreq = priority >= 0.9 ? 'daily' : 'weekly';

    return {
      url: `${domain}${route === '/' ? '' : route}`,
      lastModified: getLastModified(filePath),
      changeFrequency: changeFreq as 'daily' | 'weekly',
      priority: priority,
    };
  });

  // 2. Technical SEO - Regional Coverage (Dynamic Params)
  // We explicitly include the 27 state capitals for maximum regional resonance
  const regionalSlugs = [
    'sao-paulo', 'rio-de-janeiro', 'belo-horizonte', 'curitiba',
    'porto-alegre', 'salvador', 'brasilia', 'fortaleza',
    'recife', 'goiania', 'florianopolis', 'manaus',
    'belem', 'vitoria', 'campo-grande', 'cuiaba',
    'sao-luis', 'natal', 'joao-pessoa', 'maceio',
    'teresina', 'aracaju', 'palmas', 'rio-branco',
    'porto-velho', 'boa-vista', 'macapa'
  ];

  const regionalRoutes = regionalSlugs.map(slug => ({
    url: `${domain}/tecnico-informatica-em/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // Combine and deduplicate if necessary
  const combined = [...sitemapEntries, ...regionalRoutes];

  // Use a Map to ensure unique URLs (deep organization)
  const uniqueSitemap = Array.from(
    new Map(combined.map(item => [item.url, item])).values()
  );

  return uniqueSitemap;
}