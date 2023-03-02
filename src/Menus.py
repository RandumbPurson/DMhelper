from simple_term_menu import TerminalMenu
import os

def main_menu(combat_mgr) -> None:
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
            os.system("clear")

        # Next turn
        elif choice == optlen - 5:  
            initiative_order = combat_mgr.next_turn()

        # Load More Statblocks
        elif choice == optlen - 4:
            initiative_order = combat_mgr.add_statblocks(combat_mgr.loader.load_menu())
            options, optlen = combat_mgr.get_options()
        
        # Roll initiative
        elif choice == optlen - 3: 
            initiative_order = combat_mgr.roll_initiative()

        # Clear Screen
        elif choice == optlen - 2:
            os.system("clear")

def update_menu(statblock):
    options, optlen = statblock.get_options()
    status_bar = statblock.get_status_bar()
    title = "\u250f" + "\u2501"*10
    return TerminalMenu(options, title=title, status_bar=status_bar, preview_command=statblock.preview)

def statblock_menu(statblock) -> int:
    """
    Display Statblock menu
    :param statblock: a statblock to display
    :return: a return code processed by the main menu
    """
    options, optlen = statblock.get_options()
    status_bar = statblock.get_status_bar()
    title = "\u250f" + "\u2501"*10
    menu = TerminalMenu(options, title=title, status_bar=status_bar, preview_command=statblock.preview)
    choice = -1
    while choice != optlen - 1:
        choice = menu.show()

        # select action
        if choice < optlen - 5:
            statblock.take_action(options[choice])
            menu = update_menu(statblock)


        # skill check
        elif choice == optlen - 5:
            statblock.skill_check(*skillcheck_menu())
            
        # take damage
        elif choice == optlen - 4:
            if statblock.take_damage():
                return 1 
            menu = update_menu(statblock)
        
        elif choice == optlen - 3:
            statblock.reset_resource()
            menu = update_menu(statblock)

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

def load_menu(statloader) -> dict:
        """
        Present menu to load more statblocks or continue
        """
        statblocks = {} #self.load_statblocks()
        options = ["[c] Continue", "[n] Load From Name", "[l] List Available"]  # TODO: Add remove option
        choice = -1
        while choice != 0:
            menu = TerminalMenu(options, title=f"Loaded: {list(statblocks.keys())}")
            choice = menu.show()
            if choice == 1:
                statblocks.update(statloader.load_statblocks())
            if choice == 2:
                load_string = statblock_select_menu(statloader.statblock_root, statloader.file_format)
                statblocks.update(statloader._process_statblock_token(load_string))
        
        return statblocks


def statblock_select_menu(root, file_format, sub_folder=""):
    contents = os.listdir(os.path.join(root, sub_folder))
    options = []
    for elem in contents:
        elem = elem.split(".")
        if len(elem) == 2:
            if elem[1] == file_format:
                options.append(elem[0])
        elif len(elem) == 1:
            options.append(f"> {elem[0]}")
    options.append("[q] Cancel")

    menu = TerminalMenu(options)
    choice = options[menu.show()]
    if choice == "[q] Cancel":
        return ""
    elif ">" in choice:
        return statblock_select_menu(
            root,
            file_format,
            sub_folder=os.path.join(sub_folder, choice[2:])
        )
    else:
        try:
            number = int(input(f"number of {choice}s: "))
            string = f"{number}*{os.path.join(sub_folder, choice)}"
        except:
            print(f"[!Error] couldn't read number")
            string = choice
        return string