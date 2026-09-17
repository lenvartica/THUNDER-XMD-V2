import fs from 'node:fs';
import path from 'node:path';
const required = ['package.json','.env.example','README.md','src/index.js','src/connection/whatsapp.js','src/commands/registry.js','public/index.html'];
const missing = required.filter((file) => !fs.existsSync(path.resolve(file)));
if (missing.length) { console.error(`Missing files: ${missing.join(', ')}`); process.exit(1); }
console.log(`Build check passed: ${required.length} required files found.`);
