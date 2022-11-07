const path = require('path');
const fs = require('fs/promises');
const sf = path.join(__dirname,'secret-folder');
const options = {withFileTypes: true};
(async () => {
  try {
    const folder = await fs.readdir(sf, options);
    for (const obj of folder) {
      if (obj.isFile()) {
        const fPath = path.join(sf, obj.name);
        const fName = path.parse(fPath).name;
        const fExt = path.extname(fPath).slice(1);
        const fSize = (await fs.stat(fPath)).size;
        console.log(`${fName} - ${fExt} - ${fSize / 1000}kb`);
      }
    }
  } catch (err) {
    console.log(`Error: ${err.message}`);
  }
})();