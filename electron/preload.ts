import { contextBridge, ipcRenderer } from "electron";
import { settingsSchema } from "./settings";

contextBridge.exposeInMainWorld(
    "fs",
    {
        selectStatblock: (options: {defaultPath: string}) => ipcRenderer.invoke("fs:selectStatblock", options),
    }
)

contextBridge.exposeInMainWorld(
    "combatManager",
    {
        loadStatblock: (payload: {number: number, path: string}) => ipcRenderer.invoke("combatManager:loadStatblock", payload),
        getSetting: (settingKey: settingsSchema) => ipcRenderer.invoke("combatManager:getSetting", settingKey),
        getRenderData: () => ipcRenderer.invoke("combatManager:getRenderData"),
        addPlayerInitiatives: (playerInfo: {
            "name": string,
            "uid": number,
            "initiative": number
        }[]) => ipcRenderer.invoke("combatManager:addPlayerInitiatives", playerInfo),
        rollInitiative: () => ipcRenderer.invoke("combatManager:rollInitiative"),
        resetInitiative: () => ipcRenderer.invoke("combatManager:resetInitiative"),
        setSelectedStatblock: (name: string, uid: number) => ipcRenderer.invoke("combatManager:setSelectedStatblock", name, uid),
    }
)

contextBridge.exposeInMainWorld(
    "statblock",
    {
        getTraits: () => 
    }
)