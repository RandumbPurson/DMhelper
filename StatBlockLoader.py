from simple_term_menu import TerminalMenu
import json
import os

class StatblockLoader():
    def __init__(self, root="stats"):
        self.statblock_root = root
        self.statblocks = []
        self.statblock_paths = []
        self.get_statblocks()
        self.load_menu()

    def get_statblocks(self):
        statblock_names = input("stat blocks: ").split(",")
        self.statblocks.extend(statblock_names)

        for sb in statblock_names:
            self.statblock_paths.append(os.path.join(self.statblock_root, sb.strip() + ".json"))


    def load_menu(self):
        options = ["Continue", "Load More"] # TODO: Add remove option
        choice = -1
        while choice != 0:
            menu = TerminalMenu(options, title=f"Loaded: {self.statblocks}")
            choice = menu.show()
            if choice == 1:
                self.get_statblocks()

    def get_statblock_data(self):
        statblock_data = {}
        for i in range(len(self.statblock_paths)):
            try:
                with open(self.statblock_paths[i], "r") as file:
                    statblock_data[self.statblocks[i]] = json.load(file)
            except:
                print(f"[!Error] failed to load - {self.statblock_paths[i]}")
        return statblock_data
