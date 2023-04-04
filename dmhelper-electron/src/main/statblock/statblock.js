const { Stats } = require("./statblock-components.js")
const { rollString } = require("../roller")

class Statblock {
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

    #loadOptional(sbData){
        return
    }

    rollInitiative() {
        let rstring;
        const initiativeString = this.stats.replaceStats("1d20*20+DEX");
        [this.initiative, rstring] = rollString(initiativeString);
        return this.initiative;
    }

}

exports.Statblock = Statblock;