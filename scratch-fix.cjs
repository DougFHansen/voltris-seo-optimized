const fs = require('fs');
const path = require('path');
const appDir = 'c:/Users/VOLTRIS/Desktop/VOLTRIS/app';

const entries = fs.readdirSync(appDir, { withFileTypes: true });
for (const entry of entries) {
  if (entry.isDirectory() && entry.name !== 'guias' && entry.name !== 'api' && entry.name !== 'components' && !entry.name.startsWith('_')) {
    const filePath = path.join(appDir, entry.name, 'page.tsx');
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, 'utf8');
      
      if (content.includes('export const metadata') || content.includes('export async function generateMetadata')) continue;
      if (content.includes('use client')) continue;
      
      const titleMatch = content.match(/const\s+title\s*=\s*['"]([^'"]+)['"]/);
      const descMatch = content.match(/const\s+description\s*=\s*['"]([^'"]+)['"]/);
      
      if (titleMatch && descMatch) {
        console.log('Fixing:', entry.name);
        const metaStr = `\nexport const metadata = {\n  title: "${titleMatch[1]}",\n  description: "${descMatch[1]}"\n};\n\n`;
        
        const lastImportIndex = content.lastIndexOf('import ');
        if (lastImportIndex !== -1) {
          const endOfImport = content.indexOf('\n', lastImportIndex);
          content = content.slice(0, endOfImport + 1) + metaStr + content.slice(endOfImport + 1);
          fs.writeFileSync(filePath, content, 'utf8');
        }
      }
    }
  }
}
console.log('Done fixing metadata!');
