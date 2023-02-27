from simple_term_menu import TerminalMenu
from MainMenu import MainMenu
import argparse

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--target", default="stats")
    parser.add_argument("--format", default="yaml")
    parser.add_argument("--num_pcs", default=2)
    args = parser.parse_args()
    menu = MainMenu(num_pcs = args.num_pcs, root=args.target, file_format=args.format)