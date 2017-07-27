const path = require('path')
const fs = require('fs')
const inquirer = require('inquirer')
const spawn = require('cross-spawn')

const YARNLOCK = 'yarn.lock'
const NPMLOCK = 'package-lock.json'
const ROOT = process.cwd()

module.exports = () => {
  if (fs.existsSync(path.resolve(ROOT, YARNLOCK))) {
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
        return exec('yarn')
      }
      return exec('npm', ['install'])
    })
}

function exec(...args) {
  return spawn.sync(...args, { stdio: 'inherit' })
}
