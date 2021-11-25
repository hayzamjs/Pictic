const { getAppDirectory } = require('./utils')
const { showSuccess, showError } = require('./notifications')

const fs = require('fs')
const path = require('path')

const defaultConfig = {
  storageLocation: {
    scalaIpfs: true,
    localIpfs: false,
    clipStorage: false
  },

  scalaIpfs: {
    host: 'pyazo-add.scalaproject.io',
    port: 443,
    protocol: 'https'
  },

  localIpfs: {
    host: 'localhost',
    port: '5001',
    protocol: 'http'
  },

  defaultIpfsGateway: [
    'https://ipfs.io',
    'https://ipfs.infura.io',
    'https://ipfs.cloudflare.com'
  ],

  dbLocation: path.join(getAppDirectory().appDir, 'entries.db')
}

exports.configInit = () => {
  try {
    const appDir = getAppDirectory()
    if (appDir.firstRun) {
      const configJson = JSON.stringify(defaultConfig, null, 2)
      fs.writeFileSync(path.join(appDir.appDir, 'config.json'), configJson)
    }
    return
  } catch (error) {
    console.log(error)
    return error
  }
}

exports.updateUploadLocation = (location) => {
  try {
    const appDir = getAppDirectory()
    const configJson = JSON.parse(fs.readFileSync(path.join(appDir.appDir, 'config.json'), 'utf8'))
    let msg = ''
    if (location === 'scalaIpfs') {
      configJson.storageLocation.scalaIpfs = true
      configJson.storageLocation.localIpfs = false
      configJson.storageLocation.clipStorage = false
      msg = 'Remote IPFS node is now the default'
    }
    if (location === 'localIpfs') {
      configJson.storageLocation.localIpfs = true
      configJson.storageLocation.scalaIpfs = false
      configJson.storageLocation.clipStorage = false
      msg = 'Local IPFS node is now the default'
    }
    if (location === 'clipBoard') {
      configJson.storageLocation.clipStorage = true
      configJson.storageLocation.scalaIpfs = false
      configJson.storageLocation.localIpfs = false
      msg = 'Clipboard is now the default'
    }
    const configJsonString = JSON.stringify(configJson, null, 2)
    fs.writeFileSync(path.join(appDir.appDir, 'config.json'), configJsonString)
    showSuccess(msg)
    return
  } catch (e) {
    showError(e.msg)
    return e
  }
}
