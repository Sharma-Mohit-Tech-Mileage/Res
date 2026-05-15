const fs = require('fs');
const path = require('path');
const babel = require('@babel/core');

const componentsRoot = path.join(__dirname, '..', 'src', 'components');

function walkJsFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...walkJsFiles(fullPath));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith('.js')) {
      files.push(fullPath);
    }
  }

  return files;
}

describe('All JS components compile with Babel', () => {
  const jsComponentFiles = walkJsFiles(componentsRoot)
    .map((absPath) => path.relative(path.join(__dirname, '..'), absPath))
    .sort();

  test('discovers component JS files', () => {
    expect(jsComponentFiles.length).toBeGreaterThan(0);
  });

  test.each(jsComponentFiles)('compiles %s', (relativePath) => {
    const absolutePath = path.join(__dirname, '..', relativePath);
    const source = fs.readFileSync(absolutePath, 'utf8');

    const output = babel.transformSync(source, {
      filename: absolutePath,
      configFile: path.join(__dirname, '..', 'babel.config.js'),
      babelrc: false,
      sourceMaps: false,
      ast: false,
      comments: false,
    });

    expect(output).toBeTruthy();
    expect(typeof output.code).toBe('string');
    expect(output.code.length).toBeGreaterThan(0);
  });
});
