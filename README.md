# DMhelper
Python Program to help me DM DnD stuf

## Stat Blocks
Stat blocks are written in YAML using the schema specified in `statblock.json`
It allows for ability scores, basic stats like AC, max HP, and speed, as well as actions and attacks
- These yaml files should be stored in a folder called `stats` in the running directory

## Basic Usage
When prompted with `stat blocks: ` enter the name of one of the yaml files. 
> eg; If there is a yaml file at `stats/goblin.yaml`, enter `goblin`
- To load multiple of the same monster type, prefix the name with the number and an asterisk, eg; `5*goblin`
- To load multiple monsters at the same time, separate them with a comma, eg; `goblin, dragon, 3*kobold`

After hitting `enter` you will be asked whether you want to continue or load more stat blocks. When you have
loaded all the statblocks you want, select `continue`

## Main Menu
The main menu displays each of the loaded monsters as well as 5 meta options:
- The 5 meta options can be triggered using the hotkeys seen beside them
- `Next Turn` will increment the turn tracker if initiative has been rolled
- `Load More Statblocks` will allow you to load more statblocks
- `Roll Initiative` will roll initiative for all monsters and prompt for names and initiative scores for your players
- `Clear` will clear the screen, removing any extra output besides the menu
- `Exit` will exit the program

### Monster Screen
Selecting one of the monsters will bring you to the monster screen, at the top the AC, HP, and speed are shown

In the menu, all of the available attacks and actions will be shown. Selecting an action will print the action text,
selecting an attack will perform the appropriate roll and report damage

There are also 2 meta options
- `Take Damage` will allow you to deal damage to the monster's HP
- `Exit` will bring you back to the main menu

# TODO
- [x] Implement to-hit rolls
- [ ] Implement action rolls
- [ ] Implement preview for actions and attacks
- [ ] Remove dead monsters
- [ ] Add monsters into initiative order
- [ ] Config
  - [ ] Number of players
  - [ ] YAML or JSON
