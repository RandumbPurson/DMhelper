const { Roller } = require("../roller");

class Stats {
    constructor(sbData) {
        this.stats = sbData["stats"];
        this.statmods = {};
        for ({stat, val} of this.stats){
            this.statmods[stat] = Math.floor((val - 10)/2);
        }
        this.pb = sbData["PB"];
        this.#load_proficiencies(sbData);
    }

    #load_proficiencies(sbData){
        this.skills = [];
        this.savingThrows = [];
        if ("proficiencies" in sbData){
            if ("skills" in sbData["proficiencies"]){
                self.skills = sbData["proficiencies"]["skills"];
            }
            if ("saving throws" in sbData["proficiencies"]){
                self.savingThrows = sbData["proficiencies"]["saving throws"];
            }
        }
    }

    replaceStats(string, removeWS=true) {
        if (removeWS){string = string.replace(" ", "");}
        for (let {key, val} of self.statmods.entries()){
            string = string.replace(key, toString(val));
        }
        string = string.replace("PB", toString(self.pb));

        return string
    }

    skillCheck(stat, addPB = false){
        if (addPB) {
            const dstring = `1d20+${this.statmods[stat]}+${toString(this.pb)}`;
        }else {
            const dstring = `1d20+${this.statmods[stat]}`;
        }
        const { result, crit } = Roller.rollString(dstring, true);
        // Replace with channel to output?
        let retstring = `${stat}: ${result}`
        if (crit) {retstring = retstring + ", crit!"}
        return retstring
    }
}

module.exports = {
    Stats: Stats
}