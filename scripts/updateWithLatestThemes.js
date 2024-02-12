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
async function removeThemesfromPackageJson() {
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  packageJson.contributes.themes = [];

  fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2), 'utf8');
}

// Add ./themes to package.json to register the theme in vscode
async function addThemesToPackageJson(system) {
  const systemThemesPath = path.join(themesPath, system);
  const packageJsonThemeObjects = fs.readdirSync(systemThemesPath).map(filename => {
    const themeJson = parse(fs.readFileSync(path.join(systemThemesPath, filename), 'utf8'));

    return { 
      label: filename.replace(/(.+)\.json/, '$1'),
      uiTheme: themeJson.type === 'light' ? 'hc-light' : 'vs-dark',
      path: `./themes/${system}/${filename}`
    };
  });

  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  packageJson.contributes.themes = [...packageJson.contributes.themes, ...packageJsonThemeObjects];

  fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2), 'utf8');
}

async function main() {
  await removeThemesfromPackageJson("base16");
  await addThemesToPackageJson("base16");
  await addThemesToPackageJson("base24");
}

main();
