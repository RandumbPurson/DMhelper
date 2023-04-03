const { ipcMain } = require("electron");
const { stat } = require("original-fs");
const { Statblock } = require("./statblock")

class CombatManager {

    constructor(){
        this.statblocks = {};
        this.initiativeList = [];
        this.initiativeIndex = 0;
    }

    #nextID(sbName) {
        const idSet = Object.keys(this.statblocks);
        for (let i=0; i <= idSet.length; i++){
            if (!idSet.includes(i)) {return i}
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
        if (!(name in this.statblocks)){
            this.statblocks[name] = {}
        }

        let newIDs = []
        for (let i=0; i < num; i++){
            let new_id = this.#nextID(name);
            let new_sb = new Statblock(data);
            new_sb.uid = new_id;
            new_sb.name = `${name}+${new_id}`;

            this.statblocks[name][new_id] = new_sb;
            newIDs.push(new_id);
        }
        
        if (this.initiativeList != null) {
            /* insert into list */
        }
    }

    #rollStatblockInitiative(statblocks) {
        for (let key in statblocks) {
            for (let sbID in statblocks[key]){
                let statblock = statblocks[key][sbID];
                this.initiativeList.push({
                    "name": statblock.name,
                    "UID": sbID,
                    "initiative": statblock.rollInitiative(),
                });
            }
        }
    }

    rollInitiative() {
        this.#rollStatblockInitiative(this.statblocks);
        this.initiativeList.sort(
            (sb1, sb2) => -1*(sb1.initiative - sb2.initiative)
        );
        this.initiativeIndex = 0;
    }
}

const combatManager = new CombatManager();

ipcMain.handle(
    "combatManager:addStatblocks", (event, sbData) => combatManager.addStatblocks(sbData)
)
ipcMain.handle(
    "combatManager:getInitiativeList", (event) => {return combatManager.initiativeList}
)
ipcMain.handle(
    "combatManager:getInitiativeIndex", (event) => {return combatManager.initiativeIndex}
)
ipcMain.handle(
    "combatManager:rollInitiative", (event) => combatManager.rollInitiative()
)