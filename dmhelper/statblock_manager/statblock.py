from statblock_manager.statblock_components import *
from copy import copy
import Roller

def noop(*args):
    pass

def leader_wrap(string):
    return f"\u2502\x1b[92m<{string}>\x1b[39m"

def sep_wrap(string, key):
    return "\u250c{}\u2524{}\n{}".format("\u2500"*5, key, string)

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
        #self.load_maps()

        self.hp = self.maxHP
        self.initiative = 0

    def _load_single_maps(self, key, menu_key, preview_command, action_command):
        self.has[key] = True
        self.key_map[key] = menu_key
        self.preview_map[menu_key] = preview_command
        self.action_map[menu_key] = action_command

    def load_optional(self, statblock_data):
        """Helper function to load optional properties"""
        self.has = {
            "traits": False,
            "attacks": False,
            "multiattack": False,
            "actions": False,
            "reactions": False,
            "bonus actions": False,
            "resources": False
        }
        self.key_map = {}
        self.preview_map = {}
        self.action_map = {}
        self.opt_count = {}

        # load traits
        if "traits" in statblock_data:
            self.traits = statblock_data["traits"]
            self._load_single_maps(
                "traits", "<Traits>",
                lambda : "\n".join([f"{leader_wrap(key)} {trait}" for key, trait in self.traits.items()]),
                noop
            )

        # load attacks
        if "attacks" in statblock_data:
            self.attacks = {
                key: Attack(data, self.stats) \
                 for key, data in statblock_data["attacks"].items()
            }
            self._load_single_maps(
                "attacks", "[Attacks]", 
                lambda : self._preview_multi(self.attacks),
                lambda : print(sep_wrap(*submenu(self.attacks)))
            )

        # load multiattack      
        if self.has["attacks"] and "multiattack" in statblock_data:
            self.multiattack = Multiattack(statblock_data["multiattack"], self.attacks)
            self._load_single_maps(
                "multiattack", "[Multiattack]",
                lambda : self.multiattack.preview(),
                lambda : print(sep_wrap(*self.multiattack()))
            )

        # load actions
        if "actions" in statblock_data:
            self.actions = {
                key: Action(data, self.stats) for key, data in statblock_data["actions"].items()
            }
            self._load_single_maps(
                "actions", "[Actions]",
                lambda : self._preview_multi(self.actions),
                lambda : print(sep_wrap(*submenu(self.actions)))
            )

        # load reactions
        if "reactions" in statblock_data:
            self.reactions = {
                key: Action(data, self.stats) for key, data in statblock_data["reactions"].items()
            }
            self._load_single_maps(
                "reactions", "[Reactions]",
                lambda : self._preview_multi(self.reactions),
                lambda : print(sep_wrap(*submenu(self.reactions)))
            )

        # load bonus actions
        if "bonus actions" in statblock_data:
            self.bonus_actions = {
                key: Action(data, self.stats) for key, data in statblock_data["bonus actions"].items()
            }
            self._load_single_maps(
                "bonus actions", "[Bonus Actions]",
                lambda : self._preview_multi(self.bonus_actions),
                lambda : print(sep_wrap(*submenu(self.bonus_actions)))
            )

        # load resources
        if "resources" in statblock_data:
            self.has["resources"] = True
            self.max_resources = statblock_data["resources"]
            self.resources = copy(self.max_resources)
        
        if "resource actions" in statblock_data:
            self.resource_actions = {
                key: ResourceAction(self, data, self.stats) for key, data in statblock_data["resource actions"].items()
            }
            self._load_single_maps(
                "resources", "[Resource Actions]",
                lambda : self._preview_multi(self.resource_actions),
                lambda : print(sep_wrap(*submenu(self.resource_actions)))
            )


        self.preview = lambda key: self.preview_map[key]() if key in self.preview_map else ""
        self.take_action = lambda key: self.action_map[key]() if key in self.action_map else noop

    def update_children(self):
        for child in self.resource_actions.values():
            child.update_uses()

    def reset_resource(self):
        options = list(self.resources.keys())
        options.append("[q] Cancel")
        menu = TerminalMenu(options, preview_command=\
            lambda key: f"{key}: {self.resources[key]}/{self.max_resources[key]}" \
            if key in self.resources else ""
        )
        choice = options[menu.show()]
        if choice == "[q] Cancel":
            print("Canceled!")
        else:
            self.resources[choice] = self.max_resources[choice]
            self.update_children()
            print(sep_wrap(f"({self.resources[choice]}/{self.max_resources[choice]}) reset {choice}", choice))

    def roll_initiative(self) -> int:
        """Roll initiative for this monster"""
        self.initiative = Roller.roll(1, 20, self.stats.statmods["DEX"])
        return self.initiative

    def _preview_multi(self, action):
        return f"\n".join([f"{leader_wrap(key)} {elem.preview()}" for key, elem in action.items()])

    
    def get_options(self) -> tuple[list, int]:
        options = []

        for key in self.key_map:
            if self.has[key]:
                options.append(self.key_map[key])

        options.extend([
            "[s] Skill Check",
            "[d] Take Damage",
            "[r] Reset Resource",
            "[c] Clear",
            "[q] Exit"
        ])

        return options, len(options)
    
    def get_status_bar(self) -> str:
        retstring = f"|AC: {self.ac} | HP: {self.hp}/{self.maxHP} | spd: {str(self.speed)} |"
        if self.has["resources"]:
            retstring = retstring + "|".join([f" {key}: ({self.resources[key]}/{self.max_resources[key]}) " for key in self.resources]) + "|"

        return retstring


    def take_damage(self) -> bool:
        try:
            self.hp -= int(input("Damage: "))
        except:
            print("[!Error] could not deal damage")
        if self.hp <= 0:
            return True
        return False


