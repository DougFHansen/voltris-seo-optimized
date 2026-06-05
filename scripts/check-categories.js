const fs = require('fs');
const path = require('path');

const GUIDES_DIR = path.join(__dirname, '../app/guias');

const VALID_CATEGORIES = [
    'otimizacao',
    'games-fix',
    'windows-erros',
    'hardware',
    'perifericos',
    'software',
    'rede-seguranca',
    'windows-geral',
    'emulacao',
    'linux'
];

function getCategories(dir) {
    const files = fs.readdirSync(dir);
    let errorCount = 0;

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            // Check if page.tsx exists
            const pagePath = path.join(filePath, 'page.tsx');
            if (fs.existsSync(pagePath)) {
                const content = fs.readFileSync(pagePath, 'utf8');

                // Extract category using regex
                // Matches: category: 'value' or category: "value"
                const match = content.match(/category:\s*['"]([^'"]+)['"]/);

                if (match) {
                    let category = match[1].toLowerCase();

                    // Normalization logic (Matches lib/guides.ts)
                    if (category === 'windows') category = 'windows-geral';
                    if (category === 'jogos') category = 'games-fix';
                    if (category === 'games') category = 'games-fix';
                    if (category === 'rede') category = 'rede-seguranca';
                    if (category === 'seguranca') category = 'rede-seguranca';
                    if (category === 'audio') category = 'perifericos'; // Mapping audio to perifericos (or software)
                    if (category === 'emuladores') category = 'emulacao';

                    if (!VALID_CATEGORIES.includes(category)) {
                        console.error(`[INVALID] ${file}: Category '${category}' (normalized) is NOT valid.`);
                        errorCount++;
                    } else {
                        // console.log(`[OK] ${file}: ${category}`);
                    }
                } else {
                    console.error(`[MISSING] ${file}: Could not find category in metadata.`);
                    errorCount++;
                }
            }
        }
    });

    if (errorCount === 0) {
        console.log("All categories are VALID.");
    } else {
        console.log(`${errorCount} errors found.`);
        process.exit(1);
    }
}

console.log("Checking categories...");
getCategories(GUIDES_DIR);
console.log("Done.");
