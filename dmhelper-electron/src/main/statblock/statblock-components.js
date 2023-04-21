const { rollString } = require("../roller");

const skillMap = {
    "athletics": "STR", 
    "acrobatics": "DEX", 
    "sleight of hand": "DEX", 
    "stealth": "DEX", 
    "arcana": "INT", 
    "history": "INT", 
    "investigation": "INT",
    "nature": "INT",
    "religion": "INT",
    "animal handling": "WIS",
    "insight": "WIS",
    "medicine": "WIS",
    "perception": "WIS",
    "survival": "WIS", 
    "deception": "CHA",
    "intimidation": "CHA",
    "performance": "CHA",
    "persuasion": "CHA"
}

class Stats {
    /**
     * @constructor
     * @param {object} sbData - The JS object loaded from the YAML file
     */
    constructor(sbData) {
        this.stats = sbData["stats"];
        this.statmods = {};
        // generate modifiers
        for (let stat in this.stats){
            this.statmods[stat] = Math.floor((this.stats[stat] - 10)/2);
        }
        this.pb = sbData["PB"];
        this.#load_proficiencies(sbData);
    }

    /**
     * Load optional proficiencies
     * @param {object} sbData - The JS object loaded from the YAML file
     */
    #load_proficiencies(sbData){
        this.skills = [];
        this.savingThrows = [];
        if ("proficiencies" in sbData){
            if ("skills" in sbData["proficiencies"]){
                this.skills = sbData["proficiencies"]["skills"];
            }
            if ("saving throws" in sbData["proficiencies"]){
                this.savingThrows = sbData["proficiencies"]["saving throws"];
            }
        }
    }

    /**
     * Replace stat tokens (STR, DEX, CON, INT, WIS, CHA, PB) in a string with 
     * the values specified by the statblock
     * @param {string} string - A string which might include stat tokens
     * @param {boolean} [removeWS=true] - Whether to remove whitespace in the string
     * @returns {string} The string with stat tokens replaced
     */
    replaceStats(string, removeWS=true) {
        if (removeWS){string = string.replaceAll(" ", "");}
        for (let key in this.statmods){
            string = string.replaceAll(key, this.statmods[key].toString());
        }
        string = string.replaceAll("PB", this.pb.toString());

        return string
    }

    /**
     * Perform a statCheck for a specific stat with or without proficiency bonus
     * @param {string} stat - The stat (as a stat token) to perform the check for
     * @param {boolean} [addPB=false] - Whether or not to add proficiency bonus
     * @returns {[int, string]} The result as an array of form [total, roll string]
     */
    statCheck(stat, addPB = false){
        let dstring;
        if (addPB) {
            dstring = `1d20*20+${this.statmods[stat]}+${this.pb}`;
        }else {
            dstring = `1d20*20+${this.statmods[stat]}`;
        }
        return rollString(dstring); 
    }

    /**
     * Perform a saving throw for a stat
     * @param {string} stat - The stat to roll a save for
     * @returns {[int, string]} An array of form [total, roll string]
     */
    rollSave(stat) {
        return this.statCheck(
            stat, 
            this.savingThrows.includes(stat)
        )
    }

    /**
     * Perform a skill check for a skill
     * @param {string} skill - The skill to make a check for
     * @returns {[int, string]} An array of form [total, roll string]
     */
    skillCheck(skill) {
        return this.statCheck(
            skillMap[skill],
            this.skills.includes(skill) // redundant check?
        )
    }
}

class Action {
    constructor(actionData, statsObj) {
        this.text = actionData["text"].trim();

        this.rolls = null;
        if ("rolls" in actionData) {
            this.rolls = {};
            Object.entries(actionData["rolls"]).forEach(elem => 
            {
                let [ key, rstring ] = elem;
                this.rolls[key] = statsObj.replaceStats(
                    rstring, true
                );
            });
        }

        this.maxUses = null;
        if ("uses" in actionData) {
            this.maxUses = actionData["uses"]
            this.uses = this.maxUses;
        }
    }

    do() {
        if (this.maxUses !== null){
            if (!(this.#canUse())) {
                return "Expended all uses!";
            }else{
                this.#decrementUses();
            }
        }

        if (this.rolls !== null) {
            let rolls = {};
            Object.entries(this.rolls).forEach(elem => {
                let [ key, rstring ] = elem;
                rolls[key] = rollString(rstring);
            });
            return rolls;
        }else{
            return this.text;
        }
    }

    getData() {
        let data = {"text": this.text};
        if (this.maxUses !== null){
            data["maxUses"] = this.maxUses;
            data["uses"] = this.uses;
        }
        return data;
    }

    #canUse() {return this.uses > 0}
    #decrementUses() {this.uses -= 1}

}
class Actions {
    
    constructor(sbData, statsObj, sbDataKey="actions") {
        this.actions = {};
        Object.entries(sbData[sbDataKey]).forEach(elem => {
            let [ key, actionData ] = elem;
            this.actions[key] = new Action(actionData, statsObj);
        })
    }

    do(actionName) {
        return this.actions[actionName].do()
    }

    getData() {
        let data = {};
        Object.entries(this.actions).forEach(elem => {
            let [ key, val ] = elem;
            data[key] = val.getData();
        })
        return data;
    }
}

class Attack {
    constructor(attackData, statsObj) {
        this.hitBonus = statsObj.replaceStats(attackData["to-hit"]);
        this.hitString = "1d20*20+"+this.hitBonus;

        let rawDstring = attackData["damage"].split(",");
        this.dmgString = statsObj.replaceStats(rawDstring[0]);
        this.dmgType = rawDstring[1].trim();

        this.type = attackData["type"];
        this.range = attackData["range"];
    }

    do() {
        return [
            rollString(this.hitString), 
            rollString(this.dmgString),
            this.dmgType
        ]
    }

    getData() {
        return {
            "type": this.type,
            "range": this.range,
            "hitBonus": this.hitBonus,
            "dmgString": this.dmgString,
            "dmgType": this.dmgType
        }
    }
}
class Attacks {
    constructor(sbData, statsObj) {
        this.attacks = {};
        for (let [ attackName, attackData ] of Object.entries(sbData["attacks"])){
            this.attacks[attackName] = new Attack(attackData, statsObj);
        }
    }

    do(attackName) {
        return this.attacks[attackName].do()
    }

    getData() {
        let data = {};
        for (let [attackName, attack] of Object.entries(this.attacks)){
            data[attackName] = attack.getData();
        }
        return data;
    }
}

module.exports = {
    Stats: Stats,
    Actions: Actions,
    Attacks: Attacks
}