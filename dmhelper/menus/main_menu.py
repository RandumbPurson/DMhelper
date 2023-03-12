from simple_term_menu import TerminalMenu
from menus.menu import Menu
from menus.statblock_menu import StatblockMenu
from menus.loading_menu import LoadingMenu
import os

def format_initiative_list(initiative_list: list[tuple], idx: int) -> str:
    """
    Formats an ordered initiative list and the current initiative index into a string
    :param initiative_list: An ordered list of initiatives with tuples of (name, initiative)
    :param idx: The index of the current turn
    :return: A string representation of the initiative
    """
    if initiative_list is None:
        return "Initiative not rolled"

    formatted = [name[0] for name in initiative_list]
    formatted[idx] = str(initiative_list[idx])
    return " - ".join(formatted)

class MainMenu(Menu):

    def _init_hook(self):
        self.title = "Initiative not rolled"
        self.loading_menu = LoadingMenu(self.server.loader)
        self.server.add_statblocks(self.loading_menu())

    def _set_options(self):
        options = list(self.server.statblocks.keys())
        options.extend([
            "[n] Next Turn",
            "[l] Load More Statblocks",
            "[i] Roll Initiative",
            "[c] Clear",
            "[q] Exit"
        ])
        self.options, self.optlen = options, len(options)

    def _set_title(self):
        self.title = format_initiative_list(
            self.server.initiative_list, 
            self.server.initiative_idx
        )
    
    def _switch_choice(self, choice):
        if choice < self.optlen - 5: 
            statblock_menu = StatblockMenu(
                self.server.statblocks[self.options[choice]]
            )
            retval = statblock_menu()
            if retval == 1:
                self.server.remove_statblock(self.options[choice])
                self._set_options()
                self._set_title()
            #os.system("clear")

        # Next turn
        elif choice == self.optlen - 5:  
            self.server.next_turn()
            self._set_title()

        # Load More Statblocks
        elif choice == self.optlen - 4:
            self.server.add_statblocks(
                self.loading_menu()
            )
            self._set_options()
            self._set_title()
        
        # Roll initiative
        elif choice == self.optlen - 3: 
            self.server.roll_initiative()
            self._set_title()

        # Clear Screen
        elif choice == self.optlen - 2:
            os.system("clear")

