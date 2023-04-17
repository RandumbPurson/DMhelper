const { ipcMain } = require("electron");

class StatblockManager {
    setActiveStatblock(statblock) {
        this.statblock = statblock;
    }

    statusbarData(){
        return {
            hp: this.statblock.hp,
            maxHP: this.statblock.maxHP,
            ac: this.statblock.ac,
            speed: this.statblock.speed
        }
    }
}

const statblockManager = new StatblockManager();

ipcMain.handle("statblock:statusbarData", 
    (event) => statblockManager.statusbarData()
)

exports.statblockManager = statblockManager;