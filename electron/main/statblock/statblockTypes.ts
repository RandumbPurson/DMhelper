interface actionDataType {
    text: string;
    rolls?: {[key: string]: string}
    uses?: number;
    resource?: string;
    cost?: number;
}

interface attackDataType {
    type: string;
    range: string;
    "to-hit": string;
    damage: string;
};

interface spellDataType {
    [key: string]:{
        text?: string;
        link?: string;
    }
}

interface spellLvlDataType{
    [key: string]: {
        slots: number;
        spells: spellDataType;
    }
}

type statType = "STR" | "DEX" | "CON" | "INT" | "WIS" | "CHA";

interface statblockDataType {
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

    "saving throws"?: string[];
    skills?: string[];
    "damage resistances"?: string[];
    "damage immunities"?: string[];
    "damage vulnerabilities"?: string[];
    "condition immunities"?: string[];
    senses?: string[];
    languages?: string[];
    CR?: string[];
    PB: number;
    
    traits?: {[key: string]: string};
    spellcasting?: {
        text: string;
        stat: statType;
        levels: spellLvlDataType;
    }

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

interface stateType {
    maxHP: number;
    initiativeString: string;

    HP: number;
    initiative: number;
    conditions: {[key: string]: string};
}

interface statsType {
    pb: number;
    stats: {[key in statType]: number};
    statmods: {[key: string]: number};

    skills?: string[];
    savingThrows?: string[];

    replaceStats: (dstring: string, removeWS?: boolean) => string;
}

interface resourcesType {
    resourcesMax: {[key: string]: number};
    resources: {[key: string]: number};

    canUse: (resource: string, cost: number) => boolean;
    use: (resource: string, cost: number) => void;
}

interface traitsType {
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

interface actionsType {
    actions: {[key: string]: {
        text: string;
        rolls?: {[key: string]: string};
        maxUses?: number;
        uses?: number;
    }};
}

interface attacksType {
    attacks: {[key: string]: {
        hitBonus: string;
        hitString: string;

        dmgString: string;
        dmgType: string;

        type: string;
        range: string;
    }}
}

interface statblockType {
    name?: string;
    uid?: number;

    stats: statsType;
    state: stateType;
    traits: traitsType;

    //optional
    resources?: resourcesType;
    actions?: {[key: string]: actionsType};
    attacks?: attacksType;
}

export type { 
    statblockDataType, actionDataType, attackDataType,
    statType,
    statblockType,
    statsType, stateType, traitsType, resourcesType,
};