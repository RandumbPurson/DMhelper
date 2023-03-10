from menus.main_menu import MainMenu
from combat_manager.combat_manager import CombatManager
import argparse
import yaml
import os

def read_config(path):
    if os.path.isfile(path):
        with open(path, "r") as file:
            config = yaml.safe_load(file)
        return config
    return {}

def read_args():
    parser = argparse.ArgumentParser()
    parser.add_argument("--config")
    parser.add_argument("--target")
    parser.add_argument("--format", choices=["yaml", "json"])
    parser.add_argument("--num_pcs")
    args = parser.parse_args()
    return vars(args)

defaults = {
    "config": "config.yaml",
    "target": "statblock-examples",
    "format": "yaml",
    "num_pcs": 2,
}

def merge_conf_args(config, args):
    final = {}
    for key in args:
        if args[key] is None:
            if key in config:
                final[key] = config[key]
            else:
                final[key] = defaults[key]
        else:
            final[key] = args[key]
    return final


if __name__ == "__main__":
    args = read_args()
    conf_path = args["config"] if args["config"] is not None else "config.yaml"
    config = read_config(conf_path)
    args = merge_conf_args(config, args)
    
    combat_manager = CombatManager(
        num_pcs=args["num_pcs"], 
        root=args["target"],
        file_format=args["format"]
    )
    menu = MainMenu(combat_manager)
    menu()