const { app, BrowserWindow, globalShortcut, Tray, Menu, screen } = require('electron')
const { fullscreenScreenshot } = require('./services/screenshot')
const { uploadFile } = require('./services/upload')
const { showError, showMessage } = require('./services/notifications')
const { getRandomString } = require('./services/utils')

const fs = require('fs')
const os = require('os')
const path = require('path')
const interWindows = require('./services/interWindows')
const ipcGateway = require('./services/ipcGateway')

function startUp (minimize, page) {
  try {
    const mainWindow = new BrowserWindow({
      width: 412,
      height: 915,
      frame: false,
      resizable: false,
      backgroundColor: '#FFF',
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
      },
      skipTaskbar: ((minimize === true))
    })
    if (page === 'index') {
      mainWindow.loadFile('app/index.html')
    }

    if (page === 'about') {
      mainWindow.loadFile('app/about.html')
    }

    if (minimize) {
      mainWindow.minimize()
      showMessage('Pictic is now minimized to the tray.')
    }
    registerPresses()
    setupTray()
    return true
  } catch (err) {
    showError(err)
    app.quit()
  }
}

function setupTray () {
  const trayIcon = (app.isPackaged === false)
    ? path.join(__dirname, '../assets/logo-32x32.png')
    : path.join(process.resourcesPath, ('assets/logo-32x32.png'))

  const tray = new Tray(trayIcon)
  const template = [
    {
      type: 'separator'
    },
    {
      label: 'Show App',
      click: function () {
        startUp(false, 'index')
      }
    },
    {
      label: `About ${app.getName()} ${app.getVersion()}`,
      click: function () {
        startUp(false, 'about')
      }
    },
    {
      label: 'Quit',
      click: function () {
        app.quit()
      }
    }
  ]
  const contextMenu = Menu.buildFromTemplate(template)
  tray.setContextMenu(contextMenu)
  tray.setToolTip('Pictic')
}

function saveImage (pngBuffer) {
  const fileString = getRandomString(8)
  const fileName = `${fileString}.png`
  const filePath = path.join(os.tmpdir(), fileName)
  fs.writeFileSync(filePath, pngBuffer)

  return filePath
}

function registerPresses () {
  const displays = screen.getAllDisplays()
  const primaryDisplay = screen.getPrimaryDisplay()
  const { width, height } = primaryDisplay.workAreaSize
  /* To take a screenshot completely */
  globalShortcut.register('Shift+CommandOrControl+8', async () => {
    fullscreenScreenshot(function (pngBuffer) {
      const fileName = saveImage(pngBuffer)
      try {
        uploadFile(fileName)
      } catch (error) {
        showError(error)
      }
    }, [width, height], displays, true)
  })

  /* To take a screenshot completely */
  globalShortcut.register('Shift+CommandOrControl+9', async () => {
    fullscreenScreenshot(function (pngBuffer) {
      const filePath = saveImage(pngBuffer)
      const allScreens = screen.getAllDisplays()

      allScreens.forEach(s => {
        s.bounds.maxX = s.bounds.x + s.bounds.width
        s.bounds.maxY = s.bounds.y + s.bounds.height
      })
      const minX = allScreens.reduce((pv, cv) => pv < cv.bounds.x ? pv : cv.bounds.x, 0)
      const minY = allScreens.reduce((pv, cv) => pv < cv.bounds.y ? pv : cv.bounds.y, 0)
      const maxWidth = allScreens.reduce((pv, cv) => pv <= cv.bounds.maxX ? cv.bounds.maxX : pv, 0) + Math.abs(minX)
      const maxHeight = allScreens.reduce((pv, cv) => pv <= cv.bounds.maxY ? cv.bounds.maxY : pv, 0) + Math.abs(minY)

      /* Start a cropWindow and begin cropping */
      let cropWindow = new BrowserWindow({
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: false
        },
        width: maxWidth,
        height: maxHeight,
        show: false,
        frame: false,
        alwaysOnTop: true,
        skipTaskbar: true,
        autoHideMenuBar: true,
        enableLargerThanScreen: true,
        thickFrame: false
      })
      cropWindow.setSize(width, height)
      cropWindow.on('close', () => {
        cropWindow = null
      })
      interWindows.cw = cropWindow

      ipcGateway.register()
      cropWindow.loadURL(`file://${path.join(app.getAppPath(), 'app', `crop-window.html?image_path=${encodeURIComponent(filePath)}`)}`)
    }, [width, height], displays)
  })
}

module.exports = {
  startUp: startUp,
  setupTray: setupTray,
  registerPresses: registerPresses
}
