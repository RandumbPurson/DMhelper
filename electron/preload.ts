import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld(
    "fs",
    {
        selectStatblock: () => ipcRenderer.invoke("selectStatblock")
    }
)