import { statblockType } from "../../../types/statblockObjectTypes";
import { statblockData } from "../../../types/statblockDataTypes";
/**Components */
import Stats from "./components/Stats";
import State from "./components/State";
import {Traits, splitValStr} from "./components/Traits";

/**Modules */
import Resources from "./modules/Resources";
import Actions from "./modules/Actions";
import { Attacks, Multiattacks } from "./modules/Attacks";
import Spells from "./modules/Spells";

function recurseObj(object: {[key:string]: any}) {
    let dataObj: { [key: string]: any } = {};
    for (let key in object) {
        const val = object[key]
        if (typeof val === "function") {
            continue;
        }

        if (typeof val !== "object") {
            dataObj[key] = val;
        } else if (val instanceof Array) {
            dataObj[key] = recurseArr(val)
        } else {
            dataObj[key] = recurseObj(val);
        }
    }

    return dataObj;
}

function recurseArr(array: any[]) {
    let dataArr: any[] = [];
    for (let val of array) {

        if (typeof val !== "object") {
            dataArr.push(val)
        } else if (val instanceof Array) {
            dataArr.push(recurseArr(val))
        } else {
            dataArr.push(recurseObj(val))
        }
    }

    return dataArr;
}

class Statblock implements statblockType {
    //#region TS declarations
    // loaded values

    name?: string;
    uid?: number;

    stats: Stats;
    state: State;
    traits: Traits;

    //optional
    resources?: Resources;
    actions: {[key: string]: Actions};
    attacks?: Attacks;
    spellcasting?: Spells;
    //#endregion

    constructor(sbData: statblockData){
        this.stats = new Stats(sbData);
        let [maxHP, ] = splitValStr(sbData["maxHP"])
        this.state = new State(
            parseInt(maxHP!),
            this.stats.replaceStats("1d20*20+DEX")
        )

        this.traits = new Traits(sbData);

        this.actions = {};
        this.#loadOptional(sbData);
    }

    /**
     * Loads optional values for the statblock
     * @constructor
     * @param {object} sbData - The JS object loaded from the YAML file
     */
    #loadOptional(sbData: statblockData){
        if ("resources" in sbData) {
            this.resources = new Resources(sbData);
        }

        if ("actions" in sbData) {
            this.actions["actions"] = new Actions(sbData, this, "actions")
        }
        if ("bonus actions" in sbData) {
            this.actions["bonus actions"] = new Actions(sbData, this, "bonus actions")
        }
        if ("reactions" in sbData) {
            this.actions["reactions"] = new Actions(sbData, this, "reactions")
        }
        if ("resource actions" in sbData) {
            this.actions["resource actions"] = new Actions(sbData, this, "resource actions")
        }
        
        if ("attacks" in sbData) {
            this.attacks = new Attacks(sbData, this.stats)
        }
        if ("spellcasting" in sbData) {
            this.spellcasting = new Spells(sbData["spellcasting"]!)
        }
        
    }

    hasLoadedModules() {
        return {
            "actions": Object.entries(this.actions).length != 0,
            "attacks": this.attacks != undefined,
            //"multiattacks": this.multiattacks != undefined,
            "resources": this.resources != undefined
        }
    }

    getData() {
        return recurseObj(this);
    }

}

export default Statblock;
