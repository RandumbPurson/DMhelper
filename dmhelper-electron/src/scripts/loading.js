const { ipcMain, dialog } = require("electron")
const yaml = require("js-yaml")
const fs = require("fs")

ipcMain.handle("dialog:openDirectory", async (event, path) => {
    const result = await dialog.showOpenDialog({defaultPath: path});
    return result
})


function loadStatblockData(event, path){
    return yaml.load(fs.readFileSync(path, "utf-8"));
}

ipcMain.handle("loading:loadStatblockData", loadStatblockData)