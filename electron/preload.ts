import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld(
    "fs",
    {
        selectStatblock: () => ipcRenderer.invoke("selectStatblock"),
    }
)

contextBridge.exposeInMainWorld(
    "combatManager",
    {
        loadStatblock: (payload: {number: number, path: string}) => ipcRenderer.invoke("loadStatblock", payload)
    }
)