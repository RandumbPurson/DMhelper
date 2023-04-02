// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("loading", {
    selectFile: (path) => ipcRenderer.invoke("dialog:openDirectory", path),
    loadStatblockData: (path) => ipcRenderer.invoke("loading:loadStatblockData", path),
    addStatblocks: (sbData) => ipcRenderer.invoke("combatManager:addStatblocks", sbData),
});

contextBridge.exposeInMainWorld("combatManager", {
    getInitiativeList: () => ipcRenderer.invoke("combatManager:getInitiativeList"),
    getInitiativeIndex: () => ipcRenderer.invoke("combatManager:getInitiativeIndex"),
})

contextBridge.exposeInMainWorld("display", {
    renderStatblock: (statblock) => ipcRenderer.invoke("display:renderStatblock", statblock),
    
})