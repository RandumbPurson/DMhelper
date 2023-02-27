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
        self.has_traits = False
        if "actions" in statblock_data.keys():
            self.actions = statblock_data["actions"]
            self.has_actions = True

        if "attacks" in statblock_data.keys():
            self.attacks = statblock_data["attacks"]
            self.has_attacks = True

        if "traits" in statblock_data.keys():
            self.traits = statblock_data["traits"]
            self.has_traits = True

    def _in_actions(self, key: str) -> bool:
        return self.has_actions and key in self.actions.keys()
    def _in_attacks(self, key: str) -> bool:
        return self.has_attacks and key in self.attacks.keys()

    def roll_initiative(self) -> int:
        """Roll initiative for this monster"""
        self.initiative = roll(1, 20, self.statmods["DEX"])
        return self.initiative

    def take_action(self, choice: str) -> None:
        """
        Process taking a specified action
        :param choice: A string representing the chosen action
        :return: the text to display as output
        """
        if self._in_actions(choice):
            retstring =  self.actions[choice]["text"]
        elif self._in_attacks(choice):
            to_hit, damage, dtype = self.make_attack(self.attacks[choice])
            retstring =  f"{to_hit} atk roll, {damage} {dtype} dmg"
        
        print(retstring)

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
    
    def get_options(self) -> tuple[list, int]:
        options = []
        if self.has_actions:
            options.extend(self.actions.keys())
        if self.has_attacks:
            options.extend(self.attacks.keys())
        options.extend([
            "[s] Skill Check",
            "[d] Take Damage",
            "[e] Exit"
        ])

        return options, len(options)
    
    def get_status_bar(self) -> str:
        return f"|AC: {self.ac} | HP: {self.hp}/{self.maxHP} | spd: {str(self.speed)}|"
    
    def get_traits(self) -> str:
        if not self.has_traits:
            return "No Traits!"
        return "\n".join([f"|> {key}: {self.traits[key]}" for key in self.traits])

    def show_statblock(self) -> tuple[int, int]:
        """
        Generate the menu for a single statblock
        :param statblock: A statblock to generate the menu for
        :return: A tuple of the: menu choice, length of the options
        """
        options, optlen = self._get_options()
        
        return options, optlen
    
    def skill_check(self, key:str, add_pb:bool = False) -> None:
        dstring = f"1d20+{self.statmods[key]}+{str(self.pb)}" if add_pb else f"1d20+{self.statmods[key]}"
        print(f"{key}: {roll_string(dstring)}")

    def take_damage(self) -> bool:
        try:
            self.hp -= int(input("Damage: "))
        except:
            print("[!Error] could not deal damage")
        if self.hp <= 0:
            return True
        return False





