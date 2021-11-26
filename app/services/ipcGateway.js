const { ipcMain, BrowserWindow } = require('electron')
const interWindows = require('./interWindows')
const { uploadFile } = require('./upload')
const { DB } = require('./db')
const { showSuccess, showMessage } = require('./notifications')
const { updateUploadLocation } = require('./config')

const dataStore = new DB()

exports.init = () => {
  ipcMain.handle('get-n', async (event, n, offset) => {
    const result = dataStore.get(n, offset)
    return result
  })

  ipcMain.handle('get-total-count', async (event) => {
    const result = dataStore.getCount()
    return result
  })

  ipcMain.on('destroy', () => {
    if (!interWindows.cw) return
    interWindows.cw.close()
  })

  ipcMain.on('show', (event, arg) => {
    if (!interWindows.cw) return
    interWindows.cw.show()
  })

  ipcMain.on('upload', (event, arg) => {
    uploadFile(arg).then(res => {
      interWindows.cw.close()
    })
  })

  ipcMain.on('focus', () => {
    if (!interWindows.cw) return
    interWindows.cw.focus()
  })

  ipcMain.handle('copy-to-clipboard', () => {
    showSuccess('Copied link to clipboard')
  })

  ipcMain.handle('close-window', () => {
    const window = BrowserWindow.getFocusedWindow()
    window.close()
    showMessage('Pictic is now minimized to the tray.')
  })

  ipcMain.handle('minimize-window', () => {
    const window = BrowserWindow.getFocusedWindow()
    window.minimize()
  })

  ipcMain.handle('set-default-upload-location', (event, arg) => {
    updateUploadLocation(arg)
  })
}

exports.register = () => {
  if (!interWindows.cw) return

  interWindows.cw.on('blur', () => {
    console.log('[Window Event] blur')
    interWindows.cw.send('blur', null)
  })
}
