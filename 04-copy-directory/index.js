const { copyFile, readdir, mkdir, rm } = require('fs/promises');
const { resolve } = require('path');

const copyDir = async (src, dest) => {
  await rm(dest, { recursive: true, force: true });
  await mkdir(dest);

  const files = await readdir(src);

  for (const file of files) {
    copyFile(resolve(src, file), resolve(dest, file));
  }
};

copyDir(resolve(__dirname, 'files'), resolve(__dirname, 'files-copy'));
