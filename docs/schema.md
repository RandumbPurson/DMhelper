# Statblock Schema
Statblocks must be written in either `yaml` or `json` and follow a rather strict schema detailed in [statblock.json](../statblock.json)
or, more informally, below. If something is failing on specific statblocks, 
there's a very good chance its due to some slight inaccuracy in the formatting of your statblocks.

## Basic Properties

> All of these properties are required!

- `maxHP` (int) max hit points
- `AC` (int) armor class
- `PB` (int) proficiency bonus, can be used in several other spots where it will be interpolated.
- `speed` (object) an object containing key:value pairs of speed types to ints
  - `walking` (int) walk speed; the key-value pairs here are arbitrary

## Stats

> All of these properties are required!

Only need to specify scores, modifiers will be calculated when needed
The following are enclosed by the key `stats`
- `STR` (int) strength
- `DEX` (int) dexterity
- `CON` (int) constitution
- `INT` (int) intelligence
- `WIS` (int) wisdom
- `CHA` (int) charisma

These same codes can be used in several other spots where they will
be interpolated.

## Attacks

Standard attacks ecnlosed by the key `attacks`. These can have arbitrary keys but have required properties for those keys.

- `type` (string) one of "melee" or "ranged"
- `range` (string) the range or reach of the weapon
- `to-hit` (string) the to-hit modifier, can use stat codes and PB
- `damage` (string) the damage, can use stat codes, should include a comma followed by the damage type

YAML example - [Scimitar](https://roll20.net/compendium/dnd5e/Scimitar#content) attack using finesse
```yaml
attacks:
  Scimitar:
    type: "melee"
    range: 5ft
    to-hit: DEX + PB
    damage: 1d6 + DEX, slashing
```

## Actions
Non-attack actions, enclosed by the `actions` key. These can have arbitrary keys but have required properties for those keys.

- `text` (string) A string describing the action
- `rolls` (object) An object of key:value pairs specifying rolls to perform for this action, if a roll can be critted, indicate with an `*` at the end of the roll
- `uses` (int) The number of times this action can be used

YAML example:
```yaml
actions:
  Stunning Strike:
    text: Make a strength-based attack roll without proficiency against target in 5ft. On a hit, the target is stunned for one turn. Can only be used once per long rest.
    rolls:
        to-hit: 1d20 + STR*
    uses: 1
```

### Multiattack
Can specify a special `multiattack` key as an array. It is composed of an array of strings in the format `n*attack` where `n` is an int specifying the number of attacks and `attack` is one of the keys specified in `attacks`.

YAML example - "2 scimitar attacks or 2 shortbow attacks"
```yaml
actions:
  multiattack:
    - 2*Scimitar
    - 2*Shortbow
```

## Traits
Arbitrary static abilities and info. This is sort of a catch-all for any text to be displayed. Written in the form of key-value pairs of name and text enclosed by the `traits` key.

YAML example:
```yaml
traits:
  blindsight: 60 ft
  langauges: common, draconic
  Nimble Escape: Can take the Disengage or Hide action as a bonus action on each of its turns.
```