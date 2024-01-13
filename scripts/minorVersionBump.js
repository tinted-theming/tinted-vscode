/*
 * Add minor version bump to package.json version value
 *
 */
const path = require('path');
const fs = require('fs');
const util = require('node:util');
const { exec } = require('child_process');

const execPromise = util.promisify(exec);
const basePath = process.cwd();
const packagePath = path.join(basePath, 'package.json');

async function addMinorPackagejsonVersionBump() {
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  const packageJsonVersion = packageJson.version.split('.');
  packageJson.version = `${packageJsonVersion[0]}.${Number(packageJsonVersion[1]) + 1}.${packageJsonVersion[2]}`;

  fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2), 'utf8');
}

async function main() {
  const { stdout } = await execPromise('git status --porcelain');

  if (stdout) {
    await addMinorPackagejsonVersionBump();
  }
}

main();
