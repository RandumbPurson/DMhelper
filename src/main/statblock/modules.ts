import { rollString } from "../roller";
import { actionDataType, attackDataType, resourcesType, statblockDataType, statblockType, statsType } from "./statblockTypes";

class Action {
    text: string;
    rolls?: {[key: string]: string};
    maxUses?: number;
    uses?: number;

    constructor(actionData: actionDataType, statsObj: statsType) {
        this.text = actionData["text"].trim();

        if (actionData["rolls"] != undefined) {
            this.rolls = {};
            Object.entries(actionData["rolls"]).forEach(elem => 
            {
                let [ key, rstring ] = elem;
                this.rolls![key] = statsObj.replaceStats(
                    rstring, true
                );
            });
        }

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

        if (this.rolls != undefined) {
            let rolls: {[key: string]: [number, string]} = {};
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
        let data: {[key: string]: any} = {"text": this.text};
        if (this.maxUses != undefined){
            data["maxUses"] = this.maxUses;
            data["uses"] = this.uses;
        }
        return data;
    }

    async canUse() {
        if (this.uses == undefined){return true}
        return this.uses > 0
    }
    async decrementUses() {
        if (this.uses == undefined){return}
        this.uses -= 1
    }

}
class ResourceAction extends Action {
    resources: resourcesType;
    resourceKey: string;
    cost: number;

    constructor(actionData: actionDataType, statsObj: statsType, resources: resourcesType) {
        super(actionData, statsObj);

        this.resources = resources;
        this.resourceKey = actionData["resource"]!; // only loaded if resource exists
        this.cost = actionData["cost"] || 1;
    }
    async canUse() {
        let canUseBasic = this.uses == undefined ? true : this.uses > 0;
        let canUseResource = this.resources.canUse(this.resourceKey, this.cost);
        return canUseBasic && canUseResource;
    }
    async decrementUses(){
        if (this.uses != undefined){this.uses -= 1}

        this.resources.use(this.resourceKey, this.cost)
    }
    getData() {
        let data: {[key: string]: any} = {"text": this.text};
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
    actions: {[key: string]: Action};
    
    constructor(sbData: statblockDataType, statblock: statblockType, sbDataKey: keyof statblockDataType ="actions") {
        this.actions = {};
        let actionsData = sbData[sbDataKey] as {[key: string]: actionDataType};
        for (let key in actionsData) {
            let actionData = actionsData[key];
            if (statblock["resources"] == undefined) {
                this.actions[key] = new Action(actionData, statblock.stats);
            }else{
                this.actions[key] = new ResourceAction(actionData, statblock.stats, statblock.resources);
            }
        }
    }

    async do(actionName: keyof typeof this.actions) {
        return await this.actions[actionName].do()
    }

    getData() {
        let data: {[keyType: string]: Object} = {};
        for (let key in this.actions){
            let val = this.actions[key];
            data[key] = val.getData();
        }
        return data;
    }
}

class Attack {
    hitBonus: string;
    hitString: string;

    dmgString: string;
    dmgType: string;

    type: string;
    range: string;
    constructor(attackData: attackDataType, statsObj: statsType) {
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
    attacks: {[key: string]: Attack}
    constructor(sbData: statblockDataType, statsObj: statsType) {
        this.attacks = {};
        for (let [ attackName, attackData ] of Object.entries(sbData["attacks"]!)){ // only load if attacks exist
            this.attacks[attackName] = new Attack(attackData, statsObj);
        }
    }

    do(attackName: keyof typeof this.attacks) {
        return this.attacks[attackName].do()
    }

    getData() {
        let data: {[key: string]: Object} = {};
        for (let [attackName, attack] of Object.entries(this.attacks)){
            data[attackName] = attack.getData();
        }
        return data;
    }
}

class Multiattack {
    atkNumber: number;
    attack: Attack;

    constructor(number: string, attack: Attack) {
        this.atkNumber = parseInt(number);
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
    multiattacks: {[key: string]: Multiattack}
    constructor(sbData: statblockDataType, attacksObj: Attacks) {
        this.multiattacks = {};
        for (let multiattack of sbData["multiattack"]!) { // only load if multiattack exists
            let [ number, attackName ] = multiattack.split("*");
            this.multiattacks[attackName] = new Multiattack(number, attacksObj.attacks[attackName]);
        }
    }

    do(attackName: keyof typeof this.multiattacks) {
        return this.multiattacks[attackName].do();
    }

    getData() {
        let data: {[key: string]: number} = {};
        for (let [ maName, multiattack ] of Object.entries(this.multiattacks)) {
            data[maName] = multiattack.atkNumber;
        }
        return data;
    }
}

export {
    Actions, Attacks, Multiattacks
}