const { Stats } = require("./statblock-components.js")
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
        this.skillCheck = this.stats.skillCheck;

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
        return
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