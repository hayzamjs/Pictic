const { app, Notification } = require('electron')
const path = require('path')

let trayIcon = (app.isPackaged === false)
  ? path.join(__dirname, '../assets/logo-32x32.png')
  : path.join(process.resourcesPath, ('assets/logo-32x32.png'))

function showError (msg) {
  new Notification({ icon: trayIcon, title: 'Pictic Error', body: msg.toString() }).show()
}

function showSuccess (msg) {
  new Notification({ icon: trayIcon, title: 'Pictic Success', body: msg.toString() }).show()
}

function showMessage (msg) {
  new Notification({ icon: trayIcon, body: msg.toString() }).show()
}

module.exports = {
  showError,
  showSuccess,
  showMessage
}
