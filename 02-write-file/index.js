const { createInterface } = require('readline');
const { stdin: input, stdout: output, exit } = require('process');
const { createWriteStream } = require('fs');
const { resolve } = require('path');

const filePath = resolve(__dirname, 'text.txt');
const writableStream = createWriteStream(filePath, { flags: 'a' });
const rl = createInterface({ input, output });
output.write('Hello, stranger!\n');

rl.on('line', (line) => {
  if (/^exit$/.test(line)) {
    return rl.close();
  }

  writableStream.write(`${line}\n`);
})
  .on('SIGINT', () => rl.close())
  .on('close', () => {
    writableStream.end();
    writableStream.on('finish', () => {
      output.write(`All your sentences have been written to ${filePath}`);
    });

    setImmediate(() => {
      exit(0);
    });
  });
