from statblock_components import *
import Roller

def leader_wrap(string):
    return f"\u2502<{string}>"

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
        self.has = {
            "actions": False,
            "multiattack": False,
            "attacks": False,
            "traits": False,
            
        }

        if "attacks" in statblock_data.keys():
            self.attacks = {
                key: Attack(data, self.stats) for key, data in statblock_data["attacks"].items()
            }
            self.has["attacks"] = True

        if "actions" in statblock_data.keys():
            self.actions = {}
            for key, data in statblock_data["actions"].items():
                if key == "multiattack":
                    self.multiattack = Multiattack(data, self.attacks)
                    self.has["multiattack"] = True
                else:
                    self.actions[key] = Action(data, self.stats)
                    self.has["actions"] = True

        if "traits" in statblock_data.keys():
            self.traits = statblock_data["traits"]
            self.has["traits"] = True

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
        if choice == "<Traits>":
            return
        if choice == "[Multiattack]":
            retstring, key = self.multiattack()
        elif choice == "[Actions]":
            retstring, key = submenu(self.actions)
        elif choice == "[Attacks]":
            retstring, key = submenu(self.attacks)
        sep = "\u250c{}\u2524{}\n".format("\u2500"*5, key)
        print(f"{sep}{retstring}")

    def _preview_multi(self, action):
        return f"\n".join([f"{leader_wrap(key)} {elem.preview()}" for key, elem in action.items()])

    def preview(self, key: str) -> str:
        """
        Generate a preview string for a selected option
        :param key: the key of the selected option
        :return: the preview string for the selected option
        """
        if key == "<Traits>":
            return "\n".join([f"{leader_wrap(key)} {trait}" for key, trait in self.traits.items()])
        elif key == "[Multiattack]":
            return self.multiattack.preview()
        elif key == "[Attacks]":
            return self._preview_multi(self.attacks)
        elif key == "[Actions]":
            return self._preview_multi(self.actions)
    
    def get_options(self) -> tuple[list, int]:
        options = []

        if self.has["multiattack"]:
            options.append("[Multiattack]")
        if self.has["attacks"]:
            options.append("[Attacks]")
        if self.has["actions"]:
            options.append("[Actions]")
        if self.has["traits"]:
            options.append("<Traits>")

        options.extend([
            "[s] Skill Check",
            "[d] Take Damage",
            "[c] Clear",
            "[q] Exit"
        ])

        return options, len(options)
    
    def get_status_bar(self) -> str:
        return f"|AC: {self.ac} | HP: {self.hp}/{self.maxHP} | spd: {str(self.speed)}|"

    def take_damage(self) -> bool:
        try:
            self.hp -= int(input("Damage: "))
        except:
            print("[!Error] could not deal damage")
        if self.hp <= 0:
            return True
        return False


