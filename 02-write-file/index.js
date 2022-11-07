const path = require('path');
const fs = require('fs');
const { stdin: input, stdout: output } = require('process');
const readline = require('readline');
const fn = 'text.txt';
const fp = path.join(__dirname, fn);
const wStream = fs.createWriteStream(fp);
wStream.on('error', (err) => console.error(`Error: ${err.message}`));
const rStream = readline.createInterface({ input, output });
console.log('Hello! Input something, please\n' +
'Press Enter if you want to save your text\n' +
'Press Ctrl+C or enter "exit" to finish\n');
rStream.on('error', (err) => console.error(`Error: ${err.message}`));
rStream.on('close', () => {
  console.log(`\nBye! Your data has been written to ${fn}`);
});
rStream.on('line' || 'SIGINT', (input) => {
  if (input.toString().trim().toLowerCase() === 'exit') {
    return rStream.close();
  } else {
    wStream.write(`${input}\n`);
  }
});