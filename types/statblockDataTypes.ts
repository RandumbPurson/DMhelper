import { statChoice, skillChoice } from "./enums";

export type actionData ={
    text: string;
    rolls?: {[key: string]: string}
    uses?: number;
    resource?: string;
    cost?: number;
}

export type attackData ={
    type: string;
    range: string;
    "to-hit": string;
    damage: string;
}


export type spellData ={
    [key: string]:{
        text?: string;
        link?: string;
    }
}

export type spellLvlData={
    slots: number;
    spells: { [key: string]: spellData};
}


export type spellcastingData = {
    "spell source"?: string;
    text?: string;
    stat: statChoice;
    levels: { [key: string]: spellLvlData};
}

export type statblockData = {
    name: string;
    size?: string;
    "creature type"?: string;
    alignment?: string;

    AC: string;
    maxHP: string;
    speed: {[key: string]: string};
    
    PB: number;
    stats: {
        STR: number;
        DEX: number;
        CON: number;
        INT: number;
        WIS: number;
        CHA: number;
    };

    "saving throws"?: statChoice[];
    skills?: skillChoice[];

    "damage vulnerabilities"?: string[];
    "damage resistances"?: string[];
    "damage immunities"?: string[];
    "condition immunities"?: string[];
    senses?: string[];
    languages?: string[];
    CR?: number;
    
    traits?: {[key: string]: string};
    spellcasting?: spellcastingData;

    resources?: {[key:string]: number};
    attacks?: attackData;
    multiattack?: string[];
    actions?: {[key: string]: actionData};
    reactions?: {[key: string]: actionData};
    "bonus actions"?: {[key: string]: actionData};
    "legendary actions"?: {[key: string]: actionData};
    "lair actions"?: {[key: string]: actionData};
    "resource actions"?: {[key: string]: actionData}; // should be replaced
}

