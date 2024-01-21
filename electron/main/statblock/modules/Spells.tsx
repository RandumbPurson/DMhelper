import {
  spellcastingType,
} from "../../../../types/statblockObjectTypes";

import { statChoices } from "../../../../types/enums";

import {
    spellDataType,
    spellcastingDataType
} from "../../../../types/statblockDataTypes";

class Spell {
    text?: string;
    link?: string;

    constructor(
        public name: string,
        { text, link }: { text?: string; link?: string }
    ) {
        this.text = text;
        this.link = link;
    }
}

class SpellLvL {
    spells: {[key: string]: Spell};
    constructor(
        public level: string,
        public slots: number,
        spells: { [key: string]: spellDataType},
        spellSrc?: string
    ) {
        this.spells = {};
        for (let spellName in spells) {
            this.spells[spellName] = this.buildLink(
                spellName, spells[spellName], spellSrc
            );
        }
    }

    buildLink(name: string, spellInfo: {text?: string, link?: string}, spellSrc?: string) {
        if (typeof spellInfo.link !== undefined) {
            if (typeof spellSrc !== undefined) {
                spellInfo.link = spellSrc! + spellInfo.link!;
            } else {
                spellInfo.link = spellInfo.link!;
            }
        }

        return new Spell(name, spellInfo);
    }
}

export default class Spells implements spellcastingType {
    spellSrc?: string;
    text?: string;
    stat: statChoices;
    levels: { [key: string]: SpellLvL };
    constructor(sbSpellData: spellcastingDataType) {
        this.spellSrc = sbSpellData["spell source"];
        this.text = sbSpellData.text;
        this.stat = sbSpellData.stat;
        this.levels = {};
        for (let spellLvl in sbSpellData.levels) {
            this.levels[spellLvl] = new SpellLvL(
                spellLvl,
                sbSpellData.levels[spellLvl].slots,
                sbSpellData.levels[spellLvl].spells,
                this.spellSrc
            );
        }
    }
}
