const fs = require('fs');
const path = require('path');

const appDir = path.join(__dirname, 'app');
const directories = fs.readdirSync(appDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

const redirects = [];
const sitemapUpdates = [];

for (const dirName of directories) {
    const match = dirName.match(/^(.*)-(\d{4})$/);
    if (match) {
        const baseName = match[1];
        const oldPath = path.join(appDir, dirName);
        let newDirName = baseName;
        let newPath = path.join(appDir, newDirName);
        
        if (fs.existsSync(newPath)) {
            console.warn(`Cannot rename ${dirName} to ${newDirName} because destination already exists! Skipping.`);
            continue;
        }

        fs.renameSync(oldPath, newPath);
        console.log(`Renamed: ${dirName} -> ${newDirName}`);
        
        // Root redirects
        redirects.push(`{ source: '/${dirName}', destination: '/${newDirName}', permanent: true },`);
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
