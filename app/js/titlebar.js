/* global $ */
const { ipcRenderer } = require('electron')

$(document).ready(function () {
  $('#titlebar-btn-close').click(function () {
    console.log('BRUH')
    ipcRenderer.invoke('close-window').then(() => {
    })
  })

  $('#titlebar-btn-minimize').click(function () {
    ipcRenderer.invoke('minimize-window').then(() => {
    })
  })
})
