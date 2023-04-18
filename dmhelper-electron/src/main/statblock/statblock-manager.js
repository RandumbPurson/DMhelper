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

    /**
     * 
     * @returns Data needed to render the stat bar
     */
    statbarData(){
        return {
            pb: this.statblock.stats.pb,
            statmods: this.statblock.stats.statmods,
            skills: this.statblock.stats.skills,
            savingThrows: this.statblock.stats.savingThrows,
        }
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
        (event, stat) => statblockManager.statblock.stats.statCheck(stat)
    )
    ipcMain.handle("statblock:rollSave",
        (event, stat) => statblockManager.statblock.stats.rollSave(stat)
    )
    ipcMain.handle("statblock:skillCheck",
        (event, skill) => statblockManager.statblock.stats.skillCheck(skill)
    )

// Handle Actions
    ipcMain.handle("statblock:actionData",
        (event, actionType) => statblockManager.statblock.actions[actionType].getData()
    )
    ipcMain.handle("statblock:doAction", (event, actionInfo) => {
        let { actionType, action } = actionInfo;
        return statblockManager.statblock.actions[actionType].do(action);
    })

exports.statblockManager = statblockManager;