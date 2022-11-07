const path = require('path');
const fs = require('fs');
outputFolder = 'project-dist';
outputFile = 'bundle.css';
const srcPath = path.join(__dirname, 'styles');
const bundlePath = path.join(__dirname, outputFolder, outputFile);
(async () => {
  try {
    const wStream = fs.createWriteStream(bundlePath);
    const folder = await fs.promises.readdir(srcPath, {withFileTypes: true});
    for (const obj of folder) {
      if (obj.isFile()) {
        const fPath = path.join(srcPath, obj.name);
        if (path.extname(fPath) === '.css') {
          const rStream = fs.createReadStream(fPath);
          rStream.pipe(wStream, {end: false});
        }
      }
    }
    console.log(`The style bundling has been successfully written to file "${outputFile}" in "${outputFolder}" folder`)
  } catch (err) {
    console.log(`Error: ${err.message}`);
  }
})();
