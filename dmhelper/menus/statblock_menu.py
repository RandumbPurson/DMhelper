from simple_term_menu import TerminalMenu
from menus.menu import Menu
from statblock_manager.statblock_components import skill_map
import os
from typing import NewType

# Types for type annotations, avoiding circular imports
StatBlock = NewType("StatBlock", object)  # a StatBlock object
SBComponent = NewType("SBComponent", object)  # a component used in a StatBlock

def conditions_menu(statblock: StatBlock):
    """
    Presents a basic menu to add, modify, and remove conditions from a statblock

    :param statblock: The statblock to modify the conditions of
    """
    # TODO - refactor! This code is really hard to read
    update_menu = lambda options :TerminalMenu(
            options,
            preview_command=lambda key: statblock.conditions[key] if key not in ["New", "Exit"] else ""
        )
    meta_opts = ["[n] New", "[q] Exit"]
    options = list(statblock.conditions.keys()) + meta_opts

    
    choice = options[update_menu(options).show()]
    if choice not in meta_opts:
        
        suboptions = ["[r] Remove", "[m] Modify", "[q] Exit"]
        subchoice = suboptions[TerminalMenu(suboptions, title=f"{choice}: {statblock.conditions[choice]}" if choice not in meta_opts else "").show()]
        if subchoice == "[r] Remove":
            del statblock.conditions[choice]
        elif subchoice == "[m] Modify":
            newval = input(f"{choice}: ({statblock.conditions[choice]}): ")
            statblock.conditions[choice]=newval
    if choice == "[n] New":
        condition_name = input("condition: ")
        condition_val = input(f"{condition_name}: ")
        statblock.conditions[condition_name] = condition_val

def skillcheck_menu(stats: SBComponent):
    """Display menu to perform a skill check or save"""
    options = stats.skills + stats.shortcut_scores
    skill_choice = options[TerminalMenu(options).show()]
    if skill_choice in stats.shortcut_scores:
        skill_choice = skill_choice.split(" ")[-1]
        save_check = TerminalMenu(
            ["[s] Save", "[c] Check"], 
            title="Saving Throw or Ability Check?"
        ).show()
        stats.skill_check(skill_choice, save_check == 0 and skill_choice in stats.saving_throws)
    else:
        print(skill_choice, end=": ")
        stats.skill_check(skill_map[skill_choice], True)

class StatblockMenu(Menu):

    def _init_hook(self):
        self.title = "\u250f" + "\u2501"*10

    def _set_options(self):
        options = []

        for key in self.server.key_map:
            if self.server.has[key]:
                options.append(self.server.key_map[key])

        options.extend([
            "[s] Skill Check",
            "[d] Take Damage",
            "[m] Manage Conditions",
            "[r] Reset Resource",
            "[c] Clear",
            "[q] Exit"
        ])
        self.options, self.optlen = options, len(options)
    
    def _set_status_bar(self):
        status_bar = f"|AC: {self.server.ac} | HP: {self.server.hp}/{self.server.maxHP} | spd: {str(self.server.speed)} |"
        if self.server.has["resources"]:
            status_bar = status_bar + "|".join(
                [f" {key}: ({self.server.resources[key]}/{self.server.max_resources[key]}) " \
                 for key in self.server.resources]
            ) + "|"

        self.status_bar = status_bar
    
    def _preview_command(self, choice):
        if choice in self.server.preview_map:
            return self.server.preview_map[choice]()
        return ""
    
    def _post_loop(self):
        return 0
    
    def _update_menu(self):
        self._set_options()
        self._set_status_bar()
        return super()._update_menu()
    
    def reset_resource(self):
        """Display a menu to reset a resource for the statblock"""
        options = list(self.server.resources.keys())
        options.append("[q] Cancel")
        menu = TerminalMenu(options, preview_command=\
            lambda key: f"{key}: {self.server.resources[key]}/{self.server.max_resources[key]}" \
            if key in self.server.resources else ""
        )
        choice = options[menu.show()]
        if choice == "[q] Cancel":
            print("Canceled!")
        else:
            self.server.reset_resource(choice)

    def _switch_choice(self, choice):
        choice_str = self.options[choice]
        # select an action
        if choice < self.optlen - 6:
            self.server.take_action(self.options[choice])
        # performa a skill check
        elif choice_str == "[s] Skill Check":
            skillcheck_menu(self.server.stats)
        # deal or heal damage
        elif choice_str == "[d] Take Damage":
            if self.server.take_damage():
                return 1
        # manage conditions
        elif choice_str == "[m] Manage Conditions":
            conditions_menu(self.server)
        # reset a statblock resource
        elif choice_str == "[r] Reset Resource":
            self.reset_resource()
        # clear the screen
        elif choice_str == "[c] Clear":
            os.system("clear")