from StatBlockLoader import StatblockLoader
import os

def roll_statblock_initiative(statblocks):
    return [(key, statblock.roll_initiative()) for key, statblock in statblocks.items()]

class CombatManager():
    def __init__(self, num_pcs: int =2, **kwargs) -> None:
        self.num_pcs = num_pcs
        self.loader = StatblockLoader(**kwargs)
        self.statblocks = {}

        self.initiative_list = None
        self.initiative_idx = 0

    def _roll_pc_initiative(self):
        initiative_list = []
        for i in range(self.num_pcs):
            initiative_list.append(
                (input("Name: "), int(input("Initiative Score: ")))
            )
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
    
    def next_turn(self) -> str:
        """
        Increment initiative tracker
        :return: The initiative string to be displayed in the menu status bar
        """
        if self.initiative_list is not None:
            self.initiative_idx = (self.initiative_idx + 1) % len(self.initiative_list)
    

    def remove_statblock(self, key: str) -> tuple[list[str], int]:
        """
        Helper function to remove a statblock
        :param key: the key of the statblock to remove
        :return: A tuple of; the updated options list, the length of the option list
        """
        del self.statblocks[key]
        if self.initiative_list is not None:
            self.initiative_list = [elem for elem in self.initiative_list if elem[0] != key]
    
    def add_statblocks(self, statblocks):
        self.statblocks.update(statblocks)
        if self.initiative_list is not None:
            initiative_list = roll_statblock_initiative(statblocks)
            current_turn = self.initiative_list[self.initiative_idx]
            self.initiative_list.extend(initiative_list)

            self.initiative_list.sort(reverse=True, key=lambda x: x[1])
            self.initiative_idx = self.initiative_list.index(current_turn)
