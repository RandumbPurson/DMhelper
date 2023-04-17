// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge, ipcRenderer } = require("electron");

// expose loading functionality
contextBridge.exposeInMainWorld("loading", {
    selectFile: (path) => ipcRenderer.invoke("dialog:openDirectory", path),
    loadStatblockData: (path) => ipcRenderer.invoke("loading:loadStatblockData", path),
    addStatblocks: (sbData) => ipcRenderer.invoke("combatManager:addStatblocks", sbData),
});

// expose combatmanager methods and attributes
contextBridge.exposeInMainWorld("combatManager", {
    getInitiativeList: () => ipcRenderer.invoke("combatManager:getInitiativeList"),
    getInitiativeIndex: () => ipcRenderer.invoke("combatManager:getInitiativeIndex"),
    rollInitiative: () => ipcRenderer.invoke("combatManager:rollInitiative"),
    nextTurn: () => ipcRenderer.invoke("combatManager:nextTurn"),
})

// expose statblock functionality
contextBridge.exposeInMainWorld("statblock", {
    setActiveStatblock: (statInfo) => ipcRenderer.invoke("statblock:setActiveStatblock", statInfo),
    statusbarData: () => ipcRenderer.invoke("statblock:statusbarData"),
})