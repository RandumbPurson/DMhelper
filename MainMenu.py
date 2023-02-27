from simple_term_menu import TerminalMenu
from StatBlockLoader import StatblockLoader
from StatBlock import statblock_menu, StatBlock
import os

def get_options(statblocks: StatBlock) -> str:
    """
    Generate an options string from provided statblocks
    :param stablocks: A dict of statblock objects
    :return: The options string to feed to the terminal
    """
    options = list(statblocks.keys())
    options.extend([
        "[n] Next Turn",
        "[l] Load More Statblocks",
        "[i] Roll Initiative",
        "[c] Clear",
        "[e] Exit"
    ])
    return options


class MainMenu():
    def __init__(self, num_pcs: int, **kwargs) -> None:
        """
        Init menu object
        :param num_pcs: The number of player characters in the combat
        :return: None
        """
        self.num_pcs = num_pcs
        self.loader = StatblockLoader(**kwargs)
        self.statblocks = self.loader.load_menu()
        self.display_menu()

    def display_menu(self) -> None:
        """
        Main menu loop
        """
        options = get_options(self.statblocks)
        choice = -1
        optlen = len(options)
        self.initiative_list = None
        self.initiative_idx = 0
        # Main loop
        while choice != optlen - 1:
            initiative_order = format_initiative_list(
                self.initiative_list, self.initiative_idx)
            menu = TerminalMenu(options, title=initiative_order)
            choice = menu.show()

            if choice < optlen - 5:  # select stablock
                retval = statblock_menu(self.statblocks[options[choice]])
                if retval == 1:
                    del self.statblocks[options[choice]]
                    options = get_options(self.statblocks)
                    optlen = len(options)

            elif choice == optlen - 5:  # Next turn
                if self.initiative_list is None:
                    continue
                self.initiative_idx = (
                    self.initiative_idx + 1) % len(self.initiative_list)

            elif choice == optlen - 4:  # Load More Statblocks
                self.statblocks.update(self.loader.load_statblocks())
                options = get_options(self.statblocks)
                optlen = len(options)

            elif choice == optlen - 3:  # Roll initiative
                initiative_list = []
                for key in self.statblocks.keys():  # roll monster initiatives
                    initiative_list.append(
                        (key, self.statblocks[key].roll_initiative())
                    )
                for i in range(self.num_pcs):  # get PC initiatives
                    initiative_list.append(
                        (input("Name: "), int(input("Initiative Score: ")))
                    )
                self.initiative_idx = 0
                self.initiative_list = sorted(
                    initiative_list, key=lambda x: x[1], reverse=True)

            elif choice == optlen - 2:  # Clear
                os.system("clear")


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
