import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld(
    "fs",
    {
        loadStatblock: () => ipcRenderer.invoke("loadStatblock")
    }
)