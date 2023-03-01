from simple_term_menu import TerminalMenu
import Roller

def submenu(action):
    options = list(action.keys())
    options.append("[q] Cancel")
    menu = TerminalMenu(options, title="\u2500"*10,preview_command=lambda key: action[key].preview())
    choice = options[menu.show()]
    if choice == "[q] Cancel":
        return "Canceled!", ""
    else:
        return action[choice](), choice

def cost_wrap(cost):
    return f"\x1b[36m[-{cost}]\x1b[39m"

def use_wrap(uses, max_uses):
    return f"\x1b[33m({uses}/{max_uses})\x1b[39m"

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
        self.text = data["text"].strip("\n")
        if "rolls" in data:
            self.rolls = {}
            for key, roll in data["rolls"].items():
                critable = "*" in roll
                rstring = stats.replace_stats(roll).remove("*") if critable else stats.replace_stats(roll)
                self.rolls[key] = (rstring, critable)
        else:
            self.rolls = None

        if "uses" in data:
            self.max_uses = data["uses"]
            self.uses = self.max_uses
        else:
            self.max_uses = None


    def __call__(self):
        if self.max_uses is not None:
            if not self._can_use():
                return f"{use_wrap(self.uses, self.max_uses)} Exhausted!"
            
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
                
            retstring = " - ".join(roll_list)
        else:
            retstring =  self.text

        if self.max_uses is not None:
            self._decrement_uses()
            retstring = f"{use_wrap(self.uses, self.max_uses)} {retstring}"

        return retstring
    
    def _decrement_uses(self):
        self.uses -= 1
    
    def _can_use(self):
        return self.uses > 0

    def preview(self):
        retstring =  self.text

        if self.max_uses is not None:
            if self._can_use():
                retstring = f"{use_wrap(self.uses, self.max_uses)} {retstring}"
            else:
                retstring = f"{use_wrap(self.uses, self.max_uses)} Exhausted!"

        return retstring

class ResourceAction(Action):
    def __init__(self, parent, data, stats):
        super().__init__(data, stats)
        self.parent = parent
        self.resource_key = data["resource"]
        self.resource_cost = data["cost"]

        self.max_uses = self.parent.max_resources[self.resource_key]
        self.update_uses()

    def _decrement_uses(self):
        self.uses -= self.resource_cost
        self.parent.resources[self.resource_key] = self.uses
        self.parent.update_children()
    
    def _can_use(self):
        return self.uses >= self.resource_cost
    
    def update_uses(self):
        self.uses = self.parent.resources[self.resource_key]
    
    def preview(self):
        retstring =  self.text

        if self.max_uses is not None:
            if self._can_use():
                retstring = f"{cost_wrap(self.resource_cost)}{use_wrap(self.uses, self.max_uses)} {retstring}"
            else:
                retstring = f"{cost_wrap(self.resource_cost)}{use_wrap(self.uses, self.max_uses)} Exhausted!"

        return retstring
        



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
        menu = TerminalMenu(self.attack_options.keys(), preview_command=lambda key: self.attack_options[key][1].preview())
        choice = list(self.attack_options.keys())[menu.show()]
        attack = self.attack_options[choice]
        return "\n".join([attack[1]() for _ in range(attack[0])]), choice
    
    def preview(self):
        return "Make "+ " attacks or ".join([f"{val[0]} {key}" for key, val in self.attack_options.items()]) +" attacks"