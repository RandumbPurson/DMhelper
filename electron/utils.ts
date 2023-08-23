import { BrowserWindow, ipcMain } from "electron";

function newModal({parent, options}: {parent?: BrowserWindow, options?: Object}) {
    const modalWin = new BrowserWindow({...options, parent: parent});
    modalWin.loadURL("https://www.electronjs.org/docs/latest/api/browser-window")
}

export function handleUtils({parentWindow}: {parentWindow?: BrowserWindow}) {
    ipcMain.handle("newModal", () => newModal({parent: parentWindow}));
}
