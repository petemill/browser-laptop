function ensurePaintWebviewFirstAttach (webview) {
  window.requestAnimationFrame(() => {
    webview.style.display = 'none'
    window.requestAnimationFrame(() => {
      webview.style.display = ''
    })
  })
}

function ensurePaintWebviewSubsequentAttach (webview) {
  window.requestAnimationFrame(() => {
    webview.style.top = '1px'
    window.requestAnimationFrame(() => {
      webview.style.top = ''
    })
  })
}

module.exports = class SingleWebviewDisplay {
  constructor ({containerElement, classNameWebview}) {
    this.isAttached = false
    this.webview = this.createWebview()
    this.webview.classList.add(classNameWebview)
    containerElement.appendChild(this.webview)
  }

  attachActiveTab (tabId) {
    console.log('webviewDisplay: attaching tab id', tabId)
    require('electron').remote.getWebContents(tabId, (webContents) => {
      if (!webContents || webContents.isDestroyed()) {
        return
      }
      this.webview.attachGuest(webContents.guestInstanceId, webContents)
    })
    this.isAttached = true
  }

  createWebview () {
    console.log('creating a webview')
    const webview = document.createElement('webview')
    return webview
  }

  focusActiveWebview () {

  }

  getActiveWebview () {
    return this.webview
  }
}
