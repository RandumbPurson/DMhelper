from StatBlockLoader import StatblockLoader
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

class CombatManager():
    def __init__(self, num_pcs: int =2, **kwargs) -> None:
        self.num_pcs = num_pcs
        self.loader = StatblockLoader(**kwargs)
        self.statblocks = self.loader.load_menu()

        self.initiative_list = None
        self.initiative_idx = 0

    def roll_initiative(self) -> str:
        """
        Roll initiatives
        :return: The initiative string to be displayed in the menu status bar
        """
        initiative_list = []
        for key in self.statblocks.keys():  # roll monster initiatives
            initiative_list.append(
                (key, self.statblocks[key].roll_initiative())
            )
        for i in range(self.num_pcs):  # get PC initiatives
            initiative_list.append(
                (input("Name: "), int(input("Initiative Score: ")))
            )
            os.system("clear")
        self.initiative_idx = 0
        self.initiative_list = sorted(initiative_list, key=lambda x: x[1], reverse=True)
        return format_initiative_list(self.initiative_list, self.initiative_idx)
    
    def next_turn(self) -> str:
        """
        Increment initiative tracker
        :return: The initiative string to be displayed in the menu status bar
        """
        if self.initiative_list is not None:
            self.initiative_idx = (self.initiative_idx + 1) % len(self.initiative_list)
        return format_initiative_list(self.initiative_list, self.initiative_idx)
    
    def get_options(self) -> list[str]:
        """
        Generate an options list from provided statblocks
        :param stablocks: A dict of statblock objects
        :return: The options list to feed to the menu
        """
        options = list(self.statblocks.keys())
        options.extend([
            "[n] Next Turn",
            "[l] Load More Statblocks",
            "[i] Roll Initiative",
            "[c] Clear",
            "[e] Exit"
        ])
        return options, len(options)
    
    def remove_statblock(self, key: str) -> tuple[list[str], int]:
        """
        Helper function to remove a statblock
        :param key: the key of the statblock to remove
        :return: A tuple of; the updated options list, the length of the option list
        """
        del self.statblocks[key]
        return self.get_options()