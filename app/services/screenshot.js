const { desktopCapturer, dialog } = require('electron')

function createScreenOptionsArr (n) {
  const options = []
  for (let i = 0; i < n; i++) {
    options.push(`Screen ${i + 1}`)
  }
  options.push('Cancel')
  return options
}

async function fullscreenScreenshot (callback, dimensions, displays) {
  const _this = this
  this.callback = callback

  const screenCount = displays.length

  const options = {
    types: ['screen'],
    thumbnailSize: {
      width: dimensions[0],
      height: dimensions[1]
    }
  }

  this.handleCapture = function (e) {
    _this.callback(e.thumbnail.toPNG())
  }

  desktopCapturer.getSources(options).then(async sources => {
    if (screenCount > 1) {
      const screenOptions = createScreenOptionsArr(screenCount)

      const screenSelectDiag = dialog.showMessageBoxSync({
        type: 'question',
        title: 'Multiple Screens',
        detail: 'Select a screen to capture',
        buttons: screenOptions
      })

      for (const source of sources) {
        if ((source.name === screenOptions[screenSelectDiag])) {
          try {
            _this.handleCapture(source)
          } catch (e) {
            console.log(e)
          }
        }
      }
    } else {
      for (const source of sources) {
        if ((source.name === 'Screen 1')) {
          try {
            _this.handleCapture(source)
          } catch (e) {
            console.log(e)
          }
        }
      }
    }
  })
}

module.exports = {
  fullscreenScreenshot
}
