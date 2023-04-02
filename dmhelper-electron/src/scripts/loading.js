const { ipcMain, dialog } = require("electron")
const yaml = require("js-yaml")
const fs = require("fs")

ipcMain.handle("dialog:openDirectory", async (event, path) => {
    const result = await dialog.showOpenDialog({defaultPath: path});
    return result
})


function loadStatblock(event, path){
    return yaml.load(fs.readFileSync(path, "utf-8"));
}

ipcMain.handle("loading:loadStatblock", loadStatblock)

module.exports = {
    "loadStatblock": loadStatblock
}