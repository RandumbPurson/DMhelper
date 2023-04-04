const { ipcMain, dialog, BrowserWindow } = require("electron")
const yaml = require("js-yaml")
const fs = require("fs")


function loadStatblockData(event, path){
    return yaml.load(fs.readFileSync(path, "utf-8"));
}

ipcMain.handle("loading:loadStatblockData", loadStatblockData)

ipcMain.handle("dialog:openDirectory", async (event, path) => {
    const result = await dialog.showOpenDialog(BrowserWindow.getFocusedWindow(), {
        properties: ["openFile"],
        defaultPath: path,
    });
    return result
})