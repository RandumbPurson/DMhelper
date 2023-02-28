from simple_term_menu import TerminalMenu
from StatBlock import StatBlock
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
        menu = TerminalMenu(options, title=initiative_order)
        choice = menu.show()
        
        # select statblock
        if choice < optlen - 5: 
            retval = statblock_menu(combat_mgr.statblocks[options[choice]])
            
            if retval == 1:
                options, optlen, initiative_order = combat_mgr.remove_statblock(options[choice])

        # Next turn
        elif choice == optlen - 5:  
            initiative_order = combat_mgr.next_turn()

        # Load More Statblocks
        elif choice == optlen - 4:
            combat_mgr.statblocks.update(combat_mgr.loader.load_menu())
            options, optlen = combat_mgr.get_options()
        
        # Roll initiative
        elif choice == optlen - 3: 
            initiative_order = combat_mgr.roll_initiative()

        # Clear Screen
        elif choice == optlen - 2:
            os.system("clear")

def statblock_menu(statblock: StatBlock) -> int:
    """
    Display Statblock menu
    :param statblock: a statblock to display
    :return: a return code processed by the main menu
    """
    options, optlen = statblock.get_options()
    status_bar = statblock.get_status_bar()
    title = statblock.get_traits()
    menu = TerminalMenu(options, title=title, status_bar=status_bar, preview_command=statblock.preview)
    choice = -1
    while choice != optlen - 1:
        choice = menu.show()

        # select action
        if choice < optlen - 4:
            statblock.take_action(options[choice])

        # skill check
        elif choice == optlen - 4:
            statblock.skill_check(*skillcheck_menu())
            
        # take damage
        elif choice == optlen - 3:
            if statblock.take_damage():
                return 1 
            menu = TerminalMenu(options, title = title, status_bar=statblock.get_status_bar(), preview_command=statblock.preview)
        
        # clear screen
        elif choice == optlen - 2:
            os.system("clear")

    return 0
        

def skillcheck_menu():
    """Helper function to get skillcheck options"""
    options = ["STR", "DEX", "CON", "WIS", "INT", "CHA"]
    skill_choice = options[TerminalMenu(options).show()]
    add_pb = TerminalMenu(["[n] No", "[y] Yes"], title="Add PB?").show()
    return skill_choice, add_pb
