from simple_term_menu import TerminalMenu
from MainMenu import MainMenu
import argparse

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--target", default="stats")
    parser.add_argument("--format", default="yaml")
    args = parser.parse_args()
    menu = MainMenu(root=args.target, file_format=args.format)