/* global module:true $ */

if (typeof module === 'object') { window.module = module; module = undefined }
if (window.module) module = window.module

const ipcRenderer = require('electron').ipcRenderer
const winID = 1337
const Jimp = require('jimp')

$(() => {
  ipcRenderer.on('blur', () => {
    ipcRenderer.send('destroy', winID)
  })

  const imagePath = decodeURIComponent(window.location.href.split('?image_path=')[1])
  $('#img').attr('src', imagePath)
  $('#img').css({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  })

  $('#img').load(() => {
    ipcRenderer.send('show', winID)
    ipcRenderer.send('focus', winID)
    setTimeout(() => $('#white').fadeOut(200), 100)
  })

  $(document).keyup(e => e.keyCode === 27 && ipcRenderer.send('destroy', winID))

  let dragging = false
  const mouseLoc = { x: 0, y: 0 }
  const dragStart = { x: 0, y: 0 }
  const dragSize = { x: 0, y: 0 }
  const dragEnd = { x: 0, y: 0 }
  const scale = { x: 1, y: 1 }

  $(window).on('mousemove', e => {
    mouseLoc.x = e.clientX
    mouseLoc.y = e.clientY

    if (mouseLoc.x > $(document).width()) mouseLoc.x = $(document).width()
    if (mouseLoc.y > $(document).height()) mouseLoc.y = $(document).height()

    if (mouseLoc.x < 0) mouseLoc.x = 0
    if (mouseLoc.y < 0) mouseLoc.y = 0

    scale.x = $('#img')[0].naturalWidth / $('#img').width()
    scale.y = $('#img')[0].naturalHeight / $('#img').height()

    $('#cords').css({
      top: mouseLoc.y,
      left: mouseLoc.x
    })

    if (dragging) {
      dragSize.x = Math.abs(mouseLoc.x - dragStart.x) + 1
      dragSize.y = Math.abs(mouseLoc.y - dragStart.y) + 1

      if (mouseLoc.y < dragStart.y) {
        $('#selection').css('top', mouseLoc.y)
      }
      if (mouseLoc.x < dragStart.x) {
        $('#selection').css('left', mouseLoc.x)
      }

      $('#selection').css({
        height: dragSize.y,
        width: dragSize.x
      })

      $('#cords').html(Math.round(dragSize.x * scale.x) + '<br />' + Math.round(dragSize.y * scale.y))
    } else {
      $('#cords').html(Math.round(mouseLoc.x * scale.x) + '<br />' + Math.round(mouseLoc.y * scale.y))
    }
  })

  $(window).on('mousedown', e => {
    dragging = true

    dragStart.x = mouseLoc.x
    dragStart.y = mouseLoc.y
    dragSize.x = 0
    dragSize.y = 0
    dragEnd.x = 0
    dragEnd.y = 0

    $('#selection').css({
      top: mouseLoc.y,
      left: mouseLoc.x,
      height: 0,
      width: 0
    })
    $('#selection').show()
  })

  $(window).on('mouseup', e => {
    if (!dragging) return
    dragging = false

    dragEnd.x = mouseLoc.x + 1
    dragEnd.y = mouseLoc.y + 1

    dragSize.x = Math.abs(mouseLoc.x - dragStart.x) + 1
    dragSize.y = Math.abs(mouseLoc.y - dragStart.y) + 1

    $('#selection').hide()
    $('#selection').css({
      height: 0,
      width: 0
    })

    if (dragSize.x <= 1 && dragSize.y <= 1) {
      ipcRenderer.send('destroy', winID)
    } else {
      let left = dragEnd.x > dragStart.x ? dragStart.x : dragEnd.x
      let top = dragEnd.y > dragStart.y ? dragStart.y : dragEnd.y
      left = left * scale.x
      top = top * scale.y

      const width = dragSize.x * scale.x
      const height = dragSize.y * scale.y
      Jimp.read(imagePath, (error, image) => {
        if (error) return
        image.crop(left, top, width, height)
        image.write(imagePath, () => {
          ipcRenderer.send('upload', imagePath)
        })
      })
    }
  })
})
