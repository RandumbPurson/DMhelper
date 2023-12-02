import {
  spellDataType,
  spellcastingDataType,
  spellcastingType,
  statType,
} from "../../../../@types/statblockTypes";

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
  spells: Spell[];
  constructor(
    public level: string,
    public slots: number,
    spells: spellDataType[],
    spellSrc?: string
  ) {
    this.spells = spells.map((spellData) => {
      const name = Object.keys(spellData)[0];
      if (typeof spellData[name].link !== undefined) {
        if (typeof spellSrc !== undefined) {
          spellData[name].link = spellSrc! + spellData[name].link!;
        } else {
          spellData[name].link = spellData[name].link!;
        }
      }

      return new Spell(name, spellData[name]);
    });
  }
}

export default class Spells implements spellcastingType {
  spellSrc?: string;
  text: string;
  stat: statType;
  levels: { [key: string]: SpellLvL };
  constructor(sbSpellData: spellcastingDataType) {
    this.spellSrc = sbSpellData["spell source"];
    this.text = sbSpellData.text;
    this.stat = sbSpellData.stat;
    console.log("spell levels:", sbSpellData.levels);
    this.levels = {};
    for (let spellLvl in sbSpellData.levels) {
      this.levels[spellLvl] = new SpellLvL(
        spellLvl,
        sbSpellData.levels[spellLvl],
        sbSpellData.levels[spellLvl].spells
      );
      {
        return new SpellLvL(
          level,
          spellLvl[level].slots,
          spellLvl[level].spells,
          this.spellSrc
        );
      }
    }
  }
}
