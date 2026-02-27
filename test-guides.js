import { getAllGuides } from './lib/guides.js';

const guides = getAllGuides();
console.log(`Found ${guides.length} guides.`);
if (guides.length > 0) {
    console.log('First guide:', guides[0]);
}
