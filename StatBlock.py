from simple_term_menu import TerminalMenu
from Roller import roll, roll_string
import os
import re


class StatBlock:
    def __init__(self, statblock_data: dict) -> None:
        """
        Initialize a statblock
        :param statblock_data: a dictionary with data about the monster
        :return: None
        """
        self.maxHP = statblock_data["maxHP"]
        self.ac = statblock_data["AC"]
        self.pb = statblock_data["PB"]
        self.speed = statblock_data["speed"]
        self.stats = statblock_data["stats"]
        self.statmods = {
            stat: (self.stats[stat] - 10) // 2 for stat in self.stats.keys()}
        self.load_optional(statblock_data)

        self.hp = self.maxHP
        self.initiative = 0

    def load_optional(self, statblock_data):
        """Helper function to load optional properties"""
        self.has_actions = False
        self.has_attacks = False
        if "actions" in statblock_data.keys():
            self.actions = statblock_data["actions"]
            self.has_actions = True

        if "attacks" in statblock_data.keys():
            self.attacks = statblock_data["attacks"]
            self.has_attacks = True

    def roll_initiative(self) -> int:
        """Roll initiative for this monster"""
        self.initiative = roll(1, 20, self.statmods["DEX"])
        return self.initiative

    def take_action(self, choice: str) -> str:
        """
        Process taking a specified action
        :param choice: A string representing the chosen action
        :return: the text to display as output
        """
        if self.has_actions and choice in self.actions.keys():
            return self.actions[choice]["text"]
        if self.has_attacks and choice in self.attacks.keys():
            to_hit, damage, dtype = self.make_attack(self.attacks[choice])
            return f"{to_hit} atk roll, {damage} {dtype} dmg"

    def replace_stats(self, string: str, remove_ws:bool=True) -> str:
        """
        Helper function to interpolate stats into dice strings
        :param string: A string which contains a stat token eg; `DEX`
        :param remove_ws: (opt: False) boolean whether to remove whitespace from string
        :return: The string with the stat tokens replaced with their values
        """
        if remove_ws:
            string = string.replace(" ", "")
        for key in self.statmods.keys():
            string = string.replace(key, str(self.statmods[key]))
        string = string.replace("PB", str(self.pb))
        return string

    def make_attack(self, attack: dict) -> tuple[int, int, str]:
        """
        Make an attack specified in the statblock
        :param attack: The dict object specifying the components of the attack
        :return: A tuple consisting of: attack roll, damage roll, damage type
        """
        dmg_string = attack["damage"].split(",")
        dtype = dmg_string[1].strip()

        dstring = self.replace_stats(dmg_string[0])

        hit_string = "1d20+"+self.replace_stats(attack["to-hit"])

        return roll_string(hit_string), roll_string(dstring), dtype

    def preview(self, key: str) -> str:
        """
        Generate a preview string for a selected option
        :param key: the key of the selected option
        :return: the preview string for the selected option
        """
        prev_string = ""
        if self.has_actions and key in self.actions.keys():
            prev_string = self.actions[key]["text"]
        elif self.has_attacks and key in self.attacks.keys():
            choice = self.attacks[key]
            prev_string = f"{key}: {choice['type']} +{roll_string(self.replace_stats(choice['to-hit']))} to hit, {choice['range']}, {choice['damage']}"
            prev_string = self.replace_stats(prev_string, remove_ws=False)
        return prev_string


def statblock_menu(statblock: StatBlock) -> int:
    """
    Display Statblock menu
    :param statblock: a statblock to display
    :return: a return code processed by the main menu
    """
    choice = -1
    optlen = 1
    while choice != optlen - 1:
        choice, optlen = show_statblock(statblock)
        if not type(choice) is int:
            print(statblock.take_action(choice))
        elif choice == optlen - 3:
            key, add_pb = skillcheck_menu()
            dstring = f"1d20+{statblock.statmods[key]}+{str(statblock.pb)}" if add_pb else f"1d20+{statblock.statmods[key]}"
            print(f"{key}: {roll_string(dstring)}")
        elif choice == optlen - 2:
            statblock.hp -= int(input("Damage: "))
            if statblock.hp <= 0:
                return 1
    return 0
        

def skillcheck_menu():
    """Helper function to get skillcheck options"""
    options = ["STR", "DEX", "CON", "WIS", "INT", "CHA"]
    skill_choice = options[TerminalMenu(options).show()]
    add_pb = TerminalMenu(["No", "Yes"], title="Add PB?").show()
    return skill_choice, add_pb


def show_statblock(statblock: StatBlock) -> tuple[int, int]:
    """
    Generate the menu for a single statblock
    :param statblock: A statblock to generate the menu for
    :return: A tuple of the: menu choice, length of the options
    """
    status_bar = \
        f"|AC: {statblock.ac} | \
HP: {statblock.hp}/{statblock.maxHP} | \
spd: {str(statblock.speed)}|"
    options = []
    if statblock.has_actions:
        options.extend(statblock.actions.keys())
    if statblock.has_attacks:
        options.extend(statblock.attacks.keys())
    options.extend([
        "[s] Skill Check",
        "[d] Take Damage",
        "[e] Exit"
    ])
    menu = TerminalMenu(options, status_bar=status_bar,
                        preview_command=statblock.preview)
    choice = menu.show()
    if choice < len(options) - 3:
        choice = options[choice]
    return choice, len(options)
