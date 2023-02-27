from simple_term_menu import TerminalMenu
from StatBlock import StatBlock
import json
import yaml
import os

class StatblockLoader():
    def __init__(self, root="stats", file_format="yaml"):
        self.file_format = file_format
        self.load_func = json.load if file_format == "json" else yaml.safe_load
        self.statblock_root = root

        self.statblocks = []
        self.statblock_paths = []

        self.get_statblocks()
        self.load_menu()

    def _add_statblock(self, name, num=1):
        if num == 1:
            self.statblocks.append(name)
        else:
            self.statblocks.extend([f"{name}-{i+1}" for i in range(num)])

        path = os.path.join(
            self.statblock_root,
            f"{name}.{self.file_format}"
        )
        self.statblock_paths.extend([path]*num)


    def get_statblocks(self):
        statblocks_raw = input("stat blocks: ").split(",")

        for token in statblocks_raw:
            if "*" in token:
                split_string = token.split("*")
                num_statblocks = int(split_string[0])
                statblock_name = split_string[1].strip()
                self._add_statblock(statblock_name, num_statblocks)
            else:
                self._add_statblock(token.strip())


                


    def load_menu(self):
        options = ["Continue", "Load More"] # TODO: Add remove option
        choice = -1
        while choice != 0:
            menu = TerminalMenu(options, title=f"Loaded: {self.statblocks}")
            choice = menu.show()
            if choice == 1:
                self.get_statblocks()

    def get_statblock_objects(self):
        statblock_data = {}
        for i in range(len(self.statblock_paths)):
            try:
                with open(self.statblock_paths[i], "r") as file:
                    statblock_data[self.statblocks[i]] = StatBlock(self.load_func(file))

            except:
                print(f"[!Error] failed to load - {self.statblock_paths[i]}")
        return statblock_data
