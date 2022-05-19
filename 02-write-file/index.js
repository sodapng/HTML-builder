const { createInterface } = require('readline');
const { stdin: input, stdout: output, exit } = require('process');
const { createWriteStream } = require('fs');
const { resolve } = require('path');

const filePath = resolve(__dirname, 'text.txt');
const writableStream = createWriteStream(filePath, { flags: 'a' });
const rl = createInterface({ input, output });
console.log('Hello, stranger!');

rl.on('line', (line) => {
  if (line.match(/^exit$/i)) {
    rl.close();
    return;
  }

  writableStream.write(`${line}\n`);
});

rl.on('SIGINT', () => rl.close());

rl.on('close', () => {
  writableStream.end();
  writableStream.on('finish', () => {
    console.log(`All your sentences have been written to ${filePath}`);
  });

  setImmediate(() => {
    exit(1);
  });
});
