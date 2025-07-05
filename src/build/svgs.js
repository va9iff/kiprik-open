import { readdir, readFile, writeFile } from 'fs/promises';
import { join, extname, basename } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Directory containing SVG files
const svgDir = join(__dirname, '..', 'svgs'); // change if needed

const svgObject = {};

const files = await readdir(svgDir);
for (const file of files) {
    const filePath = join(svgDir, file);
    const content = await readFile(filePath, 'utf8');
    const name = basename(file, '.svg');
    svgObject[name] = content;
}

//console.log(svgObject);

export { svgObject }

const outputPath = join(__dirname, '..', 'built', 'svgs.js');

const jsContent =
  `export const svgs = ${JSON.stringify(svgObject, null, 2)};\n`;

await writeFile(outputPath, jsContent, 'utf8');

