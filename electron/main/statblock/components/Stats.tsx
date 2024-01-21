import { rollString } from "../../roller";
import { statChoices, skillChoices, skillMap } from "../../../../types/enums";
import { statblockDataType } from "../../../../types/statblockDataTypes";

export default class Stats {
  pb: number;
  stats: { [key in statChoices]: number };
  statmods: { [key in statChoices]: number };

  skills: { [key in skillChoices]: number };
  savingThrows: { [key in statChoices]: number };
  /**
   * @constructor
   * @param {object} sbData - The JS object loaded from the YAML file
   */
  constructor(sbData: statblockDataType) {
    this.pb = sbData["PB"];

    this.#parseStats(sbData["stats"])

    // Optional properties
    this.skills = this.#defaultSkills();
    if ("skills" in sbData) {
      this.#parseSkills(sbData["skills"]!)
    }

    this.savingThrows = this.statmods;
    if ("saving throws" in sbData) {
      this.#parseSaves(sbData["saving throws"]!)
    }
  }

  #parseStats(stats: {[key in statChoices]: number}) {
    this.stats = stats;
    this.statmods = this.#calcStatmods();
  }
  #calcStatmods() {
    let statmods: {[key in statChoices]?: number} = {};
    for (let stat in this.stats) {
      statmods[stat as statChoices] = Math.floor((this.stats[stat as statChoices] - 10) / 2)
    }
    return statmods as {[key in statChoices]: number};
  }

  #parseSkills(skills: skillChoices[]) {
    for (let skill of skills) {
      let key = skill.toLowerCase();

      if (!(key in skillMap)) {console.log(`${key} is not a valid skill!`)}

      this.skills[key as skillChoices] = this.statmods[skillMap[key as skillChoices]] + this.pb
    }
  }
  #defaultSkills() {
    let skills: {[key in skillChoices]?: number} = {};
    for (let skill in skillMap) {
      skills[skill as skillChoices] = this.statmods[skillMap[skill as skillChoices]];
    }
    return skills as {[key in skillChoices]: number}
  }

  #parseSaves(saves: statChoices[]) {
      for (let save of saves) {
        this.savingThrows[save] = this.statmods[save] + this.pb
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
        this.statmods[key as statChoices].toString()
      );
    }
    string = string.replaceAll("PB", this.pb.toString());

    return string;
  }

  #rollCheck(modifier: number) {
    return rollString(`1d20*20+${modifier}`)
  }

  statCheck(stat: statChoices) {
    return this.#rollCheck(this.statmods[stat])
  }

  /**
   * Perform a saving throw for a stat
   * @param {string} stat - The stat to roll a save for
   * @returns {[int, string]} An array of form [total, roll string]
   */
  rollSave(stat: statChoices) {
    return this.#rollCheck(this.savingThrows[stat])
  }

  /**
   * Perform a skill check for a skill
   * @param {string} skill - The skill to make a check for
   * @returns {[int, string]} An array of form [total, roll string]
   */
  skillCheck(skill: skillChoices) {
    return this.#rollCheck(this.skills[skill])
  }
}
