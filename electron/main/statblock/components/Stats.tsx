import { rollString } from "../../roller";

import { statType, statblockDataType } from "../../../../@types/statblockTypes";

const skillMap = {
  athletics: "STR",
  acrobatics: "DEX",
  "sleight of hand": "DEX",
  stealth: "DEX",
  arcana: "INT",
  history: "INT",
  investigation: "INT",
  nature: "INT",
  religion: "INT",
  "animal handling": "WIS",
  insight: "WIS",
  medicine: "WIS",
  perception: "WIS",
  survival: "WIS",
  deception: "CHA",
  intimidation: "CHA",
  performance: "CHA",
  persuasion: "CHA",
};

type skillType = keyof typeof skillMap;

export default class Stats {
  pb: number;
  stats: { [key in statType]: number };
  statmods: { [key: string]: number };

  skills?: string[];
  savingThrows?: string[];
  /**
   * @constructor
   * @param {object} sbData - The JS object loaded from the YAML file
   */
  constructor(sbData: statblockDataType) {
    this.stats = sbData["stats"];
    this.statmods = {};
    // generate modifiers
    for (let stat in this.stats) {
      this.statmods[stat as statType] = Math.floor(
        (this.stats[stat as statType] - 10) / 2
      );
    }
    this.pb = sbData["PB"];
    this.#load_proficiencies(sbData);
  }

  /**
   * Load optional proficiencies
   * @param {object} sbData - The JS object loaded from the YAML file
   */
  #load_proficiencies(sbData: statblockDataType): void {
    this.skills = [];
    this.savingThrows = [];
    if ("skills" in sbData) {
      this.skills = sbData["skills"];
    }
    if ("saving throws" in sbData) {
      this.savingThrows = sbData["saving throws"];
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
        this.statmods[key as statType].toString()
      );
    }
    string = string.replaceAll("PB", this.pb.toString());

    return string;
  }

  /**
   * Perform a statCheck for a specific stat with or without proficiency bonus
   * @param {string} stat - The stat (as a stat token) to perform the check for
   * @param {boolean} [addPB=false] - Whether or not to add proficiency bonus
   * @returns {[int, string]} The result as an array of form [total, roll string]
   */
  statCheck(stat: string, addPB = false) {
    let dstring;
    if (addPB) {
      dstring = `1d20*20+${this.statmods[stat]}+${this.pb}`;
    } else {
      dstring = `1d20*20+${this.statmods[stat]}`;
    }
    return rollString(dstring);
  }

  /**
   * Perform a saving throw for a stat
   * @param {string} stat - The stat to roll a save for
   * @returns {[int, string]} An array of form [total, roll string]
   */
  rollSave(stat: statType) {
    return this.statCheck(
      stat,
      this.savingThrows !== undefined ? this.savingThrows.includes(stat) : false
    );
  }

  /**
   * Perform a skill check for a skill
   * @param {string} skill - The skill to make a check for
   * @returns {[int, string]} An array of form [total, roll string]
   */
  skillCheck(skill: skillType) {
    return this.statCheck(
      skillMap[skill],
      this.skills !== undefined ? this.skills.includes(skill) : false
    );
  }
}
