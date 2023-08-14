interface actionData {
    [key: string]: {
        text: string;
        rolls?: {[key: string]: string}
        uses?: number;
        resource?: string;
        cost?: number;
    };
}

type statType = "STR" | "DEX" | "CON" | "INT" | "WIS" | "CHA";

interface statblockData {
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
        levels: {[key: string]: {
            slots: number;
            spells: {
                [key: string]:{
                    text?: string;
                    link?: string;
                }
            }
        }}
    }

    resources?: {[key:string]: number};
    attacks?: {
        type: string;
        range: string;
        "to-hit": string;
        damage: string;
    };
    multiattack?: string[];
    actions?: actionData;
    reactions?: actionData;
    "bonus actions"?: actionData;
    "legendary actions"?: actionData;
    "lair actions"?: actionData;
}

export type { statblockData, statType };