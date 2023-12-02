import { rollString } from "../../roller";

export default class State {
  /**TODO
   * Implement health and condition tracking
   */

  maxHP: number;
  initiativeString: string;

  HP: number;
  initiative: number;
  conditions: { [key: string]: string };

  constructor(maxHP: number, initiativeString: string) {
    this.maxHP = maxHP;
    this.initiativeString = initiativeString;

    this.HP = this.maxHP;
    this.initiative = 0;
    this.conditions = {};
  }

  /**
   * Rolls, sets, and returns the statblock's initiative score
   * @returns The statblock's initiative
   */
  rollInitiative(): number {
    let rstring;
    [this.initiative, rstring] = rollString(this.initiativeString);
    return this.initiative;
  }
}
