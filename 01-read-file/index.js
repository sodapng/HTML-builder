const { createReadStream } = require('fs');
const { resolve } = require('path');

const filePath = resolve(__dirname, 'text.txt');
const readableStream = createReadStream(filePath, { encoding: 'utf8' });
readableStream.pipe(process.stdout);
