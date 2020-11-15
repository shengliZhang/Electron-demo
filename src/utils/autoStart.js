/**
 * 开机自启  windows系统可用
 */

const WinReg = require('winreg')

const noop = () => {}

const RUN_LOCATION = '\\Software\\Microsoft\\Windows\\CurrentVersion\\Run'
const getKey = () => {
  return new WinReg({
    hive: WinReg.HKCU, //CurrentUser,
    key: RUN_LOCATION,
  })
}

const startOnBoot = {
  enableAutoStart: (name, file, callback) => {
    var key = getKey()
    key.set(name, WinReg.REG_SZ, file, callback || noop)
  },
  disableAutoStart: (name, callback) => {
    var key = getKey()
    key.remove(name, callback || noop)
  },
  getAutoStartValue: (name, callback) => {
    var key = getKey()
    key.get(name, (error, result) => {
      if (result) {
        callback(result.value)
      } else {
        callback(null, error)
      }
    })
  },
}

export default () => {
  startOnBoot.getAutoStartValue('ELECTRON_REACT_AUTOSTART', (value) => {
    if (!value) {
      startOnBoot.enableAutoStart(
        'ELECTRON_REACT_AUTOSTART',
        process.execPath,
        () => {
          console.log('开机自动启设置')
        }
      )
    }
  })
}
