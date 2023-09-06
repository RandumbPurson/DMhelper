import { statblockDataType } from "../statblockTypes";

/**
 * Splits a numeric value and string separated by a given delimiter
 * @param valstrString A value string pair eg; "14, age"
 * @param delim The delimiter to split on; defaults to ","
 * @returns The separated value and string as an array eg; [14, "age"]
 */
export function splitValStr(
  valstrString: string,
  delim = ","
): [number, string] {
  let valstrArr: string[] = `${valstrString}`.split(delim);
  let val = valstrArr[0] as unknown as number;
  let str = valstrArr[1];
  return [val, str];
}

export class Traits {
  name: string;
  size?: string;
  creatureType?: string;
  alignment?: string;

  AC: number;
  ACSource: string;
  HPDice: string;

  speed: { [key: string]: string };
  resistances?: string[];
  immunities?: string[];
  vulnerabilities?: string[];
  condImmunities?: string[];
  senses?: string[];
  languages?: string[];
  CR?: string[];
  traits?: { [key: string]: string };

  constructor(sbData: statblockDataType) {
    this.name = sbData["name"];
    [this.AC, this.ACSource] = splitValStr(sbData["AC"]);
    [, this.HPDice] = splitValStr(sbData["maxHP"]);
    this.speed = sbData["speed"];

    this.#loadOptional(sbData);
  }

  #loadOptional(sbData: statblockDataType) {
    this.size = sbData["size"];
    this.creatureType = sbData["creature type"];
    this.alignment = sbData["alignment"];

    this.resistances = sbData["damage resistances"];
    this.immunities = sbData["damage immunities"];
    this.vulnerabilities = sbData["damage vulnerabilities"];
    this.senses = sbData["senses"];
    this.languages = sbData["languages"];
    this.CR = sbData["CR"];

    this.traits = sbData["traits"];
  }

  getData() {}
}
