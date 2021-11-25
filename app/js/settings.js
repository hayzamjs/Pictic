/* global $ location */

const { ipcRenderer } = require('electron')

$(document).ready(function () {
  $('#gotoDashboard').on('click', function () {
    location.href = 'index.html'
  })

  $('#gotoAbout').on('click', function () {
    location.href = 'about.html'
  })

  $('#applySettings').on('click', function () {
    const defaultLocation = $('#defaultLocation').val()
    ipcRenderer.invoke('set-default-upload-location', defaultLocation).then(() => {
      console.log(`default location set to ${defaultLocation}`)
    })
  })
})
