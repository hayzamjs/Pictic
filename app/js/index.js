/* global localStorage ipcRenderer $ location */

// const fetch = require('electron-fetch').default
const { shell, clipboard, nativeImage } = require('electron')
const os = require('os')

const weekdayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

document.addEventListener('DOMContentLoaded', pageLoaded)

async function loadElements (n, offset) {
  const listContainer = document.getElementById('listContainer')
  ipcRenderer.invoke('get-n', n, offset).then((shots) => {
    console.log(shots)
    if (shots.length < 1) {
      listContainer.innerHTML = '<div class="text-center text-xl"><h3>No shots found</h3></div>'
      return
    }
    for (const shot of shots) {
      const randomId = Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10)
      const isIpfs = (shot.image_data.substring(0, 2) === 'Qm')
      const imageLink = (isIpfs === true)
        ? `https://ipfs.infura.io/ipfs/${shot.image_data}?filename=${randomId}.png`
        : `data:image/png;base64,${shot.image_data}`

      const mainDiv = document.createElement('div')
      mainDiv.className = 'flex flex-col pt-4'
      mainDiv.id = randomId

      const imgDiv = document.createElement('div')
      imgDiv.className = 'w-full md:w-64 justify-center items-center bg-white shadow-lg rounded-lg flex flex-col'

      const imgElement = document.createElement('img')
      imgElement.src = imageLink
      imgElement.alt = 'img'
      imgElement.title = 'img'
      imgElement.className = 'w-full h-auto object-cover rounded-t-lg'

      const date = new Date(shot.date)
      const dateString = `${weekdayNames[date.getDay()]} ${date.getHours()}:${date.getMinutes()} ${monthNames[date.getMonth()]} ${date.getDate()} ${date.getFullYear()}`
      const desc = document.createElement('div')
      desc.className = 'w-full p-4 justify-start flex flex-col'
      const titleElement = document.createElement('h4')
      titleElement.className = 'border-b-2 text-2xl'
      titleElement.innerText = dateString

      const titleElement2 = document.createElement('h4')
      titleElement2.className = 'text-1xl font-bold'
      titleElement2.innerText = (isIpfs === true) ? 'IPFS' : 'Clipboard'

      const openButton = document.createElement('button')
      openButton.value = 'button'
      openButton.className = 'my-4 px-4 py-2 text-white hover:bg-blue-700 bg-blue-500'
      openButton.innerText = 'Open'
      openButton.onclick = () => {
        // const b64toBlob = (base64, type = 'application/octet-stream') => fetch(`data:${type};base64,${base64}`).then(res => res.blob())
        // shell.openExternal(b64toBlob(imageLink))
        shell.openExternal(imageLink)
      }

      const copyButton = document.createElement('button')
      copyButton.value = 'button'
      copyButton.className = 'my-4 px-4 py-2 text-white hover:bg-blue-700 bg-blue-500'
      copyButton.innerText = 'Copy To Clipboard'
      copyButton.onclick = () => {
        ipcRenderer.invoke('copy-to-clipboard').then(() => {
          if (imageLink.substring(0, 2) === 'Qm') {
            clipboard.write({
              text: imageLink
            })
          } else {
            clipboard.write({
              image: nativeImage.createFromDataURL(imageLink)
            })
          }
        })
      }

      desc.appendChild(titleElement)
      desc.appendChild(titleElement2)
      desc.appendChild(openButton)
      desc.appendChild(copyButton)

      imgDiv.appendChild(imgElement)
      imgDiv.appendChild(desc)
      mainDiv.appendChild(imgDiv)
      listContainer.appendChild(mainDiv)
    }
  })
}

async function pageLoaded () {
  localStorage.setItem('currentOffset', 10)
  console.log(localStorage.getItem('currentOffset'))
  loadElements(10, 0)
}

$(document).ready(function () {
  let username = os.userInfo().username
  username = username.charAt(0).toUpperCase() + username.slice(1)
  const nameTitle = document.getElementById('nameTitle')
  nameTitle.innerHTML = `${username}'s Shots 📸`
  console.log(username)

  $('#settings').click(function () {
    location.href = 'settings.html'
    console.log('BRUH')
  })

  $('#loadMore').click(function () {
    const currentOffset = parseInt(localStorage.getItem('currentOffset'))
    ipcRenderer.invoke('get-total-count').then((maxCount) => {
      if (currentOffset < maxCount) {
        localStorage.setItem('currentOffset', parseInt(currentOffset + 10))
        loadElements(10, parseInt(currentOffset))
      } else {
        $('#loadMore').remove()
      }
    })
  })

  $('#reLoad').click(function () {
    location.reload()
  })
})
