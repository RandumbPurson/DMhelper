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

def roll_statblock_initiative(statblocks):
    return [(key, statblock.roll_initiative()) for key, statblock in statblocks.items()]


class CombatManager():
    def __init__(self, num_pcs: int =2, **kwargs) -> None:
        self.num_pcs = num_pcs
        self.loader = StatblockLoader(**kwargs)
        self.statblocks = self.loader.load_menu()

        self.initiative_list = None
        self.initiative_idx = 0

    def _roll_pc_initiative(self):
        initiative_list = []
        for i in range(self.num_pcs):
            initiative_list.append(
                (input("Name: "), int(input("Initiative Score: ")))
            )
            os.system("clear")
        return initiative_list
        
    def roll_initiative(self) -> str:
        """
        Roll initiatives
        :return: The initiative string to be displayed in the menu status bar
        """
        initiative_list = []
        initiative_list.extend(roll_statblock_initiative(self.statblocks))
        initiative_list.extend(self._roll_pc_initiative())
        
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
            "[q] Exit"
        ])
        return options, len(options)
    
    def remove_statblock(self, key: str) -> tuple[list[str], int]:
        """
        Helper function to remove a statblock
        :param key: the key of the statblock to remove
        :return: A tuple of; the updated options list, the length of the option list
        """
        del self.statblocks[key]
        if self.initiative_list is not None:
            self.initiative_list = [elem for elem in self.initiative_list if elem[0] != key]

        return *self.get_options(), format_initiative_list(self.initiative_list, self.initiative_idx)
    
    def add_statblocks(self, statblocks):
        pass
