from Menus import main_menu
from CombatManager import CombatManager
import argparse
import os

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--config", default=None)
    parser.add_argument("--target", default="statblock-examples")
    parser.add_argument("--format", default="yaml")
    parser.add_argument("--num_pcs", default=2)
    args = parser.parse_args()
    
    combat_manager = CombatManager(num_pcs=args.num_pcs, root=args.target,
                    file_format=args.format)
    menu = main_menu(combat_manager)