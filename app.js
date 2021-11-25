const { app } = require('electron')
const { startUp } = require('./app/main')
const { showError } = require('./app/services/notifications')
const { configInit } = require('./app/services/config')

const ipcGateway = require('./app/services/ipcGateway')
app.setAppUserModelId(app.getName())

app.on('ready', async () => {
  app.allowRendererProcessReuse = false
  await configInit()
  const isStarted = startUp(true)
  if (isStarted) {
    try {
      ipcGateway.init()
    } catch (error) {
      showError('Could not start the application, config file error')
    }
  } else {
    showError('Could not start the application')
  }
})
