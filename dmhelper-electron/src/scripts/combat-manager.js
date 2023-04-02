const { ipcMain } = require("electron")
const { Statblock } = require("./statblock/statblock")

class CombatManager {

    constructor(){
        this.statblocks = {};
        this.initiativeList = [];
        this.initiativeIndex = 0;
    }

    #nextID(sbName) {
        const idSet = this.statblocks[sbName]["IDs"]
        for (let i=0; i <= idSet.length; i++){
            if (! i in idSet) {return i}
        }
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
        if (! name in this.statblocks){
            this.statblocks[name] = {"statblocks": [], "IDs": []}
        }

        let indexRange = [
            this.statblocks[name]["IDs"].length,
            this.statblocks[name]["IDs"].length
        ]
        for (let i=0; i < num; i++){
            let new_id = this.#nextID(name);
            let new_sb = Statblock(data);
            new_sb.uid = new_id;
            new_sb.name = name;

            this.statblocks[name]["statblocks"].push(new_sb);
            this.statblocks[name]["IDs"].push(new_id);
            indexRange[1] += 1
        }
        
        if (self.initiativeList != null) {
            /* insert into list */
        }
    }
}

const combatManager = new CombatManager();

ipcMain.handle(
    "combatManager:addStatblocks", (event, sbData) => combatManager.addStatblocks(sbData)
)
ipcMain.handle(
    "combatManager:getInitiativeList", (event) => combatManager.initiativeList
)
ipcMain.handle(
    "combatManager:getInitiativeIndex", (event) => combatManager.initiativeIndex
)