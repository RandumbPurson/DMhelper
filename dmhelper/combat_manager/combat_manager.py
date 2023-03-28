from StatBlockLoader import StatblockLoader
import os

def roll_statblock_initiative(statblocks: dict) -> list[tuple[str, int]]:
    """
    Roll initiative for each statblock in dict

    :param statblocks: The statblocks to roll initiative for
    :return: list of tuples for each statblock: (name, initiative)
    """
    # Work with statblock
    sb_initiatives = []
    for sb_list in statblocks.values():
        for statblock in sb_list["statblocks"]:
            sb_initiatives.append((statblock.name, statblock.roll_initiative()))
    return sb_initiatives

class CombatManager():
    def __init__(self, **kwargs) -> None:
        self.loader = StatblockLoader(**kwargs)
        self.statblocks = {}

        self.initiative_list = None
        self.initiative_idx = 0

    def _roll_pc_initiative(self) -> list[tuple[str, int]]:
        """
        Get initiatives for PCs

        :return: list of tuples for each pc: (name, initiative)
        """
        initiative_list = []
        for i in range(self.num_pcs):
            initiative_list.append(
                (input("Name: "), int(input("Initiative Score: ")))
            )
        return initiative_list
        
    def roll_initiative(self) -> None:
        """
        Roll initiatives and set initiative index and list

        :return: None
        """
        initiative_list = []
        self.num_pcs = int(input("Number of PCs: "))
        initiative_list.extend(roll_statblock_initiative(self.statblocks))
        initiative_list.extend(self._roll_pc_initiative())
        
        self.initiative_idx = 0
        self.initiative_list = sorted(initiative_list, key=lambda x: x[1], reverse=True)
    
    def next_turn(self) -> None:
        """
        Increment initiative tracker

        :return: None
        """
        if self.initiative_list is not None:
            self.initiative_idx = (self.initiative_idx + 1) % len(self.initiative_list)

    def remove_statblock(self, name: str, idx) -> None:
        """
        Helper function to remove a statblock
        :param name: the name of the statblock to remove
        :param idx: the index of the statblock to remove
        :return: None
        """
        try:
            sb_name = self.statblocks[name]["statblocks"][idx].name
            del self.statblocks[name]["statblocks"][idx]
            del self.statblocks[name]["IDs"][idx]
            if self.initiative_list is not None:
                self.initiative_list = [elem for elem in self.initiative_list if elem[0] != sb_name]
        except KeyError:
            print("[!Error] could not remove statblock")
        
    def _next_id(self, name: str) -> int:
        """
        Get the next ID for a specific statblock. Should only be called
        if the name is guaranteed to be in `self.statblocks`

        :param name: The name of the statblock
        :return: The next ID for that statblock name
        """
        id_set = set(self.statblocks[name]["IDs"])
        range_set = set(range(0, len(id_set) + 1))
        return min(range_set - id_set)
    
    def _add_statblock(self, name: str, sb_list: list) -> list[int]:
        """
        Add a single list of duplicate statblocks

        :param name: The name of the statblocks
        :param sb_list: The list of statblocks
        :return: The indices where the new statblocks were inserted
        """
        if name not in self.statblocks:
            self.statblocks[name] = {"statblocks": [], "IDs": []}

        index_range = [len(self.statblocks), len(self.statblocks)]
        for new_sb in sb_list:
            new_id = self._next_id(name)
            new_sb.id = new_id
            new_sb.name = f"{name}+{new_id}"

            self.statblocks[name]["statblocks"].append(new_sb)
            self.statblocks[name]["IDs"].append(new_id)
            index_range[1] += 1

        return index_range


    def add_statblocks(self, statblocks: dict) -> None:
        """
        Add a dict of statblocks to the manager

        :param statblocks: a dict of statblocks with key as the name and 
            value as the statblock object
        """
        index_ranges = {}
        for name, sb_list in statblocks.items():
            index_ranges[name] = self._add_statblock(name, sb_list)

        if self.initiative_list is not None:
            new_initiatives = {}
            for key, irange in index_ranges.items():
                new_initiatives[key] = {
                    "statblocks": self.statblocks[key]["statblocks"][irange[0]:irange[1]],
                    "IDs": self.statblocks[key]["IDs"][irange[0]:irange[1]]
                }
            initiative_list = roll_statblock_initiative(new_initiatives)
            current_turn = self.initiative_list[self.initiative_idx]
            self.initiative_list.extend(initiative_list)

            self.initiative_list.sort(reverse=True, key=lambda x: x[1])
            self.initiative_idx = self.initiative_list.index(current_turn)
