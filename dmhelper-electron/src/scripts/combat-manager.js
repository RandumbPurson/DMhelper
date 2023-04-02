const { ipcMain } = require("electron")

class CombatManager {

    constructor(){
        this.statblocks = {};
        this.initiativeList = [];
        this.initiativeIndex = 0;
    }

    addStatblocks(sbData) {
        const { num, name, data } = sbData;
        /* TODO
            - implement and test basic statblock loading
            - implement initiative tracker
            - implement action loading
            - display statbar
            - display actions
            - display output
            - implement statbar
            - implement actions
            - implement resource actions
            - implement condition tracker
        */
        this.statblocks[name] = {
            "num": num,
            "data": data
        }
    }
}

const combatManager = new CombatManager();

ipcMain.handle(
    "combatManager:addStatblocks", (event, sbData) => combatManager.addStatblocks(sbData)
)