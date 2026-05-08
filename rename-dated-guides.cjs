const fs = require('fs');
const path = require('path');

const guiasDir = path.join(__dirname, 'app', 'guias');
const directories = fs.readdirSync(guiasDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

const redirects = [];
const sitemapUpdates = [];

for (const dirName of directories) {
    const match = dirName.match(/^(.*)-(\d{4})$/);
    if (match) {
        const baseName = match[1];
        const year = match[2];
        const oldPath = path.join(guiasDir, dirName);
        
        // If the target directory already exists, we might need to handle it.
        // For simplicity, if it exists, maybe we just merge or skip.
        let newDirName = baseName;
        let newPath = path.join(guiasDir, newDirName);
        
        if (fs.existsSync(newPath)) {
            console.warn(`Cannot rename ${dirName} to ${newDirName} because destination already exists! Skipping.`);
            continue;
        }

        fs.renameSync(oldPath, newPath);
        console.log(`Renamed: ${dirName} -> ${newDirName}`);
        
        redirects.push(`{ source: '/guias/${dirName}', destination: '/guias/${newDirName}', permanent: true },`);
        sitemapUpdates.push({ old: dirName, new: newDirName });

        // Now, update the ID inside the page.tsx
        const pageTsxPath = path.join(newPath, 'page.tsx');
        if (fs.existsSync(pageTsxPath)) {
            let content = fs.readFileSync(pageTsxPath, 'utf8');
            content = content.replace(new RegExp(dirName, 'g'), newDirName);
            fs.writeFileSync(pageTsxPath, content, 'utf8');
        }
    }
}

console.log('\n--- REDIRECTS FOR next.config.js ---');
console.log(redirects.join('\n'));

console.log('\n--- SITEMAP UPDATES ---');
console.log(sitemapUpdates);
