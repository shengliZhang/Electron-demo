import { app, BrowserWindow, screen, ipcMain, Menu, globalShortcut } from 'electron'
// import autoStart from './utils/autoStart'
// import { setMenu, findReopenMenuItem } from './utils/menu'
const fs = require('fs')
const path = require('path')

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  app.quit()
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

const createWindow = () => {
  const config = fs.readFileSync(path.join(__dirname, '../config.json'))
  const size = screen.getPrimaryDisplay().workAreaSize
  const result = JSON.parse(config)
  Menu.setApplicationMenu(null)
  const mainWindow = new BrowserWindow({
    height: size.height || 600,
    width: size.width || 800,
    useContentSize: true,
    skipTaskbar: true,
    icon: path.join(__dirname, '../../Icon.icns'),
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true, // 设置开启nodejs环境
      enableRemoteModule: true, // enableRemoteModule保证renderer.js可以可以正常require('electron').remote，此选项默认关闭且网上很多资料没有提到
    },
  })
  globalShortcut.register("ESC", () => {
    mainWindow.setFullScreen(false)
  })
  mainWindow.setFullScreen(true)
  // and load the index.html of the app.
  mainWindow.setMenu(null)
  mainWindow.loadURL(result.loadUrl)
  mainWindow.setIgnoreMouseEvents(true)
  // mainWindow.loadFile('./index.html')
}

ipcMain.on('urlChange', (event, url) => {
  console.log('ipcMain urlChange', url)
  //格式化输出json文件
  let newData = JSON.stringify(url)
  fs.writeFile(path.join(__dirname, '../../config.json'), newData, (error) => {
    if (error) {
      console.error(error)
    }
    BrowserWindow.getAllWindows().forEach((wind) => {
      wind.destroy()
    })
    console.log('保存成功')
  })

  // mainWindow.loadURL(result.loadUrl)
})

app.on('ready', () => {
  createWindow()
  // setMenu()
  // if (process.platform === 'win32') {
  //   autoStart()
  // }
})

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
  // let reopenMenuItem:{enabled: boolean} = findReopenMenuItem()
  // if (reopenMenuItem) reopenMenuItem.enabled = true
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
