import { statblockDataType, statblockType } from "./statblockTypes";

import { Stats, Resources, State, Traits, resourceSBDataType } from "./components";
import { Actions, Attacks } from "./modules";

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
    //#endregion

    constructor(sbData: statblockDataType){
        this.stats = new Stats(sbData);
        this.state = new State(
            sbData["maxHP"].split(",")[0] as unknown as number,
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
    #loadOptional(sbData: statblockDataType){
        if ("resources" in sbData) {
            this.resources = new Resources(sbData as resourceSBDataType);
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
        
    }

    hasLoadedModules() {
        return {
            "actions": Object.entries(this.actions).length != 0,
            "attacks": this.attacks != undefined,
            //"multiattacks": this.multiattacks != undefined,
            "resources": this.resources != undefined
        }
    }

}

export default Statblock;