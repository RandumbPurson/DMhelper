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

    def get_statblocks(self):
        statblock_names = input("stat blocks: ").split(",")
        self.statblocks.extend(statblock_names)

        for i in range(len(statblock_names)):
            self.statblocks[i] = self.statblocks[i].strip(' ')
            self.statblock_paths.append(
                os.path.join(
                    self.statblock_root, 
                    f"{self.statblocks[i]}.{self.file_format}"
                )
            )

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
