const fs = require('fs');
const path = require('path');

// Paths
const projectRoot = 'd:\\APLICATIVO VOLTRIS\\Site Voltris';
const guiasClientPath = path.join(projectRoot, 'app\\guias\\GuiasClient.tsx');
const guidesDir = path.join(projectRoot, 'app\\guias');

function parseGuiasClient() {
    const content = fs.readFileSync(guiasClientPath, 'utf8');
    const result = {};

    // 1. Split by categories to know which ID belongs to which guides
    const categoryBlocks = content.split('id: \'');

    // Skip the first chunk
    for (let i = 1; i < categoryBlocks.length; i++) {
        const block = categoryBlocks[i];
        const catIdMatch = block.match(/^([a-z0-9-]+)'/);

        if (!catIdMatch) continue;

        const catId = catIdMatch[1];

        // Find the guides array
        const guidesMatch = block.match(/guides:\s*\[([\s\S]*?)\]/);
        if (!guidesMatch) continue;

        const guidesContent = guidesMatch[1];

        // Improved Regex to handle escaped quotes
        // We look for objects starting with {
        // We match properties loosely but values precisely with escaped quote support

        // Pattern: slug: '...' , title: '...'
        // specific regex for each field to be safer

        // Split by "}," which separates objects loosely (assuming standard formatting)
        const guideObjects = guidesContent.split('},');

        guideObjects.forEach(obj => {
            const slugMatch = obj.match(/slug:\s*'((?:[^'\\]|\\.)*)'/);
            const titleMatch = obj.match(/title:\s*'((?:[^'\\]|\\.)*)'/);
            const descMatch = obj.match(/description:\s*'((?:[^'\\]|\\.)*)'/);
            const diffMatch = obj.match(/difficulty:\s*'((?:[^'\\]|\\.)*)'/);
            const timeMatch = obj.match(/time:\s*'((?:[^'\\]|\\.)*)'/);

            if (slugMatch && titleMatch && descMatch) {
                const slug = slugMatch[1];
                result[slug] = {
                    category: catId,
                    title: titleMatch[1],
                    description: descMatch[1],
                    difficulty: diffMatch ? diffMatch[1] : 'Iniciante',
                    time: timeMatch ? timeMatch[1] : '10 min'
                };
            }
        });
    }

    return result;
}

function migrate() {
    const metadataMap = parseGuiasClient();
    console.log(`Found metadata for ${Object.keys(metadataMap).length} guides.`);

    const physicalGuides = fs.readdirSync(guidesDir).filter(f =>
        fs.statSync(path.join(guidesDir, f)).isDirectory()
    );

    let updatedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    physicalGuides.forEach(slug => {
        const guidePath = path.join(guidesDir, slug, 'page.tsx');

        if (!fs.existsSync(guidePath)) {
            // console.warn(`[WARN] Folder exists but page.tsx missing for: ${slug}`);
            return;
        }

        const metadata = metadataMap[slug];
        if (!metadata) {
            console.warn(`[WARN] No metadata in GuiasClient for: ${slug}`);
            return;
        }

        let content = fs.readFileSync(guidePath, 'utf8');

        // Check if already has metadata
        if (content.includes('export const guideMetadata')) {
            // console.log(`[SKIP] Already has metadata: ${slug}`);
            skippedCount++;
            return;
        }

        // Create the export block
        // Note: we don't need to double-escape because extracting from file included the backslash
        // BUT we need to be careful. The regex '((?:[^'\\]|\\.)*)' captures including the backslash.
        // ex: \'ignora\' -> captured as \'ignora\'
        // When we wrap it in "${...}", it becomes " ... \'ignora\' ... " which is invalid JSON string if strict, but valid JS string?
        // Wait, " ' " is valid. " \' " is valid.

        // We use double quotes for the export: title: "..."
        // If the title contains ", we need to escape it.
        // It currently contains ' escaped as \'.

        const cleanTitle = metadata.title.replace(/\\'/g, "'").replace(/"/g, '\\"');
        const cleanDesc = metadata.description.replace(/\\'/g, "'").replace(/"/g, '\\"');

        const exportBlock = `
export const guideMetadata = {
  id: '${slug}',
  title: "${cleanTitle}",
  description: "${cleanDesc}",
  category: '${metadata.category}',
  difficulty: '${metadata.difficulty}',
  time: '${metadata.time}'
};
`;

        const lastImportIdx = content.lastIndexOf('import ');
        if (lastImportIdx !== -1) {
            const endOfImportLine = content.indexOf('\n', lastImportIdx);
            const insertPos = endOfImportLine + 1;

            content = content.slice(0, insertPos) + exportBlock + content.slice(insertPos);

            fs.writeFileSync(guidePath, content, 'utf8');
            console.log(`[UPDATE] Injected metadata into: ${slug}`);
            updatedCount++;
        } else {
            console.error(`[ERR] Could not find import statements in: ${slug}`);
            errorCount++;
        }
    });

    console.log(`\nMigration Complete.`);
    console.log(`Updated: ${updatedCount}`);
    console.log(`Skipped: ${skippedCount}`);
    console.log(`Errors: ${errorCount}`);
}

migrate();
