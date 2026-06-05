const fs = require('fs');
const path = require('path');

const guiasDir = path.join(__dirname, '..', 'app', 'guias');
const outputFile = path.join(__dirname, '..', 'lib', 'valid-guide-slugs.ts');

try {
    const allItems = fs.readdirSync(guiasDir);

    // Filtrar diretórios de guias ativos
    const guideSlugs = allItems.filter(item => {
        const itemPath = path.join(guiasDir, item);
        return fs.statSync(itemPath).isDirectory() && 
               item !== 'layout' && 
               item !== 'GuiasClient' &&
               item !== '[category]';
    });

    // Categorias válidas
    const categories = [
        'inteligencia-artificial',
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

    const content = `// Código gerado automaticamente para verificação O(1) de guias ativos no Middleware (Edge Runtime)
// Gerado em: ${new Date().toISOString()}

export const VALID_CATEGORIES = new Set<string>([
${categories.map(c => `    '${c}'`).join(',\n')}
]);

export const VALID_GUIDE_SLUGS = new Set<string>([
${guideSlugs.map(s => `    '${s}'`).join(',\n')}
]);
`;

    fs.writeFileSync(outputFile, content, 'utf8');
    console.log(`Sucesso: ${guideSlugs.length} slugs de guias ativos gravados em ${outputFile}`);
} catch (error) {
    console.error('Erro ao gerar slugs de guias:', error);
    process.exit(1);
}
