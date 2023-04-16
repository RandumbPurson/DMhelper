const { ipcMain } = require("electron");
const { Statblock } = require("./statblock/statblock.js");

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

    /**
     * @constructor
     */
    constructor(){
        this.statblocks = {};
        this.initiativeList = [];
        this.initiativeIndex = null;
    }

    /**
     * Gets the lowest available integer ID for a statblock with a given name
     * @param {string} sbName - The name of the statblock to get the next ID for
     * @returns {int} The lowest available ID
     */
    #nextID(sbName) {
        const idSet = Object.keys(this.statblocks[sbName]);
        for (let i=0; i <= idSet.length; i++){
            if (!idSet.includes(i.toString())) {return i}
        }
    }

    /**
     * Add a given number of the same kind of statblock to the combat manager
     * @param {{num: int, name: string, data: Statblock}} sbData - An object containting info
     *  for adding a number of statblocks to the combat manager
     */
    addStatblocks(sbData) {
        const { num, name, data } = sbData;
        
        if (!(name in this.statblocks)){
            this.statblocks[name] = {}
        }

        for (let i=0; i < num; i++){
            // initiatalize IDs and names
            let new_id = this.#nextID(name);
            let new_sb = new Statblock(data);
            new_sb.uid = new_id;
            new_sb.name = `${name}+${new_id}`;

            // push to statblock tracker and initiative list
            this.statblocks[name][new_id] = new_sb;
            if (this.initiativeIndex == null) {
                this.#pushSBToInitiativeList(name, new_id, false);
            }else{
                this.#pushSBToInitiativeList(name, new_id);
            }
        }

        // sort initiative if rolled
        if (this.initiativeIndex != null) {
            this.#sortInitiative()
        };
    }

    /**
     * Push a specific statblock to the initiative list
     * @param {string} sbName - The name of the statblock to push
     * @param {int} uid - The ID of the statblock to push
     * @param {boolean} [includeInit=true] - Whether to roll initiative or just
     *  push with a blank value
     */
    #pushSBToInitiativeList(sbName, uid, includeInit=true) {
        const statblock = this.statblocks[sbName][uid];
        const initiative = (includeInit) ? statblock.rollInitiative().toString() : "-";
        this.initiativeList.push({
            "name": statblock.name,
            "UID": uid,
            "initiative": initiative,
        });
    }

    /**
     * Roll initiative for an object containing statblocks
     * @param {object} statblocks - An object of form {name: {ID: statblock, ...}, ...}
     */
    #rollStatblockInitiative(statblocks) {
        for (let key in statblocks) {
            for (let sbID in statblocks[key]){
                this.#pushSBToInitiativeList(key, sbID);
            }
        }
    }

    /**
     * Sort the initiative list
     */
    #sortInitiative() {
        const prevElem = this.initiativeList[this.initiativeIndex];
        this.initiativeList.sort(
            (sb1, sb2) => -1*(sb1.initiative - sb2.initiative)
        );
        this.initiativeIndex = this.initiativeList.findIndex(
            elem  => elem == prevElem
        );
    }

    /**
     * Initialize and roll statblock + player initiatives
     */
    rollInitiative() {
        this.initiativeList = [];
        this.#rollStatblockInitiative(this.statblocks);
        this.#sortInitiative();
        this.initiativeIndex = 0;
    }

    /**
     * Increment turn counter and update renderer
     */
    nextTurn() {
        this.initiativeIndex = (this.initiativeIndex + 1) % this.initiativeList.length;
    }

}

const combatManager = new CombatManager();

//expose key methods and attributes to renderer
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

exports.combatManager = combatManager;