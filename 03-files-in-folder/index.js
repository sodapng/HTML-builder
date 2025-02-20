const { readdir, stat } = require('fs');
const { resolve, extname, basename } = require('path');

const basePath = resolve(__dirname, 'secret-folder');

const readDir = (path) => {
  readdir(path, { withFileTypes: true }, (err, files) => {
    for (const file of files) {
      const filePath = resolve(path, file.name);

      if (/^secret-folder$/.test(file.name)) {
        readDir(filePath);
      }

      stat(filePath, (err, stats) => {
        if (stats.isDirectory()) return;

        const ext = extname(file.name);
        const name = basename(filePath, ext);
        const size = stats.size / 1024;
        console.log(`${name} - ${ext} - ${size.toFixed(2)}kb`);
      });
    }
  });
};

readDir(basePath);
