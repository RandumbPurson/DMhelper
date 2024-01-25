import { rollString } from "../../roller";

import {
  attackDataType,
  statsType,
  statblockDataType,
} from "../../../../@types/statblockTypes";

class Attack {
  hitBonus: string;
  hitString: string;

  dmgString: string;
  dmgType: string;

  type: string;
  range: string;
  constructor(attackData: attackDataType, statsObj: statsType) {
    this.hitBonus = statsObj.replaceStats(attackData["to-hit"]);
    this.hitString = "1d20*20+" + this.hitBonus;

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
      this.dmgType,
    ];
  }

  getData() {
    return {
      type: this.type,
      range: this.range,
      hitBonus: this.hitBonus,
      dmgString: this.dmgString,
      dmgType: this.dmgType,
    };
  }
}
class Attacks {
  attacks: { [key: string]: Attack };
  constructor(sbData: statblockDataType, statsObj: statsType) {
    this.attacks = {};
    for (let [attackName, attackData] of Object.entries(sbData["attacks"]!)) {
      // only load if attacks exist
      this.attacks[attackName] = new Attack(attackData, statsObj);
    }
  }

  do(attackName: keyof typeof this.attacks) {
    return this.attacks[attackName].do();
  }

  getData() {
    let data: { [key: string]: Object } = {};
    for (let [attackName, attack] of Object.entries(this.attacks)) {
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
    for (let i = 0; i < this.atkNumber; i++) {
      attacks.push(this.attack.do());
    }
    return attacks;
  }
}
class Multiattacks {
  multiattacks: { [key: string]: Multiattack };
  constructor(sbData: statblockDataType, attacksObj: Attacks) {
    this.multiattacks = {};
    for (let multiattack of sbData["multiattack"]!) {
      // only load if multiattack exists
      let [number, attackName] = multiattack.split("*");
      this.multiattacks[attackName] = new Multiattack(
        number,
        attacksObj.attacks[attackName]
      );
    }
  }

  do(attackName: keyof typeof this.multiattacks) {
    return this.multiattacks[attackName].do();
  }

  getData() {
    let data: { [key: string]: number } = {};
    for (let [maName, multiattack] of Object.entries(this.multiattacks)) {
      data[maName] = multiattack.atkNumber;
    }
    return data;
  }
}

export { Attacks, Multiattacks };
