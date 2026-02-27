import fs from 'fs';
import path from 'path';

export interface GuideMetadata {
    id: string; // The slug
    title: string;
    description: string;
    category: string;
    difficulty: string;
    time: string;
}

const guidesDir = path.join(process.cwd(), 'app/guias');

/**
 * Reads all guide directories and extracts the metadata exported in page.tsx.
 * This runs on the server side (at build time or run time).
 */
export function getAllGuides(): GuideMetadata[] {
    try {
        if (!fs.existsSync(guidesDir)) return [];

        const files = fs.readdirSync(guidesDir);
        const guides: GuideMetadata[] = [];

        for (const file of files) {
            const fullPath = path.join(guidesDir, file);

            // Only check directories
            if (fs.statSync(fullPath).isDirectory()) {
                const pagePath = path.join(fullPath, 'page.tsx');

                // Only process if page.tsx exists
                if (fs.existsSync(pagePath)) {
                    const content = fs.readFileSync(pagePath, 'utf8');

                    // Regex to extract the guideMetadata object literal
                    // Matches: export const guideMetadata[: Type] = { ... }[;]
                    const match = content.match(/export const guideMetadata(?:\s*:\s*[\w<>\[\]]+)?\s*=\s*{([\s\S]*?)}(?:;|\s|$)/);

                    if (match) {
                        const block = match[1];

                        // Helper to extract values safely
                        const getValue = (key: string) => {
                            // Match key: "value" or key: 'value' or key: `value`
                            // Capture group 1 is the content inside quotes/ticks
                            const m = block.match(new RegExp(`${key}:\\s*["'\`]((?:[^"'\\\\\`]|\\\\.)*)["'\`]`));
                            return m ? m[1].replace(/\\"/g, '"').replace(/\\'/g, "'").replace(/\\`/g, "`") : '';
                        };

                        const rawCategory = getValue('category') || 'outros';
                        let normalizedCategory = rawCategory.toLowerCase();

                        // Normalização de categorias para bater com os IDs do frontend
                        if (normalizedCategory === 'windows') normalizedCategory = 'windows-geral';
                        if (normalizedCategory === 'jogos') normalizedCategory = 'games-fix';
                        if (normalizedCategory === 'games') normalizedCategory = 'games-fix';
                        if (normalizedCategory === 'rede') normalizedCategory = 'rede-seguranca';
                        if (normalizedCategory === 'seguranca') normalizedCategory = 'rede-seguranca';
                        if (normalizedCategory === 'emuladores') normalizedCategory = 'emulacao';

                        const metadata: GuideMetadata = {
                            id: file, // Use folder name as ID/Slug
                            title: getValue('title'),
                            description: getValue('description'),
                            category: normalizedCategory,
                            difficulty: getValue('difficulty') || 'Iniciante',
                            time: getValue('time') || '10 min'
                        };

                        // Basic validation: must have title
                        if (metadata.title) {
                            guides.push(metadata);
                        }
                    }
                }
            }
        }

        return guides;
    } catch (error) {
        console.error("Error fetching guides:", error);
        return [];
    }
}
