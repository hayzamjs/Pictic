/* global $ */

const { shell } = require('electron')

$(document).ready(function () {
  $('#gotoDash').click(function () {
    window.location.href = 'index.html'
  })

  $('#gotoGit').click(function () {
    shell.openExternal('https://github.com/hayzamjs/pictic')
  })

  $('#openHayzamGithub').click(function () {
    shell.openExternal('https://github.com/hayzamjs')
  })
})
