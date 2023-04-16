const { rollString } = require("../roller");

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
        if (removeWS){string = string.replace(" ", "");}
        for (let key in this.statmods){
            string = string.replace(key, toString(this.statmods[key]));
        }
        string = string.replace("PB", toString(this.pb));

        return string
    }

    /**
     * Perform a skillcheck for a specific stat with or without proficiency bonus
     * @param {string} stat - The stat (as a stat token) to perform the check for
     * @param {boolean} [addPB=false] - Whether or not to add proficiency bonus
     * @returns {string} The result as a string in the form "stat: roll{, crit!}", eg; "DEX: 14"
     */
    skillCheck(stat, addPB = false){
        if (addPB) {
            const dstring = `1d20+${this.statmods[stat]}+${toString(this.pb)}`;
        }else {
            const dstring = `1d20+${this.statmods[stat]}`;
        }
        const { result, crit } = rollString(dstring, true);
        // Replace with channel to output?
        let retstring = `${stat}: ${result}`
        if (crit) {retstring = retstring + ", crit!"}
        return retstring
    }
}

module.exports = {
    Stats: Stats
}