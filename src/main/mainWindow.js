import BrowserWinHandler from './BrowserWinHandler'

const winHandler = new BrowserWinHandler({
  height: 600,
  width: 1000,
  transparent: true,
  frame: false,
  resizable: true,
})

const browserWindow = winHandler.browserWindow

winHandler.onCreated(_browserWindow => {
  winHandler.browserWindow.setAlwaysOnTop(true, "pop-up-menu")
  winHandler.browserWindow.setVisibleOnAllWorkspaces(true);

  winHandler.loadPage('/')
  // Or load custom url
  // _browserWindow.loadURL('https://google.com')
})

export default winHandler
