export type skillChoices =
  "athletics" |
  "acrobatics" |
  "sleight of hand" |
  "stealth" |
  "arcana" |
  "history" |
  "investigation" |
  "nature" |
  "religion" |
  "animal handling" |
  "insight" |
  "medicine" |
  "perception" |
  "survival" |
  "deception" |
  "intimidation" |
  "performance" |
  "persuasion";

export type statChoices = "STR" | "DEX" | "CON" | "INT" | "WIS" | "CHA";

export const skillMap: {[key in skillChoices]: statChoices} = {
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
