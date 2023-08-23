import { rollString } from "../../roller";
import { actionDataType, statsType, resourcesType, statblockDataType, statblockType } from "../statblockTypes";

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

export default Actions;