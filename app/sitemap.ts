import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';

// Helper to get real last modified date from file system
function getLastModified(filePath: string): Date {
  try {
    const stats = fs.statSync(filePath);
    return stats.mtime;
  } catch (error) {
    return new Date(); // Fallback to now if file not found (dynamic routes)
  }
}

// Helper to recursively find all page.tsx files
function getPageRoutes(dir: string, baseUrl: string = ''): string[] {
  let results: string[] = [];
  if (!fs.existsSync(dir)) return results;

  const list = fs.readdirSync(dir);

  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat && stat.isDirectory()) {
      // Recursively scan directories
      // Skip special Next.js folders and components
      if (!file.startsWith('_') && !file.startsWith('.') && file !== 'api' && file !== 'components') {
        results = results.concat(getPageRoutes(filePath, `${baseUrl}/${file}`));
      }
    } else if (file === 'page.tsx' || file === 'page.js') {
      // Found a page
      results.push(baseUrl || '/');
    }
  });

  return results;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://voltris.com.br';
  const appDir = path.join(process.cwd(), 'app');

  // Hardcoded priority map for critical business pages
  const priorityMap: Record<string, number> = {
    '/': 1.0,
    '/servicos': 0.9,
    '/tecnico-informatica': 0.9,
    '/voltrisoptimizer': 0.9,
    '/guias': 0.9,
    '/contato': 0.7,
    '/sobre': 0.7,
  };

  // 1. Get all routes dynamically by scanning "app" directory
  const allRoutes = getPageRoutes(appDir);

  // 2. Filter and map to sitemap format
  const sitemapEntries = allRoutes
    .filter(route => {
      // Exclude dynamic routes with brackets like [slug] for now, unless handled specifically
      // Exclude private/admin routes
      return !route.includes('[') &&
        !route.includes('/dashboard') &&
        !route.includes('/admin') &&
        !route.includes('/restricted-area-admin') &&
        !route.includes('/auth');
    })
    .map(route => {
      // Construct file path to check modification time
      // route is like "/servicos" -> path is ".../app/servicos/page.tsx"
      // route is "/" -> path is ".../app/page.tsx"

      const relativePath = route === '/' ? 'page.tsx' : `${route}/page.tsx`;
      const filePath = path.join(appDir, relativePath);

      return {
        url: `${baseUrl}${route === '/' ? '' : route}`,
        lastModified: getLastModified(filePath),
        changeFrequency: 'daily' as const,
        priority: priorityMap[route] || (route.startsWith('/guias/') ? 0.9 : 0.8),
      };
    });

  // 3. Handle Dynamic Guides (since they might be under [slug] or effectively static folders)
  // The previous sitemap function suggested guides are folders under app/guias.
  // Our generic recursive scanner might have picked them up if they are explicit folders.
  // Let's ensure we didn't miss them or duplicate them if they were folders.
  // If "app/guias" contains folders like "como-fazer-x", getPageRoutes will find "/guias/como-fazer-x".
  // So we are largely covered!

  // However, check if specific dynamic logic is needed for "[slug]" routes if they exist.
  // Previously: const guideSlugs = getGuideSlugs(); which read subdirs of app/guias. 
  // Our getPageRoutes does exactly this recursively.

  // 4. Manual Additions (if any routes are external or special)
  // (None apparent from previous file, purely files)

  return sitemapEntries;
}