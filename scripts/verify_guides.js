const fs = require('fs');
const path = require('path');

// Paths
const guidesDir = path.join('d:\\APLICATIVO VOLTRIS\\Site Voltris\\app\\guias');
const guiasClientPath = path.join('d:\\APLICATIVO VOLTRIS\\Site Voltris\\app\\guias\\GuiasClient.tsx');

// 1. Get all directories in app/guias
try {
    const files = fs.readdirSync(guidesDir);
    const physicalGuides = files.filter(file => {
        const fullPath = path.join(guidesDir, file);
        return fs.statSync(fullPath).isDirectory();
    });

    console.log(`Found ${physicalGuides.length} physical guide directories.`);

    // 2. Extract slugs from GuiasClient.tsx
    const clientContent = fs.readFileSync(guiasClientPath, 'utf8');

    // Regex to find slugs in the format: slug: 'some-slug'
    const slugRegex = /slug:\s*'([^']+)'/g;
    const uiSlugs = [];
    let match;
    while ((match = slugRegex.exec(clientContent)) !== null) {
        uiSlugs.push(match[1]);
    }

    console.log(`Found ${uiSlugs.length} guide slugs in GuiasClient.tsx.`);

    // 3. Compare
    const missingInUI = physicalGuides.filter(guide => !uiSlugs.includes(guide));
    const missingInFS = uiSlugs.filter(slug => !physicalGuides.includes(slug));

    console.log('\n--- ANALYSIS RESULTS ---');

    if (missingInUI.length > 0) {
        console.log(`\n[WARNING] ${missingInUI.length} Guides exist in folders but are NOT listed in GuiasClient (Hidden from UI):`);
        missingInUI.forEach(g => console.log(` - ${g}`));
    } else {
        console.log('\n[OK] All physical guide folders are listed in the UI.');
    }

    if (missingInFS.length > 0) {
        console.log(`\n[CRITICAL] ${missingInFS.length} Guides are listed in UI but DO NOT exist as folders (Broken Links):`);
        missingInFS.forEach(g => console.log(` - ${g}`));
    } else {
        console.log('\n[OK] All UI links have corresponding folders.');
    }

    if (missingInUI.length === 0 && missingInFS.length === 0) {
        console.log('\n[SUCCESS] Synchronization is perfect.');
    }

} catch (err) {
    console.error('Error running script:', err);
}
