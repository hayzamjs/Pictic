const { app } = require('electron')
const { readFile } = require('fs/promises')
const { randomBytes } = require('crypto')

const fs = require('fs')
const path = require('path')

function checkExists (checkPath) {
  if (!checkPath) throw Error('Path is required')
  const isExists = fs.existsSync(checkPath)
  return isExists
}

function getAppDirectory () {
  try {
    const appDirectory = app.getPath('userData')
    const isFR = checkExists(path.join(appDirectory, 'config.json'))
    return { appDir: appDirectory, firstRun: (!isFR) }
  } catch (error) {
    console.log(error)
    return error
  }
}

async function getConfig () {
  const userDataPath = app.getPath('userData')
  const configPath = path.join(userDataPath, 'config.json')
  const data = JSON.parse(await readFile(configPath, 'utf8'))
  return data
}

function getRandomString (n) {
  const randomString = randomBytes(n).toString('hex')
  return randomString
}

module.exports = {
  getAppDirectory,
  getConfig,
  getRandomString
}
