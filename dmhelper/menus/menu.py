from simple_term_menu import TerminalMenu

class Menu:
    """
    Menu object used by other Menus. To implement, override the various hooks
    """
    def __init__(self, server: any):
        """
        Init menu

        :param server: The object to get various properties from
        """
        self.server = server
        self.options = None
        self.optlen = None
        self.title = None
        self.status_bar = None

        self._init_hook()
        
        self._set_options()

    def __call__(self):
        """Calls the main loop"""
        return self.main_loop()

    def _init_hook(self):
        """Runs at menu initiatlization, after setup, before setting options"""
        pass

    def _set_options(self):
        """Set the menu options"""
        pass
    def _set_title(self):
        """Set the menu title"""
        pass
    def _set_status_bar(self):
        """Set the menu status bar"""
        pass
    def _preview_command(self, key: str) -> str:
        """
        The command to generate a preview string for each option

        :param key: The option string currently highlighted
        :return: A string to display as the preview
        """
        pass

    def _update_menu(self):
        """
        Creates a new terminal menu using the Menu object's properties

        :return: A menu object with the current properties
        """
        return TerminalMenu(
            self.options, 
            title=self.title,
            status_bar=self.status_bar,
            preview_command=self._preview_command
        )
    
    def _switch_choice(self, choice: int) -> any:
        """
        A hook which is called each main loop

        :param choice: An int corresponding to the menu option selected
        :return: An optional return value, if returned, exits the main loop
        """
        pass
    def _get_exit_code(self, choice = None):
        """
        Allows you to override the default exit code, should be an integer
        between 0 and len(options) - 1

        :return: The exit code
        """
        return self.optlen - 1

    def _pre_loop(self):
        """A hook called before the main loop"""
        pass
    def _post_loop(self) -> any:
        """
        A hook called after the main loop
        
        :return: A value to be returned when the menu exits the main loop
        """
        return None

    def main_loop(self):
        """
        The main loop of the menu

        :return: Either a return value or None
        """
        choice = None

        self._pre_loop()

        retval = None
        while choice != self._get_exit_code(choice):
            menu = self._update_menu()
            choice = menu.show()
            retval = self._switch_choice(choice)
            if retval is not None:
                return retval
        return self._post_loop()