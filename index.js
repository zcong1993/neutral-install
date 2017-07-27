const path = require('path')
const fs = require('fs')
const inquirer = require('inquirer')
const spawn = require('cross-spawn')

const YARNLOCK = 'yarn.lock'
const NPMLOCK = 'package-lock.json'
const ROOT = process.cwd()

let yarnInstalled

module.exports = () => {
  if (fs.existsSync(path.resolve(ROOT, YARNLOCK))) {
    yarnInstalled = yarnInstalled === undefined ? checkYarnInstalled() : yarnInstalled
    if (!yarnInstalled) {
      console.log(`\nThis project recommends to install dependencies with 'yarn', please install it first.`)
      return
    }
    return exec('yarn')
  }
  if (fs.existsSync(path.resolve(ROOT, NPMLOCK))) {
    return exec('npm', ['install'])
  }
  inquirer.prompt([{
    type: 'list',
    name: 'tool',
    message: `Choose an install tools`,
    choices: ['yarn', 'npm']
  }])
    .then(({ tool }) => {
      if (tool === 'yarn') {
        yarnInstalled = yarnInstalled === undefined ? checkYarnInstalled() : yarnInstalled
        if (!yarnInstalled) {
          console.log(`\nPlease install it first.`)
          return
        }
        return exec('yarn')
      }
      return exec('npm', ['install'])
    })
}

function exec(...args) {
  return spawn.sync(...args, { stdio: 'inherit' })
}

function checkYarnInstalled() {
  const command = spawn.sync('yarn', ['--version'])
  const installed = command.stdout && command.stdout.toString().trim()
  yarnInstalled = installed
  return installed
}
