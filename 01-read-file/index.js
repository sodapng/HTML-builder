const { createReadStream } = require('fs');
const { resolve } = require('path');
const { stdout } = require('process');

const file = resolve(__dirname, 'text.txt');
const readableStream = createReadStream(file, { encoding: 'utf8' });
readableStream.pipe(stdout);
