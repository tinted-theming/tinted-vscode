/*
 * This script creates the necessary entries in package.json based on
 * the themes in ./themes directory
 */
const path = require('path');
const fs = require('fs');

const { parse } = require('jsonc-parser');

const basePath = process.cwd();
const packagePath = path.join(basePath, 'package.json');
const themesPath = path.join(basePath, 'themes');

// Add ./themes to package.json to register the theme in vscode
async function addThemesToPackageJson() {
  const packageJsonThemeObjects = fs.readdirSync(themesPath).map(filename => {
    const themeJson = parse(fs.readFileSync(path.join(themesPath, filename), 'utf8'));

    return { 
      label: filename.replace(/(.+)\.json/, '$1'),
      uiTheme: themeJson.type === 'light' ? 'hc-light' : 'vs-dark',
      path: `./themes/${filename}`
    };
  });

  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  packageJson.contributes.themes = packageJsonThemeObjects;

  fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2), 'utf8');
}

async function main() {
  await addThemesToPackageJson();
}

main();
