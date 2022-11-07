const path = require('path');
const fs = require('fs');
const fp = path.join(__dirname, 'text.txt');
const stream = fs.createReadStream(fp, 'utf-8');
let fd = '';
stream.on('data', (c) => fd += c);
stream.on('end', () => console.log(fd));
stream.on('error', (err) => console.log(`Error: ${err.message}`));