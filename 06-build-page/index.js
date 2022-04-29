const { createReadStream, createWriteStream } = require('fs');
const { readdir, rm, mkdir, copyFile, readFile } = require('fs/promises');
const { resolve, extname, basename } = require('path');

class BuildPage {
  constructor(entry, components, styles, assets) {
    this.entry = entry;
    this.components = components;
    this.styles = styles;
    this.assets = assets;
    this.dist = resolve(__dirname, 'project-dist');
    this.basePath = resolve(__dirname);
    this.collect();
  }

  async collect() {
    await rm(this.dist, { recursive: true, force: true });
    await mkdir(this.dist);
    await mkdir(resolve(this.dist, 'assets'));
    this.mergeStyles();
    this.mergeHTML();
    this.cloneAssets(this.assets);
  }

  async cloneAssets(src, dest) {
    const files = await readdir(src, { withFileTypes: true });

    for (const file of files) {
      if (file.isDirectory()) {
        await mkdir(resolve(this.dist, 'assets', file.name));
        this.cloneAssets(
          resolve(src, file.name),
          resolve(this.dist, 'assets', file.name)
        );
      } else {
        await copyFile(resolve(src, file.name), resolve(dest, file.name));
      }
    }
  }

  async getFiles(ext, path) {
    const files = await readdir(path, { withFileTypes: true });
    return files.filter((file) => extname(file.name) === ext);
  }

  async mergeStyles() {
    const files = await this.getFiles('.css', this.styles);

    for (const file of files) {
      const filePath = resolve(this.styles, file.name);
      const readableStream = createReadStream(filePath, { encoding: 'utf8' });
      const writableStream = createWriteStream(
        resolve(this.dist, 'style.css'),
        { flags: 'a' }
      );
      readableStream.pipe(writableStream);
    }
  }

  async mergeHTML() {
    let template = await readFile(this.entry, { encoding: 'utf8' });
    const files = await this.getFiles('.html', this.components);

    for (const file of files) {
      const filePath = resolve(this.components, file.name);
      const data = await readFile(filePath, { encoding: 'utf8' });
      const name = basename(filePath, extname(filePath));
      template = template.replace(`{{${name}}}`, data);
    }

    const writableStream = createWriteStream(resolve(this.dist, 'index.html'));
    writableStream.write(template);
  }
}

new BuildPage(
  resolve(__dirname, 'template.html'),
  resolve(__dirname, 'components'),
  resolve(__dirname, 'styles'),
  resolve(__dirname, 'assets')
);
