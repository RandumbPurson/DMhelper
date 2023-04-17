const { ipcMain } = require("electron");

class StatblockManager {
    /**
     * Set the active statblock to a statblock object
     * @param {object} statblock - A statblock object
     */
    setActiveStatblock(statblock) {
        this.statblock = statblock;
    }

    /**
     * @returns Data needed to render the status bar
     */
    statusbarData(){
        return {
            hp: this.statblock.hp,
            maxHP: this.statblock.maxHP,
            ac: this.statblock.ac,
            speed: this.statblock.speed
        }
    }

    statbarData(){
        return {
            pb: this.statblock.stats.pb,
            statmods: this.statblock.stats.statmods,
            skills: this.statblock.stats.skills,
            savingThrows: this.statblock.stats.savingThrows
        }
    }
    skillCheck(stat){
        return this.statblock.stats.skillCheck(stat);
    }
    rollSave(stat){
        return this.statblock.stats.rollSave(stat);
    }
}

const statblockManager = new StatblockManager();

ipcMain.handle("statblock:statusbarData", 
    (event) => statblockManager.statusbarData()
);
ipcMain.handle("statblock:statbarData",
    (event) => statblockManager.statbarData()
);
ipcMain.handle("statblock:skillCheck", 
    (event, stat) => statblockManager.skillCheck(stat)
)
ipcMain.handle("statblock:rollSave",
    (event, stat) => statblockManager.rollSave(stat)
)

exports.statblockManager = statblockManager;