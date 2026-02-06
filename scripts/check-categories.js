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
    'windows-geral'
];

function getCategories(dir) {
    const files = fs.readdirSync(dir);
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
                    const category = match[1];
                    if (!VALID_CATEGORIES.includes(category)) {
                        console.error(`[INVALID] ${file}: Category '${category}' is NOT valid.`);
                    } else {
                        // console.log(`[OK] ${file}: ${category}`);
                    }
                } else {
                    console.error(`[MISSING] ${file}: Could not find category in metadata.`);
                }
            }
        }
    });
}

console.log("Checking categories...");
getCategories(GUIDES_DIR);
console.log("Done.");
