const fs = require('fs');
const path = require('path');
const guidesDir = path.join(process.cwd(), 'app/guias');
const folders = fs.readdirSync(guidesDir).filter(f => fs.statSync(path.join(guidesDir, f)).isDirectory());
let mismatches = 0;

folders.forEach(folder => {
  const pagePath = path.join(guidesDir, folder, 'page.tsx');
  if (fs.existsSync(pagePath)) {
    const content = fs.readFileSync(pagePath, 'utf8');
    const match = content.match(/createGuideMetadata\s*\(\s*['"]([^'"]+)['"]/);
    if (match) {
      const slug = match[1];
      if (slug !== folder) {
        console.log(`[MISMATCH] Folder: ${folder} | Prop: ${slug}`);
        mismatches++;
      }
    } else {
       // Check for guideMetadata exported instead
       const idMatch = content.match(/id:\s*['"]([^'"]+)['"]/);
       if (idMatch && idMatch[1] !== folder) {
          console.log(`[MISMATCH ID] Folder: ${folder} | ID: ${idMatch[1]}`);
          mismatches++;
       }
    }
  }
});

console.log(`\nTotal folders checked: ${folders.length}`);
console.log(`Total mismatches found: ${mismatches}`);
