// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("loadRenderScripts", {
    loadingMenu: () => require("./render/loading-menu"),
    initiativeMenu: () => require("./render/initiative-menu"),
})

contextBridge.exposeInMainWorld("loading", {
    selectFile: (path) => ipcRenderer.invoke("dialog:openDirectory", path),
    loadStatblockData: (path) => ipcRenderer.invoke("loading:loadStatblockData", path),
    addStatblocks: (sbData) => ipcRenderer.invoke("combatManager:addStatblocks", sbData),
});

contextBridge.exposeInMainWorld("combatManager", {
    getInitiativeList: () => ipcRenderer.invoke("combatManager:getInitiativeList"),
    getInitiativeIndex: () => ipcRenderer.invoke("combatManager:getInitiativeIndex"),
    rollInitiative: () => ipcRenderer.invoke("combatManager:rollInitiative"),
    nextTurn: () => ipcRenderer.invoke("combatManager:nextTurn"),
})

contextBridge.exposeInMainWorld("display", {
    /* Not Implemented! */
    renderStatblock: (statblock) => ipcRenderer.invoke("display:renderStatblock", statblock),

})