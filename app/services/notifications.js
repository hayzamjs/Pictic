const { Notification } = require('electron')

function showError (msg) {
  new Notification({ icon: 'assets/logo-32x32.png', title: 'Error', body: msg.toString() }).show()
}

function showSuccess (msg) {
  new Notification({ icon: 'assets/logo-32x32.png', title: 'Success', body: msg.toString() }).show()
}

function showMessage (msg) {
  new Notification({ icon: 'assets/logo-32x32.png', body: msg.toString() }).show()
}

module.exports = {
  showError,
  showSuccess,
  showMessage
}
