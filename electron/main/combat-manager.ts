import { ipcMain } from "electron";
import Statblock from "./statblock/statblock"
import { statblockDataType } from "../../types/statblockDataTypes";
import { settingsSchema } from "../settings";
import settingsJson from "../../settings.json";
import { loadFromYaml } from "./statblock/load";
import { trimPath } from "../../src/components/dialogs/LoadDialog";


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
    settings: settingsSchema;

    statblocks: {[key: string]: {[key: number]: Statblock}};
    initiativeList: {name: string, uid: number, initiative: number}[];

    selectedStatblock?: Statblock;
    initiativeIndex?: number;

    /**
     * @constructor
     */
    constructor(settings: settingsSchema){
        this.settings = settings;
        this.statblocks = {};
        this.initiativeList = [];
        this.initiativeIndex = undefined;
    }

    /**
     * Gets the lowest available integer ID for a statblock with a given name
     * @param {string} sbName - The name of the statblock to get the next ID for
     * @returns {int} The lowest available ID
     */
    #nextID(sbName: string): number {
        const idSet = Object.keys(this.statblocks[sbName]);
        for (let i=0; i <= idSet.length; i++){
            if (!idSet.includes(i.toString())) {return i}
        }
        return idSet.length;
    }

    #addStatblock(name: string, sb_id: number, statblock: Statblock) {
        statblock.uid = sb_id;
        statblock.name = name;

        // push to statblock tracker and initiative list
        this.statblocks[name][sb_id] = statblock;
        if (this.initiativeIndex == null) {
            this.#pushSBToInitiativeList(name, sb_id, false);
        }else{
            this.#pushSBToInitiativeList(name, sb_id);
        }
    }

    /**
     * Add a given number of the same kind of statblock to the combat manager
     * @param {{num: int, name: string, data: Statblock}} sbData - An object containting info
     *  for adding a number of statblocks to the combat manager
     */
    addStatblocks(num: number, name: string, data: statblockDataType) {

        if (!(name in this.statblocks)){
            this.statblocks[name] = {}
        }

        for (let i=0; i < num; i++){
            // initiatalize IDs and names
            try {
                this.#addStatblock(
                    name, 
                    this.#nextID(name), 
                    new Statblock(data)
                )
            } catch {
                console.log("failed to load statblock")
            }
        }

        // sort initiative if rolled
        if (this.initiativeIndex != null) {
            this.#sortInitiative()
        };

    }

    getStatblock({name, uid}: {name: string, uid: number}){
        if (!this.statblocks.hasOwnProperty(name)) {return undefined}
        if (!this.statblocks[name].hasOwnProperty(uid)) {return undefined}
        return this.statblocks[name][uid]
    }

    /**
     * Push a specific statblock to the initiative list
     * @param {string} sbName - The name of the statblock to push
     * @param {int} uid - The ID of the statblock to push
     * @param {boolean} [includeInit=true] - Whether to roll initiative or just
     *  push with a blank value
     */
    #pushSBToInitiativeList(sbName: string, uid: number, includeInit=true) {
        const statblock = this.statblocks[sbName][uid];
        const initiative = (includeInit) ? statblock.state.rollInitiative() : NaN;
        this.initiativeList.push({
            "name": statblock.name!,
            "uid": uid,
            "initiative": initiative,
        });
    }

    /**TODO
     * Need to disciminate between player and SB
     * (or do I?...)
     */
    pushPlayerToInitiativeList(playerInfo : {
        "name": string,
        "uid": number,
        "initiative": number
    }) {
        this.initiativeList.push(playerInfo)
    }

    /**
     * Roll initiative for an object containing statblocks
     * @param {object} statblocks - An object of form {name: {ID: statblock, ...}, ...}
     */
    #rollStatblockInitiative(statblocks: {[key: string]: {[key: number]: Statblock}}) {
        for (let key in statblocks) {
            for (let sbID in statblocks[key]){
                this.#pushSBToInitiativeList(key, parseInt(sbID));
            }
        }
    }

    /**
     * Sort the initiative list
     */
    #sortInitiative() {
        const prevElem = this.initiativeList[this.initiativeIndex!]; // only called after initiative rolled
        this.initiativeList.sort(
            (sb1, sb2) => -1*(sb1.initiative - sb2.initiative)
        );
        this.initiativeIndex = this.initiativeList.findIndex(
            elem  => elem == prevElem
        );
    }

    resetInitiative() {    
        combatManager.initiativeList = [];
        combatManager.initiativeIndex = 0;
    }

    /**
     * Initialize and roll statblock + player initiatives
     */
    rollInitiative() {
        this.#rollStatblockInitiative(this.statblocks);
        this.#sortInitiative();
    }

    /**
     * Increment turn counter and update renderer
     */
    nextTurn() { // only call if initiative has been rolled
        this.initiativeIndex = (this.initiativeIndex! + 1) % this.initiativeList.length;
    }

    getData(sbData: {name: string, uid: number}) {
        const selectedStatblock = this.getStatblock(sbData);
        if (typeof(selectedStatblock) === "undefined") {
            return null;
        }else{
            return selectedStatblock.getData()
        }
    }

}

export let combatManager = new CombatManager(settingsJson);

export function combatManagerHandlers() {
    ipcMain.handle("combatManager:loadStatblock", 
        async (event, {number, path}) => {
            let data = await loadFromYaml(path) as statblockDataType;
            combatManager.addStatblocks(number, trimPath(path)!, data)
        })
    ipcMain.handle("combatManager:getSetting", 
        (event, settingKey: keyof settingsSchema) => {
            return combatManager.settings[settingKey]
        })
    ipcMain.handle("combatManager:getRenderData", 
        () => combatManager.initiativeList
    )
    ipcMain.handle("combatManager:addPlayerInitiatives", 
        (event, playerInfo: {
            "name": string,
            "uid": number,
            "initiative": number
        }[]) => {
            playerInfo.forEach((player) => combatManager.pushPlayerToInitiativeList(player))
        })
    ipcMain.handle("combatManager:rollInitiative",
        () => combatManager.rollInitiative()
    )
    ipcMain.handle("combatManager:resetInitiative",
        () => combatManager.resetInitiative()
    )
}

export function statblockHandlers() {
    ipcMain.handle("statblock:getData",
        (event, sbData: {name: string, uid: number}) => {
            return combatManager.getData(sbData);
        }
    )
}