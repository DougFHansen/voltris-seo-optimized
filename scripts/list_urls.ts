
import fs from 'fs';
import path from 'path';

function getPageRoutes(dir: string, baseUrl: string = ''): string[] {
    let results: string[] = [];
    if (!fs.existsSync(dir)) return results;

    const list = fs.readdirSync(dir);

    list.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat && stat.isDirectory()) {
            if (!file.startsWith('_') && !file.startsWith('.') && file !== 'api' && file !== 'components') {
                results = results.concat(getPageRoutes(filePath, `${baseUrl}/${file}`));
            }
        } else if (file === 'page.tsx' || file === 'page.js') {
            results.push(baseUrl || '/');
        }
    });

    return results;
}

const appDir = path.join(process.cwd(), 'app');
const allRoutes = getPageRoutes(appDir);
// Filter sensitive routes
const filteredRoutes = allRoutes.filter(route =>
    !route.includes('[') &&
    !route.includes('/dashboard') &&
    !route.includes('/admin') &&
    !route.includes('/restricted-area-admin') &&
    !route.includes('/auth')
);

console.log('Total URLs found:', filteredRoutes.length);
filteredRoutes.forEach(r => console.log(`https://voltris.com.br${r === '/' ? '' : r}`));
