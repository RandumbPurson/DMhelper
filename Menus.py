from simple_term_menu import TerminalMenu
from StatBlock import statblock_menu
from CombatManager import CombatManager
import os

def main_menu(combat_mgr: CombatManager) -> None:
    """
    Main menu loop
    """
    initiative_order = "Initiative not rolled"
    options, optlen = combat_mgr.get_options()
    choice = -1
    # Main loop
    while choice != optlen - 1:
        menu = TerminalMenu(options, status_bar=initiative_order)
        choice = menu.show()
        
        # select statblock
        if choice < optlen - 5: 
            retval = statblock_menu(combat_mgr.statblocks[options[choice]])
            
            if retval == 1:
                options, optlen = combat_mgr.remove_statblock(options[choice])

        # Next turn
        elif choice == optlen - 5:  
            initiative_order = combat_mgr.next_turn()

        # Load More Statblocks
        elif choice == optlen - 4:
            combat_mgr.statblocks.update(combat_mgr.loader.load_statblocks())
            options, optlen = combat_mgr.get_options()
        
        # Roll initiative
        elif choice == optlen - 3: 
            initiative_order = combat_mgr.roll_initiative()

        # Clear Screen
        elif choice == optlen - 2:
            os.system("clear")

