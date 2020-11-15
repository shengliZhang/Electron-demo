import { Menu, BrowserWindow, ipcMain } from 'electron'
import url from 'url'
import path from 'path'

const html = url.format({
  protocol: 'file:',
  pathname: path.join(__dirname, '../static/window_drag.html'),
  slashes: true,
})

const template = [
  {
    label: '工具',
  },
  {
    label: '查看',
    submenu: [
      {
        label: '刷新',
        accelerator: 'CmdOrCtrl+R',
        click: (item, focusedWindow) => {
          if (focusedWindow) {
            // 重载之后, 刷新并关闭所有的次要窗体
            if (focusedWindow.id === 1) {
              BrowserWindow.getAllWindows().forEach((win) => {
                if (win.id > 1) {
                  win.close()
                }
              })
            }
            focusedWindow.reload()
          }
        },
      },
      {
        label: '切换全屏',
        accelerator: (() => {
          if (process.platform === 'darwin') {
            return 'Ctrl+Command+F'
          } else {
            return 'F11'
          }
        })(),
        click: (item, focusedWindow) => {
          if (focusedWindow) {
            focusedWindow.setFullScreen(!focusedWindow.isFullScreen())
          }
        },
      },
      // {
      //   type: 'separator',
      // },
      // {
      //   label: '预留',
      //   click: (item, focusedWindow) => {
      //     if (focusedWindow) {
      //       const options = {
      //         type: 'info',
      //         title: '应用程序菜单演示',
      //         buttons: ['好的'],
      //         message:
      //           '此演示用于 "菜单" 部分, 展示如何在应用程序菜单中创建可点击的菜单项.',
      //       }
      //       electron.dialog.showMessageBox(focusedWindow, options)
      //     }
      //   },
      // },
    ],
  },
  {
    label: '窗口',
    role: 'window',
    submenu: [
      {
        label: '最小化',
        accelerator: 'CmdOrCtrl+M',
        role: 'minimize',
      },
      {
        label: '关闭',
        accelerator: 'CmdOrCtrl+W',
        role: 'close',
      },
      {
        type: 'separator',
      },
      {
        label: '重新打开窗口',
        accelerator: 'CmdOrCtrl+Shift+T',
        enabled: false,
        key: 'reopenMenuItem',
        click: () => {
          app.emit('activate')
        },
      },
      {
        type: 'separator',
      },
      {
        label: '开发者工具',
        accelerator: (() => {
          if (process.platform === 'darwin') {
            return 'Alt+Command+I'
          } else {
            return 'Ctrl+Shift+I'
          }
        })(),
        click: (item, focusedWindow) => {
          if (focusedWindow) {
            focusedWindow.toggleDevTools()
          }
        },
      },
    ],
  },
  {
    label: '设置',
    submenu: [
      {
        type: 'separator',
      },
      {
        label: '重新设置url',
        enabled: true,
        key: 'changeUrl',
        click: (item, focusedWindow) => {
          let win = new BrowserWindow({
            width: 400,
            height: 200,
            frame: true,
            webPreferences: {
              webSecurity: false,
            },
          })
          win.on('close', () => {
            win = null
          })
          win.loadURL(html)
        },
      },
    ],
  },
]

export const findReopenMenuItem = () => {
  const menu = Menu.getApplicationMenu()
  if (!menu) return

  let reopenMenuItem
  menu.items.forEach((item) => {
    if (item.submenu) {
      item.submenu.items.forEach((item) => {
        if (item.key === 'reopenMenuItem') {
          reopenMenuItem = item
        }
      })
    }
  })
  return reopenMenuItem
}

export const setMenu = () => {
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}
