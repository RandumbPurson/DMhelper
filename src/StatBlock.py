from simple_term_menu import TerminalMenu
import Roller
import os
import re

class Stats:
    def __init__(self, data):
        self.stats = data["stats"]
        self.statmods = {
            stat: (self.stats[stat] - 10) // 2 \
                for stat in self.stats.keys()
        }

        self.pb = data["PB"]

    def replace_stats(
            self,
            string:str,
            remove_ws:bool=True
        ) -> str:
        """
        Helper function to interpolate stats into dice strings
        :param string: A string which contains a stat token eg; `DEX`
        :param remove_ws: (opt: False) boolean whether to remove whitespace from string
        :return: The string with the stat tokens replaced with their values
        """
        if remove_ws:
            string = string.replace(" ", "")
        for key in self.statmods:
            string = string.replace(key, str(self.statmods[key]))
        string = string.replace("PB", str(self.pb))

        return string
    
    def skill_check(self, key:str, add_pb:bool = False) -> None:
        dstring = f"1d20+{self.statmods[key]}+{str(self.pb)}" \
            if add_pb else f"1d20+{self.statmods[key]}"
        print(f"{key}: {Roller.roll_string(dstring)}")

class Action:
    def __init__(self, data, stats):
        self.text = data["text"]
        if "rolls" in data:
            self.rolls = {}
            for key, roll in data["rolls"].items():
                critable = "*" in roll
                rstring = stats.replace_stats(roll).remove("*") if critable else stats.replace_stats(roll)
                self.rolls[key] = (rstring, critable)
        else:
            self.rolls = None

        self.uses = data["uses"] if "uses" in data else None

    def __call__(self):
        if self.rolls is not None:
            roll_list = []
            for key, rstring in self.rolls.items():
                rstring, critable = rstring
                roll_val = Roller.roll_string(rstring, critable=critable)

                if critable:
                    retstring = f"{key}: {roll_val[0]}"
                    if roll_val[1]:
                        retstring = retstring + ", crit!"
                else:
                    retstring = f"{key}: {roll_val}"

                roll_list.append(retstring)
                
            return " - ".join(roll_list)
        else:
            return  self.text
    
    def preview(self):
        return self.text

class Attack:
    def __init__(self, data, stats) -> None:
        self.hit_bonus = stats.replace_stats(data["to-hit"])
        self.hit_string = "1d20+"+self.hit_bonus
        raw_dstring = data["damage"].split(",")
        self.dmg_string = stats.replace_stats(raw_dstring[0])
        self.dmg_type = raw_dstring[1].strip()

        self.type = data["type"]
        self.range = data["range"]
    
    def __call__(self):
        to_hit, crit = Roller.roll_string(self.hit_string, critable=True)
        damage = Roller.roll_string(self.dmg_string)
        retstring = f"{to_hit} to hit, {damage} {self.dmg_type} dmg"
        if crit:
            retstring = retstring + ", crit!"
        return retstring

    def preview(self):
        return f"{self.type} {self.range}, +{Roller.roll_string(self.hit_bonus)} to hit, {self.dmg_string}"

class Multiattack():
    def __init__(self, data, attacks):
        self.attack_options = {}
        for elem in data:
            num_attacks, attack = elem.split("*")
            self.attack_options[attack] = (int(num_attacks), attacks[attack])
    
    def __call__(self):
        menu = TerminalMenu(self.attack_options.keys())
        choice = self.attack_options[list(self.attack_options.keys())[menu.show()]]
        return "\n".join([choice[1]() for _ in range(choice[0])])
    
    def preview(self):
        return "Make "+ " attacks or ".join([f"{val[0]} {key}" for key, val in self.attack_options.items()]) +" attacks"


class StatBlock:
    def __init__(self, statblock_data: dict) -> None:
        """
        Initialize a statblock
        :param statblock_data: a dictionary with data about the monster
        :return: None
        """
        self.maxHP = statblock_data["maxHP"]
        self.ac = statblock_data["AC"]
        self.speed = statblock_data["speed"]

        self.stats = Stats(statblock_data)
        self.skill_check = self.stats.skill_check
        
        self.load_optional(statblock_data)

        self.hp = self.maxHP
        self.initiative = 0

    def load_optional(self, statblock_data):
        """Helper function to load optional properties"""
        self.has_actions = False
        self.has_attacks = False
        self.has_traits = False
        self.has_multiattack = False

        if "attacks" in statblock_data.keys():
            self.attacks = {
                key: Attack(data, self.stats) for key, data in statblock_data["attacks"].items()
            }
            self.has_attacks = True

        if "actions" in statblock_data.keys():
            self.actions = {}
            for key, data in statblock_data["actions"].items():
                if key == "multiattack":
                    self.multiattack = Multiattack(data, self.attacks)
                    self.has_multiattack = True
                else:
                    self.actions[key] = Action(data, self.stats)
                    self.has_actions = True

        if "traits" in statblock_data.keys():
            self.traits = statblock_data["traits"]
            self.has_traits = True

    def _in_actions(self, key: str) -> bool:
        return self.has_actions and key in self.actions.keys()
    def _in_attacks(self, key: str) -> bool:
        return self.has_attacks and key in self.attacks.keys()

    def roll_initiative(self) -> int:
        """Roll initiative for this monster"""
        self.initiative = Roller.roll(1, 20, self.stats.statmods["DEX"])
        return self.initiative

    def take_action(self, choice: str) -> None:
        """
        Process taking a specified action
        :param choice: A string representing the chosen action
        :return: the text to display as output
        """
        if choice == "multiattack" and self.has_multiattack:
            retstring = self.multiattack()
        elif self._in_actions(choice):
            retstring = self.actions[choice]()
        elif self._in_attacks(choice):
            retstring = self.attacks[choice]()
        sep = "\u250c"+"\u2500"*10+"\n"
        print(sep + retstring)

    def preview(self, key: str) -> str:
        """
        Generate a preview string for a selected option
        :param key: the key of the selected option
        :return: the preview string for the selected option
        """
        if key == "multiattack" and self.has_multiattack:
            return self.multiattack.preview()
        elif self._in_actions(key):
            return self.actions[key].preview()
        elif self._in_attacks(key):
            return self.attacks[key].preview()
    
    def get_options(self) -> tuple[list, int]:
        options = []
        if self.has_actions:
            options.extend(self.actions.keys())
        if self.has_multiattack:
            options.append("multiattack")
        if self.has_attacks:
            options.extend(self.attacks.keys())
        options.extend([
            "[s] Skill Check",
            "[d] Take Damage",
            "[c] Clear",
            "[q] Exit"
        ])

        return options, len(options)
    
    def get_status_bar(self) -> str:
        return f"|AC: {self.ac} | HP: {self.hp}/{self.maxHP} | spd: {str(self.speed)}|"
    
    def get_traits(self) -> str:
        if not self.has_traits:
            return "No Traits!"
        boxtop = "\u250c"+"\u2500"*10+"\n"
        boxbot = "\n\u2514"+"\u2500"*10
        return boxtop + "\n".join([f"\u2502> {key}: {self.traits[key]}" for key in self.traits]) + boxbot

    def show_statblock(self) -> tuple[int, int]:
        """
        Generate the menu for a single statblock
        :param statblock: A statblock to generate the menu for
        :return: A tuple of the: menu choice, length of the options
        """
        options, optlen = self._get_options()
        
        return options, optlen

    def take_damage(self) -> bool:
        try:
            self.hp -= int(input("Damage: "))
        except:
            print("[!Error] could not deal damage")
        if self.hp <= 0:
            return True
        return False


