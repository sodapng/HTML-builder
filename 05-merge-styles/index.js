const { createReadStream, createWriteStream } = require('fs');
const { rm, readdir } = require('fs/promises');
const { resolve, extname } = require('path');

const mergeStyles = async (src, dest) => {
  await rm(resolve(dest, 'bundle.css'), { force: true });
  const files = await readdir(src);

  for (const file of files) {
    if (extname(file) === '.css') {
      const readableStream = createReadStream(resolve(src, file), {
        encoding: 'utf8',
      });

      const writableStream = createWriteStream(resolve(dest, 'bundle.css'), {
        flags: 'a',
      });

      readableStream.pipe(writableStream);
    }
  }
};

mergeStyles(resolve(__dirname, 'styles'), resolve(__dirname, 'project-dist'));
