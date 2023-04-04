const { ipcMain } = require("electron");
const { Statblock } = require("./statblock/statblock.js");
const { statblockManager } = require("./statblock/statblock-manager");

/* TODO
            x implement and test basic statblock loading
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

class CombatManager {

    constructor(){
        this.statblocks = {};
        this.initiativeList = [];
        this.initiativeIndex = null;
    }

    #nextID(sbName) {
        const idSet = Object.keys(this.statblocks[sbName]);
        for (let i=0; i <= idSet.length; i++){
            if (!idSet.includes(i.toString())) {return i}
        }
    }

    addStatblocks(sbData) {
        const { num, name, data } = sbData;
        
        if (!(name in this.statblocks)){
            this.statblocks[name] = {}
        }

        for (let i=0; i < num; i++){
            let new_id = this.#nextID(name);
            let new_sb = new Statblock(data);
            new_sb.uid = new_id;
            new_sb.name = `${name}+${new_id}`;

            this.statblocks[name][new_id] = new_sb;
            if (this.initiativeIndex == null) {
                this.#pushSBToInitiativeList(name, new_id, false);
            }else{
                this.#pushSBToInitiativeList(name, new_id);
            }
        }

        if (this.initiativeIndex != null) {
            this.#sortInitiative()
        };
    }

    #pushSBToInitiativeList(sbName, uid, includeInit=true) {
        const statblock = this.statblocks[sbName][uid];
        const initiative = (includeInit) ? statblock.rollInitiative().toString() : "-";
        this.initiativeList.push({
            "name": statblock.name,
            "UID": uid,
            "initiative": initiative,
        });
    }

    #rollStatblockInitiative(statblocks) {
        for (let key in statblocks) {
            for (let sbID in statblocks[key]){
                this.#pushSBToInitiativeList(key, sbID);
            }
        }
    }

    #sortInitiative() {
        const prevElem = this.initiativeList[this.initiativeIndex];
        this.initiativeList.sort(
            (sb1, sb2) => -1*(sb1.initiative - sb2.initiative)
        );
        this.initiativeIndex = this.initiativeList.findIndex(
            elem  => elem == prevElem
        );
    }

    rollInitiative() {
        this.initiativeList = [];
        this.#rollStatblockInitiative(this.statblocks);
        this.#sortInitiative();
        this.initiativeIndex = 0;
    }

    nextTurn() {
        this.initiativeIndex = (this.initiativeIndex + 1) % this.initiativeList.length;
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
ipcMain.handle(
    "combatManager:nextTurn", (event) => combatManager.nextTurn()
)

ipcMain.handle(
    "statblock:setActiveStatblock", (event, statInfo) => {
        const sbType = statInfo.name.split("+")[0]
        const statblock = combatManager.statblocks[sbType][statInfo.UID];
        statblockManager.setActiveStatblock(
            statblock
        )
    }
)