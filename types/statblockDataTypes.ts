import { statChoices, skillChoices } from "./enums";

export type actionDataType ={
    text: string;
    rolls?: {[key: string]: string}
    uses?: number;
    resource?: string;
    cost?: number;
}

export type attackDataType ={
    type: string;
    range: string;
    "to-hit": string;
    damage: string;
}


export type spellDataType ={
    [key: string]:{
        text?: string;
        link?: string;
    }
}

export type spellLvlDataType={
    slots: number;
    spells: { [key: string]: spellDataType};
}


export type spellcastingDataType = {
    "spell source"?: string;
    text?: string;
    stat: statChoices;
    levels: { [key: string]: spellLvlDataType};
}

export type statblockDataType = {
    name: string;
    size?: string;
    "creature type"?: string;
    alignment?: string;

    AC: string;
    maxHP: string;
    speed: {[key: string]: string};

    stats: {
        STR: number;
        DEX: number;
        CON: number;
        INT: number;
        WIS: number;
        CHA: number;
    };

    "saving throws"?: statChoices[];
    skills?: skillChoices[];
    "damage resistances"?: string[];
    "damage immunities"?: string[];
    "damage vulnerabilities"?: string[];
    "condition immunities"?: string[];
    senses?: string[];
    languages?: string[];
    CR?: string[];
    PB: number;
    
    traits?: {[key: string]: string};
    spellcasting?: spellcastingDataType;

    resources?: {[key:string]: number};
    attacks?: attackDataType;
    multiattack?: string[];
    actions?: {[key: string]: actionDataType};
    reactions?: {[key: string]: actionDataType};
    "bonus actions"?: {[key: string]: actionDataType};
    "legendary actions"?: {[key: string]: actionDataType};
    "lair actions"?: {[key: string]: actionDataType};
    "resource actions"?: {[key: string]: actionDataType}; // should be replaced
}

