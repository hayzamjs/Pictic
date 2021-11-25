const { create } = require('ipfs-http-client')
const { clipboard, nativeImage } = require('electron')
const { getConfig } = require('./utils')
const { showSuccess, showError } = require('./notifications')
const { DB } = require('./db')
const fs = require('fs').promises
const dataStore = new DB()

async function uploadFile (filePath) {
  try {
    const config = await getConfig()
    const file = await fs.readFile(filePath)
    const isClipBoard = (config.storageLocation.clipStorage === true)
    if (isClipBoard) {
      clipboard.writeImage(nativeImage.createFromPath(filePath))
      const base64image = file.toString('base64')
      dataStore.put(base64image)
      showSuccess('Screenshot copied to clipboard')
      return true
    } else {
      let ipfsNodeObj
      if (config.storageLocation.scalaIpfs) {
        ipfsNodeObj = config.scalaIpfs
      } else {
        ipfsNodeObj = config.localIpfs
      }

      const ipfs = create(ipfsNodeObj)
      const fileBuffer = Buffer.from(file)
      const fileAdded = await ipfs.add(fileBuffer)
      const ipfsUrl = `https://ipfs.infura.io/ipfs/${fileAdded.cid.toString()}?filename=image.png`
      dataStore.put(fileAdded.cid.toString())
      clipboard.writeText(ipfsUrl)
      showSuccess('Screenshot uploaded to IPFS, link in clipboard')
      return fileAdded.cid.toString()
    }
  } catch (error) {
    if (error.errno === 'ECONNREFUSED') {
      showError('Could not connect to IPFS daemon, please make sure it is running.')
    }
    return error
  }
}

module.exports = {
  uploadFile
}
