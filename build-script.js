const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const glob = require('glob');

const platform = process.argv[2] || 'chromium';

let manifest;
let outputFile;

if (platform === 'gecko') {
  manifest = require('./manifest-gecko.json');
  outputFile = 'librephotos-browser-extension.xpi';
} else {
  manifest = require('./manifest-chromium.json');
  outputFile = 'librephotos-browser-extension.zip';
}

fs.writeFileSync('manifest.json', JSON.stringify(manifest, null, 2));

function getFiles(pattern) {
  return glob.sync(pattern, { nodir: true });
}

const jsFiles = getFiles('*.js');
const htmlFiles = getFiles('*.html');
const iconFiles = getFiles('icons/*.png');
const filesToAdd = [...jsFiles, ...htmlFiles, ...iconFiles, 'manifest.json'];

const output = fs.createWriteStream(outputFile);
const archive = archiver('zip', { zlib: { level: 9 } });

output.on('close', () => {
  console.log(`${archive.pointer()} total bytes archived.`);
  console.log(`Extension built as ${outputFile}`);
});

archive.on('error', (err) => {
  throw err;
});

archive.pipe(output);

filesToAdd.forEach(file => {
  if (fs.existsSync(file)) {
    archive.file(file, { name: file });
  } else {
    console.warn(`File not found: ${file}`);
  }
});

archive.finalize();
