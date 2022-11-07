const path = require('path');
const fs = require('fs/promises');
const folderName = 'files';
const folderCopyName = 'files-copy';

(async function copyDir(dir, dirCopy) {
  try {
    const folderPath = path.join(__dirname, dir);
    const folderCopyPath = path.join(__dirname, dirCopy);
    await fs.rm(folderCopyPath, {recursive: true, force: true});
    await fs.mkdir(folderCopyPath, {recursive: true});
    const folder = await fs.readdir(folderPath);
    for (const obj of folder) {
      const source = path.join(folderPath, obj);
      const sourceCopy = path.join(folderCopyPath, obj);
      await fs.copyFile(source, sourceCopy);
    }
    console.log(`Folder "${dir}" has been successfully copied to "${dirCopy}" folder`);
  } catch (err) {
    console.log(`Error: ${err.message}`);
  }
})(folderName, folderCopyName);
