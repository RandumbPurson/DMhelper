// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("loader", {
    selectFile: (path) => ipcRenderer.invoke("dialog:openDirectory", path),
    loadStatblock: (path) => ipcRenderer.invoke("loading:loadStatblock", path)
});