const { ipcMain, dialog, BrowserWindow } = require("electron")
const yaml = require("js-yaml")
const fs = require("fs")

/**
 * Load statblock info from a file into an object
 * @param {object} event - Auto-generated event info
 * @param {string} path - The path to the file to load
 * @returns {object} The object containing the statblock info
 */
function loadStatblockData(event, path){
    return yaml.load(fs.readFileSync(path, "utf-8"));
}

ipcMain.handle("loading:loadStatblockData", loadStatblockData)

/**
 * Open a file selection dialog
 * @param {string} path - The directory to open the dialog in
 */
ipcMain.handle("dialog:openDirectory", async (event, path) => {
    const result = await dialog.showOpenDialog(BrowserWindow.getFocusedWindow(), {
        properties: ["openFile"],
        defaultPath: path,
    });
    return result
})