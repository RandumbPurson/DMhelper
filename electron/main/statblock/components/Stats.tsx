import { rollString } from "../../roller";
import { statChoice, skillChoice, skillMap } from "../../../../types/enums";
import { statblockData } from "../../../../types/statblockDataTypes";

export default class Stats {
  pb: number;
  stats: { [key in statChoice]: number };
  statmods: { [key in statChoice]: number };

  skills?: { [key in skillChoice]?: number };
  savingThrows?: { [key in statChoice]?: number };
  /**
   * @constructor
   * @param {object} sbData - The JS object loaded from the YAML file
   */
  constructor(sbData: statblockData) {
    this.pb = sbData["PB"];

    this.#parseStats(sbData["stats"])

    // Optional properties
    if ("skills" in sbData) {
      this.#parseSkills(sbData["skills"]!)
    }

    if ("saving throws" in sbData) {
      this.#parseSaves(sbData["saving throws"]!)
    }
  }

  #parseStats(stats: {[key in statChoice]: number}) {
    this.stats = stats;
    this.statmods = this.#calcStatmods();
  }
  #calcStatmods() {
    let statmods: {[key in statChoice]?: number} = {};
    for (let stat in this.stats) {
      statmods[stat as statChoice] = Math.floor((this.stats[stat as statChoice] - 10) / 2)
    }
    return statmods as {[key in statChoice]: number};
  }

  #parseSkills(skills: skillChoice[]) {
    this.skills = {};
    for (let skill of skills) {
      let key = skill.toLowerCase();

      if (!(key in skillMap)) {console.log(`${key} is not a valid skill!`)}

      this.skills[key as skillChoice] = this.statmods[skillMap[key as skillChoice]] + this.pb
    }
  }

  #parseSaves(saves: statChoice[]) {
    this.savingThrows = {};
    for (let save of saves) {
      this.savingThrows[save] = this.statmods[save] + this.pb
    }
  }

  getSave(save: statChoice) {
    if (this.savingThrows && save in this.savingThrows) {
      return this.savingThrows[save]!
    } else {
      return this.statmods[save]
    }
  }

  getSkill(skill: skillChoice) {
    if (this.skills && skill in this.skills) {
      return this.skills[skill]!
    } else {
      return this.statmods[skillMap[skill]]
    }
  }

  /**
   * Replace stat tokens (STR, DEX, CON, INT, WIS, CHA, PB) in a string with
   * the values specified by the statblock
   * @param {string} string - A string which might include stat tokens
   * @param {boolean} [removeWS=true] - Whether to remove whitespace in the string
   * @returns {string} The string with stat tokens replaced
   */
  replaceStats(string: string, removeWS = true): string {
    if (removeWS) {
      string = string.replaceAll(" ", "");
    }
    for (let key in this.statmods) {
      string = string.replaceAll(
        key,
        this.statmods[key as statChoice].toString()
      );
    }
    string = string.replaceAll("PB", this.pb.toString());

    return string;
  }

  #rollCheck(modifier: number) {
    return rollString(`1d20*20+${modifier}`)
  }
  statCheck(stat: statChoice) {
    return this.#rollCheck(this.statmods[stat])
  }
  rollSave(save: statChoice) {
    return this.#rollCheck(this.getSave(save))
  }
  skillCheck(skill: skillChoice) {
    return this.#rollCheck(this.getSkill(skill))
  }
}
