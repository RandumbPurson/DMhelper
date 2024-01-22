import { statChoice, skillChoice } from "./enums";

export type stateType = {
    maxHP: number;
    initiativeString: string;

    HP: number;
    initiative: number;
    conditions: {[key: string]: string};
}

export type statsType = {
    pb: number;
    stats: {[key in statChoice]: number};
    statmods: {[key in statChoice]: number};

    skills: {[key in skillChoice]: number};
    savingThrows: {[key in statChoice]: number};

    replaceStats: (dstring: string, removeWS?: boolean) => string;
}

type resourcesType = {
    resourcesMax: {[key: string]: number};
    resources: {[key: string]: number};

    canUse: (resource: string, cost: number) => boolean;
    use: (resource: string, cost: number) => void;
}

export type traitsType = {
    name: string;
    size?: string;
    creatureType?: string;
    alignment?: string;

    AC: number;
    ACSource: string;
    HPDice: string;

    speed: {[key: string]: string};
    resistances?: string[];
    immunities?: string[];
    vulnerabilities?: string[];
    condImmunities?: string[];
    senses?: string[];
    languages?: string[];
    CR?: string[];
    traits?: {[key: string]: string};
}

type actionsType = {
    actions: {[key: string]: {
        text: string;
        rolls?: {[key: string]: string};
        maxUses?: number;
        uses?: number;
    }};
}

type attacksType = {
    attacks: {[key: string]: {
        hitBonus: string;
        hitString: string;

        dmgString: string;
        dmgType: string;

        type: string;
        range: string;
    }}
}


export type spellcastingType = {
    spellSrc?: string;
    text?: string;
    stat: statChoice;
    levels: { [key: string]: Object };
}

export type statblockType = {
    name?: string;
    uid?: number;

    stats: statsType;
    state: stateType;
    traits: traitsType;

    //optional
    resources?: resourcesType;
    actions?: {[key: string]: actionsType};
    attacks?: attacksType;
    spellcasting?: spellcastingType;
}

