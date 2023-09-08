import { contextBridge, ipcRenderer } from "electron";
import { settingsSchema } from "./settings";

const _fs = {
    selectStatblock: (options: {defaultPath: string}) => ipcRenderer.invoke("fs:selectStatblock", options),
}

const combatManager = {
    loadStatblock: (payload: {number: number, path: string}) => ipcRenderer.invoke("combatManager:loadStatblock", payload),
    getSetting: (settingKey: keyof settingsSchema) => ipcRenderer.invoke("combatManager:getSetting", settingKey),
    getRenderData: () => ipcRenderer.invoke("combatManager:getRenderData"),
    addPlayerInitiatives: (playerInfo: {
        "name": string,
        "uid": number,
        "initiative": number
    }[]) => ipcRenderer.invoke("combatManager:addPlayerInitiatives", playerInfo),
    rollInitiative: () => ipcRenderer.invoke("combatManager:rollInitiative"),
    resetInitiative: () => ipcRenderer.invoke("combatManager:resetInitiative"),
}

const statblock = {
    getData: (sbData: {name: string, uid: number}) => ipcRenderer.invoke("statblock:getData", sbData)
}

export const API = {
    "fs": _fs,
    "combatManager": combatManager,
    "statblock": statblock
}

contextBridge.exposeInMainWorld("api",API)