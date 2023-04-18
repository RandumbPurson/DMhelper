const { ipcMain } = require("electron");

class StatblockManager {

    /**
     * Set the active statblock to a statblock object
     * @param {object} statblock - A statblock object
     */
    setActiveStatblock(statblock) {
        this.statblock = statblock;
        this.selectedActionTab = null;
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

    actionTabsData(){
        return Object.keys(this.statblock.actions);
    }
    actionData(){
        if (this.selectedActionTab == null) {return null}
        return this.statblock.actions[this.selectedActionTab].getData()
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
    ipcMain.handle("statblock:actionTabsData",
        (event) => statblockManager.actionTabsData()
    )
    ipcMain.handle("statblock:setSelectedActionTab",(event, actionTab) => {
        statblockManager.selectedActionTab = actionTab;
    })
    ipcMain.handle("statblock:actionData",
        (event) => statblockManager.actionData()
    )
    ipcMain.handle("statblock:doAction", (event, action) => {
        return statblockManager.statblock.actions[statblockManager.selectedActionTab].do(action);
    })

exports.statblockManager = statblockManager;