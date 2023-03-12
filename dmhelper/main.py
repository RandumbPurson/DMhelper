from menus.main_menu import MainMenu
from combat_manager.combat_manager import CombatManager
import argparse
import yaml
import os

def read_config(path:str) -> dict:
    """Read config from a file"""
    if os.path.isfile(path):
        with open(path, "r") as file:
            config = yaml.safe_load(file)
        return config
    return {}

def read_args() -> dict:
    """Read options from command line"""
    parser = argparse.ArgumentParser()
    parser.add_argument("--config")
    parser.add_argument("--target")
    parser.add_argument("--format", choices=["yaml", "json"])
    args = parser.parse_args()
    return vars(args)

defaults = {
    "config": "config.yaml",
    "target": "statblock-examples",
    "format": "yaml"
}

def merge_conf_args(config:dict, args:dict) -> dict:
    """Merge config from file, commandline, and defaults"""
    final = defaults
    final.update(config)
    for arg in args:
        if args[arg] is not None:
            final[arg] = args[arg]
    return final


if __name__ == "__main__":
    args = read_args()
    conf_path = args["config"] if args["config"] is not None else "config.yaml"
    config = read_config(conf_path)
    args = merge_conf_args(config, args)
    
    combat_manager = CombatManager(
        root=args["target"],
        file_format=args["format"]
    )
    menu = MainMenu(combat_manager)
    menu()
