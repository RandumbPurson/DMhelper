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
            savingThrows: this.statblock.stats.savingThrows,
        }
    }
    statCheck(stat){
        return this.statblock.stats.statCheck(stat);
    }
    rollSave(stat){
        return this.statblock.stats.rollSave(stat);
    }
    skillCheck(skill){
        return this.statblock.stats.skillCheck(skill)
    }
}

const statblockManager = new StatblockManager();

ipcMain.handle("statblock:statusbarData", 
    (event) => statblockManager.statusbarData()
);

// Handle Stat and Skill Checks
    ipcMain.handle("statblock:statbarData",
        (event) => statblockManager.statbarData()
    );
    ipcMain.handle("statblock:statCheck", 
        (event, stat) => statblockManager.statCheck(stat)
    )
    ipcMain.handle("statblock:rollSave",
        (event, stat) => statblockManager.rollSave(stat)
    )
    ipcMain.handle("statblock:skillCheck",
        (event, skill) => statblockManager.skillCheck(skill)
    )

exports.statblockManager = statblockManager;