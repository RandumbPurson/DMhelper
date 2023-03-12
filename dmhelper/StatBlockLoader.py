from statblock_manager.statblock import StatBlock
from copy import copy
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

    def _load_statblock(self, path: str) -> StatBlock:
        """
        Load a single statblock into memory
        :param path: path to the stablock
        """
        with open(path, "r") as file:
            return StatBlock(self.load_func(file))
        
    def _get_statblock(self, name: str, num: int=1) -> dict:
        """
        Get key value pairs of names to statblocks
        :param name: the name of the statblock
        :param num: (opt: 1) the number of that statblock to load
        :return: A dictionary of key value pairs; names to statblocks
        """
        name = name.strip()
        path = os.path.join(
            self.statblock_root,
            f"{name}.{self.file_format}"
        )
        name = name.split("/")[-1]

        if num == 1:
            return {name: self._load_statblock(path)}
        else:
            return {f"{name}-{i+1}": self._load_statblock(path) for i in range(num)}

    def _process_statblock_token(self, sb_string: str) -> dict:
        """
        Process a single statblock token

        :param sb_string: the statblock token
        :return: the dict of key-value pairs for the associated statblock token
        """
        try:
            if "*" in sb_string:
                split_string = sb_string.split("*")
                num_statblocks = int(split_string[0])
                name = split_string[1]
                return self._get_statblock(name, num_statblocks)
            else:
                return self._get_statblock(sb_string)
        except:
            print(f"[!Error] Failed to load {sb_string}")
            return {}

    def load_statblocks(self) -> dict:
        """
        Prompt and get statblocks dict
        :return: A dict of names to statblocks based on input
        """
        statblocks_raw = input("stat blocks: ").split(",")
        statblocks = {}
        for token in statblocks_raw:      
            try:      
                statblocks.update(self._process_statblock_token(token))
            except:
                print(f"[!Error] Failed to load `{token}`")

        return statblocks
    
    