from simple_term_menu import TerminalMenu
from Roller import roll, roll_string
import os
import re

class StatBlock:
    def __init__(self, statblock_data) -> None:
        self.maxHP = statblock_data["maxHP"]
        self.ac = statblock_data["AC"]
        self.speed = statblock_data["speed"]
        self.stats = statblock_data["stats"]
        self.statmods = {stat: (self.stats[stat] - 10) // 2 for stat in self.stats.keys()}
        self.load_optional(statblock_data)

        self.hp = self.maxHP
        self.initiative = 0

    def load_optional(self, statblock_data):
        self.has_actions = False
        self.has_attacks = False
        if "actions" in statblock_data.keys():
            self.actions = statblock_data["actions"]
            self.has_actions = True
        
        if "attacks" in statblock_data.keys():
            self.attacks = statblock_data["attacks"]
            self.has_attacks = True
    
    def roll_initiative(self):
        self.initiative = roll(1, 20, self.statmods["DEX"])
        return self.initiative

    def take_action(self, choice):
        if choice in self.actions.keys():
            return self.actions[choice]["text"]
        if choice in self.attacks.keys():
            damage, dtype = self.make_attack(self.attacks[choice])
            return f"{damage} {dtype} dmg"
        
    def make_attack(self, attack):
        dmg_string = attack["damage"].split(",")
        dtype = dmg_string[1].strip()

        dstring = dmg_string[0].replace(" ", "")
        for key in self.statmods.keys():
            dstring = dstring.replace(key, str(self.statmods[key]))
        
        return roll_string(dstring), dtype
        


def statblock_menu(statblock: StatBlock):
    choice = -1
    optlen = 1
    while choice != optlen - 1:
        choice, optlen = show_statblock(statblock)
        if not type(choice) is int:
            print(statblock.take_action(choice))
        elif choice == optlen - 2:
            statblock.hp -= int(input("Damage: "))
            os.system("clear")
        

def show_statblock(statblock: StatBlock):
    title = \
f"|AC: {statblock.ac} | \
spd: {str(statblock.speed)} | \
HP: {statblock.hp}/{statblock.maxHP}|"
    options = []
    if statblock.has_actions:
        options.extend(statblock.actions.keys())
    if statblock.has_attacks:
        options.extend(statblock.attacks.keys())
    options.extend([
        "[d] Take Damage",
        "[e] Exit"
    ])
    menu = TerminalMenu(options, title=title)
    choice = menu.show()
    if choice < len(options) - 2:
        choice = options[choice]
    return choice, len(options)
