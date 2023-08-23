import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'node:path'

import { handleUtils } from './utils';
import selectStatblock from './main/statblock/load'
import { CombatManager } from './main/combat-manager';

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │
process.env.DIST = path.join(__dirname, '../dist')
process.env.PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public')


let win: BrowserWindow | null
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']

function createWindow() {
  win = new BrowserWindow({
    width: 900,
    height: 1000,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(process.env.DIST, 'index.html'))
  }

  return win;
}

function runHandlers({parentWindow}: {parentWindow?: BrowserWindow}) {
  handleUtils({parentWindow:});
}

app.on('window-all-closed', () => {
  win = null
})

app.whenReady().then( () => {
  let mainWindow = createWindow();
  runHandlers({parentWindow: mainWindow});
  const combatMgr = new CombatManager();
})

ipcMain.handle("selectStatblock", selectStatblock);