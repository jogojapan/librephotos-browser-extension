const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const glob = require('glob');

const platform = process.argv[2] || 'chromium';  // e.g., 'gecko' or 'chromium'

let manifest;
let outputFile;

if (platform === 'gecko') {
  manifest = require('./manifest-gecko.json');
  outputFile = 'extension.xpi';  // Output for Firefox
} else {
  manifest = require('./manifest-chromium.json');
  outputFile = 'extension.zip';  // Output for Chromium
}

// Write the manifest.json
fs.writeFileSync('manifest.json', JSON.stringify(manifest, null, 2));

// Function to get files matching a pattern
function getFiles(pattern) {
  return glob.sync(pattern, { nodir: true });  // Get files only, excluding directories
}

// Get the files to include
const jsFiles = getFiles('*.js');
const htmlFiles = getFiles('*.html');
const filesToAdd = [...jsFiles, ...htmlFiles, 'manifest.json'];

// Create the archive
const output = fs.createWriteStream(outputFile);
const archive = archiver('zip', { zlib: { level: 9 } });  // Use ZIP format for both

output.on('close', () => {
  console.log(`${archive.pointer()} total bytes archived.`);
  console.log(`Extension built as ${outputFile}`);
});

archive.on('error', (err) => {
  throw err;
});

archive.pipe(output);

// Add files to the archive
filesToAdd.forEach(file => {
  if (fs.existsSync(file)) {
    archive.file(file, { name: path.basename(file) });  // Add file with its original name
  } else {
    console.warn(`File not found: ${file}`);
  }
});

archive.finalize();
