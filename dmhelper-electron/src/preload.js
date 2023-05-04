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
    hasLoadedModules: () => ipcRenderer.invoke("statblock:hasLoadedModules"),
    getResources: () => ipcRenderer.invoke("statblock:getResources"),
    getResourceVal: (resourceKey) => ipcRenderer.invoke("statblock:getResourceVal", resourceKey),
    resetResource: (resourceKey) => ipcRenderer.invoke("statblock:resetResource", resourceKey),

    statbarData: () => ipcRenderer.invoke("statblock:statbarData"), 
    statCheck: (stat) => ipcRenderer.invoke("statblock:statCheck", stat),
    rollSave: (stat) => ipcRenderer.invoke("statblock:rollSave", stat),
    skillCheck: (skill) => ipcRenderer.invoke("statblock:skillCheck", skill),

    actionTabsData: () => ipcRenderer.invoke("statblock:actionTabsData"),
    actionData: (actionType) => ipcRenderer.invoke("statblock:actionData", actionType),
    doAction: (actionInfo) => ipcRenderer.invoke("statblock:doAction", actionInfo),

    attacksData: () => ipcRenderer.invoke("statblock:attacksData"),
    doAttack: (attackName) => ipcRenderer.invoke("statblock:doAttack", attackName),
    doMultiattack: (attackName) => ipcRenderer.invoke("statblock:doMultiattack", attackName),
    multiattackData: () => ipcRenderer.invoke("statblock:multiattackData"),
})