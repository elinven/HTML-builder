const path = require('path');
const fs = require('fs');
const fsPromises = require('fs/promises');
const assetsFolder = 'assets';
const stylesFolder = 'styles';
const styleFile = 'style.css';
const template = 'template.html';
const htmlFolder = 'components';
const htmlFile = 'index.html';
const outputFolder = 'project-dist';

async function copyDir(folderPath, folderCopyPath) {
  await fsPromises.rm(folderCopyPath, {recursive: true, force: true});
  await fsPromises.mkdir(folderCopyPath, {recursive: true});
  const folder = await fsPromises.readdir(folderPath);
  for (const obj of folder) {
    const source = path.join(folderPath, obj);
    const sourceCopy = path.join(folderCopyPath, obj);
    const st = await fsPromises.stat(source);
    if (st.isFile()) await fsPromises.copyFile(source, sourceCopy);
    else copyDir(source, sourceCopy);
  }
}

async function mergeStyles(sourcePath, outputPath) {
  const wStream = fs.createWriteStream(outputPath);
  const folder = await fsPromises.readdir(sourcePath, {withFileTypes: true});
  for (const obj of folder) {
    if (obj.isFile()) {
      const fPath = path.join(sourcePath, obj.name);
      if (path.extname(fPath) === '.css') {
        const rStream = fs.createReadStream(fPath);
        rStream.pipe(wStream, {end: false});
      }
    }
  }
}

async function buildHtml(tmplPath, sourcePath, outputPath) {
  let htmlData = '';
  const wStream = fs.createWriteStream(outputPath);
  const rStream = fs.createReadStream(tmplPath, 'utf-8');
  rStream.on('data', (c) => htmlData += c);
  rStream.on('end', async () => {
    const tags = htmlData.match(/{{([^\s]+)}}/g);
    for (let tag of tags) {
      const componentPath = path.join(sourcePath, `${tag.replace(/[{}]/g, '')}.html`);
      const componentContent = await fsPromises.readFile(componentPath);
      htmlData = htmlData.replace(tag, componentContent);
    }
    wStream.write(htmlData);
  });
  rStream.on('error', (err) => console.log(`Error: ${err.message}`));
}

(async () => {
  try {
    const dir = path.join(__dirname, assetsFolder);
    const dirCopy = path.join(__dirname, outputFolder, assetsFolder);
    await copyDir(dir, dirCopy);
    const stylesDir = path.join(__dirname, stylesFolder);
    const resFile = path.join(__dirname, outputFolder, styleFile);
    await mergeStyles(stylesDir, resFile);
    const templatePath = path.join(__dirname, template);
    const componentsPath = path.join(__dirname, htmlFolder);
    const htmlPath = path.join(__dirname, outputFolder, htmlFile);
    await buildHtml(templatePath, componentsPath, htmlPath);
    console.log(`Project successfully built in "${outputFolder}" folder`);
  } catch (err) {
    console.log(`Error: ${err.message}`);
  }
})();