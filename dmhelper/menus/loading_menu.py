from menus.menu import Menu
from simple_term_menu import TerminalMenu
import os

def get_stored_statblock_options(root, file_format: str, sub_folder: str) -> list[str]:
    """
    Get a list of the paths to statblocks and subfolders stored in the root folder

    :param root: The root folder to get the contents of
    :param file_format: The file format of statblocks, one of: `yaml`, `json`
    :param sub_folder: A string passed from the parent to track the directories already descended
    :return: A list of the statblocks and files in the root folder
    """
    # TODO - order folders and statblocks
    contents = os.listdir(os.path.join(root, sub_folder))
    options = []
    for elem in contents:
        elem = elem.split(".")
        if len(elem) == 2:
            if elem[1] == file_format:
                options.append(elem[0])
        elif len(elem) == 1:
            options.append(f"> {elem[0]}")
    options.append("[q] Cancel")
    return options

def statblock_select_menu(root, file_format: str, sub_folder: str="") -> str:
    """
    Present a menu to select a statblock from the root folder

    :param root: The current folder to select from
    :param file_format: The file format of statblocks, one of: `yaml`, `json`
    :param sub_folder: A string passed from the parent to track the directories already descended, defaults to ""
    :return: The path to a specific statblock
    """
    options = get_stored_statblock_options(
        root, file_format, sub_folder
    )

    menu = TerminalMenu(options)
    choice = options[menu.show()]
    if choice == "[q] Cancel":
        return ""
    elif ">" in choice:
        return statblock_select_menu(
            root,
            file_format,
            sub_folder=os.path.join(sub_folder, choice[2:])
        )
    else:
        try:
            number = int(input(f"number of {choice}s: "))
            string = f"{number}*{os.path.join(sub_folder, choice)}"
        except:
            print(f"[!Error] couldn't read number")
            string = choice
        return string

class LoadingMenu(Menu):

    def _init_hook(self):
        self.statblocks = {}
        self._set_title()

    def _set_options(self):
        self.options = ["[c] Continue", "[n] Load From Name", "[l] List Available"]
    
    def _set_title(self):
        self.title = f"Loaded: {list(self.statblocks.keys())}"

    def _get_exit_code(self):
        return 0
    
    def _pre_loop(self):
        self._init_hook()

    def _post_loop(self):
        return self.statblocks

    def _switch_choice(self, choice):
        if choice == 1:
            self.statblocks.update(self.server.load_statblocks())
        elif choice == 2:
            load_string = statblock_select_menu(
                self.server.statblock_root, self.server.file_format
            )
            self.statblocks.update(
                self.server._process_statblock_token(load_string)
            )
        self._set_title()

