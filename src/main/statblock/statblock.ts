const { Stats, Resources } = require("./components.js")
const { Actions, Attacks, Multiattacks } = require("./modules.js")
const { rollString } = require("../roller")

class Statblock {
    /**
     * @constructor
     * @param {object} sbData - The JS object loaded from the YAML file
     */
    constructor(sbData){
        this.maxHP = sbData["maxHP"];
        this.ac = sbData["AC"];
        this.speed = sbData["speed"];

        this.stats = new Stats(sbData);

        this.#loadOptional(sbData);

        this.hp = this.maxHP;
        this.initiative = 0;
        this.conditions = {};

        this.name = null;
        this.uid = null;
    }

    /**
     * Loads optional values for the statblock
     * @constructor
     * @param {object} sbData - The JS object loaded from the YAML file
     */
    #loadOptional(sbData){
        this.resources = null;
        if ("resources" in sbData) {
            this.resources = new Resources(sbData);
        }

        this.actions = {};
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
        
        this.attacks = null;
        if ("attacks" in sbData) {
            this.attacks = new Attacks(sbData, this.stats)
        }

        this.multiattacks = null;
        if ("multiattack" in sbData) {
            this.multiattacks = new Multiattacks(sbData, this.attacks)
        }
        
    }

    /**
     * Rolls, sets, and returns the statblock's initiative score
     * @returns The statblock's initiative
     */
    rollInitiative() {
        let rstring;
        const initiativeString = this.stats.replaceStats("1d20*20+DEX");
        [this.initiative, rstring] = rollString(initiativeString);
        return this.initiative;
    }

}

exports.Statblock = Statblock;