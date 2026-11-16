// Fails the run when built pages contain self-labelling copy.
// Phrase list mirrors BANNED in src/utils/copy.ts — keep the two identical.
import fs from 'node:fs';
import path from 'node:path';

const BANNED = ['AI engineer', 'AI-Native', 'years of experience', 'years owning'];
const ROOT = path.resolve('public');

if (!fs.existsSync(ROOT)) {
  console.error('check-copy: public/ not found. Run `npm run build` first.');
  process.exit(1);
}

const htmlFiles = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return htmlFiles(full);
    return entry.name.endsWith('.html') ? [full] : [];
  });

// Look only at what a reader sees: drop scripts, styles and tags.
const visibleText = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .toLowerCase();

const problems = [];
const files = htmlFiles(ROOT);
for (const file of files) {
  const text = visibleText(fs.readFileSync(file, 'utf8'));
  for (const phrase of BANNED) {
    if (text.includes(phrase.toLowerCase())) problems.push(`${path.relative(ROOT, file)}: "${phrase}"`);
  }
}

if (problems.length > 0) {
  console.error(`check-copy: banned copy found\n  ${problems.join('\n  ')}`);
  process.exit(1);
}
console.log(`check-copy: ${files.length} pages clean`);
