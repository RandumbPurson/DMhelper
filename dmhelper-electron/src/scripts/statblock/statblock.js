const { Stats } = require("")

class Statblock {
    constructor(sbData){
        this.maxHP = sbData["maxHP"];
        this.ac = sbData["AC"];
        this.speed = sbData["speed"];

        this.stats = Stats(sbData);
        this.skillCheck = this.stats.skillCheck;

        this.#load_optional(sbData);

        this.hp = this.maxHP;
        this.initiative = 0;
        this.conditions = {};

        this.name = null;
        this.id = null;
    }

    #load_optional(sbData){

    }
}