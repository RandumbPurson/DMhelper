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
        self._preview_command = self.server.preview

    def _set_options(self):
        self.options, self.optlen = self.server.get_options()
    
    def _set_status_bar(self):
        self.status_bar = self.server.get_status_bar()
    
    def _post_loop(self):
        return 0
    
    def _update_menu(self):
        self._set_options()
        self._set_status_bar()
        return super()._update_menu()

    def _switch_choice(self, choice):
        if choice < self.optlen - 5:
            self.server.take_action(self.options[choice])
        elif choice == self.optlen - 5:
            skillcheck_menu(self.server.stats)
        elif choice == self.optlen - 4:
            if self.server.take_damage():
                return 1
        elif choice == self.optlen - 3:
            self.server.reset_resource()
        elif choice == self.optlen - 2:
            os.system("clear")