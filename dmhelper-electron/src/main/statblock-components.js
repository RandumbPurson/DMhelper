const { rollString } = require("./roller");

class Stats {
    constructor(sbData) {
        this.stats = sbData["stats"];
        this.statmods = {};
        for (let stat in this.stats){
            this.statmods[stat] = Math.floor((this.stats[stat] - 10)/2);
        }
        this.pb = sbData["PB"];
        this.#load_proficiencies(sbData);
    }

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

    replaceStats(string, removeWS=true) {
        if (removeWS){string = string.replace(" ", "");}
        for (let key in this.statmods){
            string = string.replace(key, toString(this.statmods[key]));
        }
        string = string.replace("PB", toString(this.pb));

        return string
    }

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