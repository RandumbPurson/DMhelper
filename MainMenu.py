from simple_term_menu import TerminalMenu
from StatBlockLoader import StatblockLoader
import os

def get_options(statblock_data):
	options = list(statblock_data.keys())
	options.extend([
		"[l] Load More Statblocks",
		"[i] Roll Initiative",
		"[c] Clear",
		"[e] Exit"
	])
	return options


class MainMenu():
	def __init__(self) -> None:
		self.loader = StatblockLoader()
		self.statblock_data = self.loader.get_statblock_data()
		self.display_menu()

	def display_menu(self):
		options = get_options(self.statblock_data)
		choice = -1
		info = None
		while choice != len(options) - 1:
			menu = TerminalMenu(options, title=info)
			choice = menu.show()

			if choice == len(options) - 2:
				os.system("clear")

			elif choice == len(options) - 4:
				self.loader.get_statblocks()
				self.statblock_data = self.loader.get_statblock_data()
				options = get_options(self.statblock_data)

			elif choice < len(options) - 4:
				info = str(self.statblock_data[options[choice]])


    