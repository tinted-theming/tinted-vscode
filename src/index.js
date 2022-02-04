import { convertTheme } from 'monaco-vscode-textmate-theme-converter'
import { promises as fs } from 'fs'
import path from 'path'
import _ from 'lodash'
import yaml from 'js-yaml'
import mustache from 'mustache'
import Mustache from 'mustache'

const SCHEMES_PATH = 'schemes'
const OUT = 'out'

async function loadSourceThemes(schemasPath) {
  const res = []
  const dirs = await fs.readdir(schemasPath)
  for (const dir of dirs) {
    const files = await fs.readdir(path.join(schemasPath, dir))
    for (const file of files) {
      if (_.endsWith(file, 'yaml')) {
        const filePath = path.join(schemasPath, dir, file)
        const content = await fs.readFile(filePath, 'utf-8')
        const yamlConfig = yaml.load(content)
        res.push(applyTheme(yamlConfig))

      }
    }
  }
  return res
}

function applyTheme(data) {
  const newTheme = {
    scheme: data.scheme
  }
  for (const field in data) {
    if (_.startsWith(field, 'base')) {
      newTheme[`${field}-hex`] = data[field]
    }
  }

  newTheme['baseWarn'] = data.baseWarn || 'ffcc00'
  newTheme['baseErr'] = data.baseErr || 'cc3300'
  newTheme['baseInfo'] = data.baseInfo || 'bbbbbb'
  newTheme['baseHint'] = data.baseWarn || '99cc33'
  return newTheme
}

async function getTemplate(theme) {
  const template = theme.template || 'default'
  const content = await fs.readFile(path.join('templates', 'vscode', 'templates', `${template}.mustache`), 'utf-8')
  return content
}
function isDark(theme) {
  if (_.includes('theme', 'dark') || _.includes('theme', 'night')) {
    return true
  }
  return theme['style'] == 'dark'
}

async function main() {
  const sourceThemes = await loadSourceThemes(SCHEMES_PATH)
//  console.log(sourceThemes)
  for (const theme of sourceThemes) {
    const compiled = Mustache.render(await getTemplate(theme), theme)
    const themeReady = convertTheme(JSON.parse(compiled))
    themeReady['inherit'] = true
    themeReady['base'] = 'vs'// isDark(theme) ? 'vs-dark' : 'vs'
    const themeString = JSON.stringify(themeReady, undefined, ' ')
    await fs.writeFile(path.join(OUT, `${theme.scheme}.json`), themeString)
  }
  
}


main()
