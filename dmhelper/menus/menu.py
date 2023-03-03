from simple_term_menu import TerminalMenu

class Menu:
    def __init__(self, server):
        self.server = server
        self.options = None
        self.optlen = None
        self.title = None
        self.status_bar = None

        self._init_hook()
        
        self._set_options()

    def __call__(self):
        return self.main_loop()

    def _init_hook(self):
        pass

    def _set_options(self):
        pass
    def _set_title(self):
        pass
    def _set_status_bar(self):
        pass
    def _preview_command(self, key):
        pass

    def _update_menu(self):
        return TerminalMenu(
            self.options, 
            title=self.title,
            status_bar=self.status_bar,
            preview_command=self._preview_command
        )
    
    def _switch_choice(self, choice):
        pass
    def _get_exit_code(self):
        return self.optlen - 1

    def _pre_loop(self):
        pass
    def _post_loop(self):
        return None

    def main_loop(self):
        choice = -1

        self._pre_loop()

        # Exit should always be the last option
        while choice != self._get_exit_code():
            menu = self._update_menu()
            choice = menu.show()
            retval = self._switch_choice(choice)
            if retval is not None:
                return retval
        return self._post_loop()