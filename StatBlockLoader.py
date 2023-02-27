from simple_term_menu import TerminalMenu
from StatBlock import StatBlock
import json
import yaml
import os


class StatblockLoader():
    def __init__(self, root:str = "stats", file_format:str = "yaml") -> None:
        """
        Initialize the statblock loader
        :param root: (opt: stats) the folder containing the statblock files
        :param file_format: (opt: yaml) the file format, one of `yaml`, `json`
        """
        self.file_format = file_format
        self.load_func = json.load if file_format == "json" else yaml.safe_load
        self.statblock_root = root

        self.statblocks = []
        self.statblock_paths = []

        self.get_statblocks()
        self.load_menu()

    def _add_statblock(self, name: str, num: int=1) -> None:
        """
        Add a single statblock without loading it
        :param name: the name of the statblock
        :param num: (opt: 1) the number of that stablock to load
        """
        if num == 1:
            self.statblocks.append(name)
        else:
            self.statblocks.extend([f"{name}-{i+1}" for i in range(num)])

        path = os.path.join(
            self.statblock_root,
            f"{name}.{self.file_format}"
        )
        self.statblock_paths.extend([path]*num)

    def get_statblocks(self) -> None:
        """Prompt and get statblocks"""
        statblocks_raw = input("stat blocks: ").split(",")

        for token in statblocks_raw:
            if "*" in token:
                split_string = token.split("*")
                num_statblocks = int(split_string[0])
                statblock_name = split_string[1].strip()
                self._add_statblock(statblock_name, num_statblocks)
            else:
                self._add_statblock(token.strip())

    def load_menu(self) -> None:
        """Present menu to load more or continue"""
        options = ["Continue", "Load More"]  # TODO: Add remove option
        choice = -1
        while choice != 0:
            menu = TerminalMenu(options, title=f"Loaded: {self.statblocks}")
            choice = menu.show()
            if choice == 1:
                self.get_statblocks()

    def get_statblock_objects(self) -> dict:
        """Load statblocks into memory"""
        statblock_data = {}
        for i in range(len(self.statblock_paths)):
            try:
                with open(self.statblock_paths[i], "r") as file:
                    statblock_data[self.statblocks[i]] = StatBlock(
                        self.load_func(file))

            except:
                print(f"[!Error] failed to load - {self.statblock_paths[i]}")
        return statblock_data
