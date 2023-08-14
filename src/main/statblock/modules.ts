const { ipcRenderer } = require("electron");
const { rollString } = require("../roller.js");

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

    async do() {
        if (!(await this.canUse())) {
            return "Expended all uses!";
        }else{
            await this.decrementUses();
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

    async canUse() {
        if (this.maxUses == null){return true}
        return this.uses > 0
    }
    async decrementUses() {this.uses -= 1}

}
class ResourceAction extends Action {
    constructor(actionData, statsObj, resources) {
        super(actionData, statsObj);

        this.resources = resources;
        this.resourceKey = actionData["resource"];
        this.cost = actionData["cost"] || 1;
    }
    async canUse() {
        let canUseBasic = this.maxUses == null ? true : this.uses > 0;
        let canUseResource = this.resources.canUse(this.resourceKey, this.cost);
        return canUseBasic && canUseResource;
    }
    async decrementUses(){
        if (this.maxUses !== null){this.uses -= 1}

        this.resources.use(this.resourceKey, this.cost)
    }
    getData() {
        let data = {"text": this.text};
        if (this.maxUses !== null){
            data["maxUses"] = this.maxUses;
            data["uses"] = this.uses;
        }
        if (this.resourceKey !== null) {
            data["resourceKey"] = this.resourceKey;
            data["cost"] = this.cost;
        }
        return data;
    }
}
class Actions {
    
    constructor(sbData, statblock, sbDataKey="actions") {
        this.actions = {};
        Object.entries(sbData[sbDataKey]).forEach(elem => {
            let [ key, actionData ] = elem;
            if (!("resource" in actionData)) {
                this.actions[key] = new Action(actionData, statblock.stats);
            }else{
                this.actions[key] = new ResourceAction(actionData, statblock.stats, statblock.resources);
            }
        })
    }

    async do(actionName) {
        return await this.actions[actionName].do()
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

class Multiattack {
    constructor(number, attack) {
        this.atkNumber = number;
        this.attack = attack;
    }

    do() {
        let attacks = [];
        for (let i=0; i < this.atkNumber; i++){
            attacks.push(this.attack.do());
        }
        return attacks;
    }
}
class Multiattacks {
    constructor(sbData, attacksObj) {
        this.multiattacks = {};
        for (let multiattack of sbData["multiattack"]) {
            let [ number, attackName ] = multiattack.split("*");
            this.multiattacks[attackName] = new Multiattack(number, attacksObj.attacks[attackName]);
        }
    }

    do(attackName) {
        return this.multiattacks[attackName].do();
    }

    getData() {
        let data = {};
        for (let [ maName, multiattack ] of Object.entries(this.multiattacks)) {
            data[maName] = multiattack.atkNumber;
        }
        return data;
    }
}

module.exports = {
    Actions: Actions,
    Attacks: Attacks,
    Multiattacks: Multiattacks
}