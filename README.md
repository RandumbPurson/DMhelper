# DMhelper
Python terminal application to help me DM DnD stuff, unfortunately, the library I use to help with terminal menus only works on linux

## Statblock specification
Statblocks are written in either [yaml](https://yaml.org/) or [json](https://www.json.org/json-en.html) files.
They must follow a schema provided in [statblock.json](statblock.json) rather closely. For more info on the fields
and proper formatting, see [here](docs/schema.md) or the examples in `statblock-examples`.

## Basic Usage
Run using the `python src/main.py`, which accepts a number of args
- `--target` the directory containing the statblock files
- `--format` one of "yaml" or "json", specifies the file format to use

## Loading menu
![loading menu image](docs/loading-menu.png)
- `Continue` continues to main menu
- `Load More` will prompt for a list of stablock names
- `List Available` will list the files in the specified root folder and allow you to select one and choose how many of that statblock to load

## Main Menu
![main menu image](docs/main-menu.png)
You can select any of the loaded statblocks which will bring you to the statblock menu,
each of the meta-options has a shortcut key
- `Next Turn` progresses the turn tracker (top of the screen)
- `Load More Statblocks` brings you back to the loading menu
- `Roll Initiative` initializes the turn tracker by rolling initiatives for the monster and prompting for PC intitiatives
- `Clear` will clear non-menu output
- `Exit` will exit the program


## Statblock Menu
![statblock menu](docs/statblock-menu.png)
Output will be inserted above the menu. This output will persist until cleared.

AC, HP, Speed, and any statblock resources (eg; legendary action points) are shown in a yellow status bar below the menu.

The menu has two main section:

### Actions and Traits
Not all of these will be shown for every statblock
- `<Traits>` While hovered over will display any of the statblock's traits in the preview box below the menu, selecting this option does nothing
- `[Actions]`, `[Bonus Actions]`, `[Reactions]`, and `[Resource Actions]` While hovered will show you the available options in the preview box. Selecting any of them will bring you to a new menu which allows you to select which of the actions you want to take.
- `Attacks` While hovered will display the attacks the statblock can make in the preview box. Selecting it will bring you to a new menu which allows you to select which attack you want to make.
- `Multiattack` While hovered over will display what multiattacks can be made in the preview box. Selecting it will bring you to a new menu which allows you to select which multiattack you want to make.

### Meta-Options
- `Skill Check` will run a skill check
- `Take Damage` will prompt you for damage to be dealt to the creature, when it's hp becomes 0 it will be deleted and removed from initiative
- `Manage Conditions` While hovered, will display conditions, when seleceted it will bring you to a menu allowing you to add, modify, and remove conditions as key value pairs. (eg; poisoned: 1 minute, DC 14)
- `Reset Resource` will bring you to a menu allowing you to reset statblock resources to their max value
- `Clear` will clear the screen
- `Exit` will return to the main menu

# TODO
- [x] Implement to-hit rolls
- [x] Implement action rolls
- [x] Implement preview for actions and attacks
- [x] Remove dead monsters
- [x] Add monsters into initiative order
- [x] Config
- [ ] Improve menu layout
- [x] Add condition tracking
- [ ] 
