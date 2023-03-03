from simple_term_menu import TerminalMenu
from menus.menu import Menu
from statblock_manager.statblock_components import skill_map
import os



def skillcheck_menu(stats):
    """Helper function to get skillcheck options"""
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
        if choice < self.optlen - 5:
            self.server.take_action(self.options[choice])
        elif choice_str == "[s] Skill Check":
            skillcheck_menu(self.server.stats)
        elif choice_str == "[d] Take Damage":
            if self.server.take_damage():
                return 1
        elif choice_str == "[r] Reset Resource":
            self.reset_resource()
        elif choice_str == "[c] Clear":
            os.system("clear")