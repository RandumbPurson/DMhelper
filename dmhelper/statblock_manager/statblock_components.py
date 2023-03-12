from simple_term_menu import TerminalMenu
from typing import NewType
import Roller

# map skill names to stats
skill_map = {
    "athletics": "STR", 
    "acrobatics": "DEX", 
    "sleight of hand": "DEX", 
    "stealth": "DEX", 
    "arcana": "INT", 
    "history": "INT", 
    "investigation": "INT",
    "nature": "INT",
    "religion": "INT",
    "animal handling": "WIS",
    "insight": "WIS",
    "medicine": "WIS",
    "perception": "WIS",
    "survival": "WIS", 
    "deception": "CHA",
    "intimidation": "CHA",
    "performance": "CHA",
    "persuasion": "CHA"
}

CallableComponent = NewType("CallableComponent", object)
StatBlock = NewType("StatBlock", object)  # a StatBlock type to avoid circular imports

def submenu(action: CallableComponent) -> tuple[str, str]:
    """
    Present a menu to preview and select an action

    :param action: A statblock component with a callable action
    :return: A tuple of the string returned by calling the action as well as the action name
    """
    options = list(action.keys())
    options.append("[q] Cancel")
    menu = TerminalMenu(options, title="\u2500"*10,preview_command=lambda key: action[key].preview())
    choice = options[menu.show()]
    if choice == "[q] Cancel":
        return "Canceled!", ""
    else:
        return action[choice](), choice


# styling functions
def style_cost(cost):
    return f"\x1b[36m[-{cost}]\x1b[39m"

def style_uses(uses, max_uses):
    return f"\x1b[33m({uses}/{max_uses})\x1b[39m"

def style_exhausted(use_str, exhausted_string = "Exhausted!"):
    return f"{use_str} \x1b[31m{exhausted_string}\x1b[39m"

class Stats:
    """
    Class to handle stats including skillchecks and interpolation
    """
    ability_scores = ["STR", "DEX", "CON", "INT", "WIS", "CHA"]
    shortcut_scores = ["[s] STR", "[d] DEX", "[c] CON", "[w] WIS", "[i] INT", "[a] CHA"]

    def __init__(self, data: dict):
        self.stats = data["stats"]
        self.statmods = {
            stat: (self.stats[stat] - 10) // 2 \
                for stat in self.stats.keys()
        }

        self.pb = data["PB"]
        self.load_proficiencies(data)
    
    def load_proficiencies(self, data: dict):
        """
        Optionally load skill and save proficiencies from statblock

        :param data: The statblock data
        """
        self.skills, self.saving_throws = [], []
        if "proficiencies" in data:
            if "skills" in data["proficiencies"]:
                self.skills = data["proficiencies"]["skills"]
            if "saving throws" in data["proficiencies"]:
                self.saving_throws = data["proficiencies"]["saving throws"]

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
        """
        Perform a skillcheck using stats and print results

        :param key: The stat to make a check with
        :param add_pb: Whether to add proficiency bonus to the check, defaults to False
        """
        dstring = f"1d20+{self.statmods[key]}+{str(self.pb)}" \
            if add_pb else f"1d20+{self.statmods[key]}"
        result, crit = Roller.roll_string(dstring, True)
        print(f"{key}: {result}{', crit!' if crit else ''}")

class Action:
    """
    Manage basic actions
    """
    def __init__(self, data: dict, stats: Stats):
        """
        Load properties of the action

        :param data: The action's info
        :param stats: The stats object for the statblock with this action
        """
        self.text = data["text"].strip("\n")
        # optionally load rolls
        if "rolls" in data:
            self.rolls = {}
            for key, roll in data["rolls"].items():
                critable = "*" in roll
                rstring = stats.replace_stats(roll).remove("*") if critable else stats.replace_stats(roll)
                self.rolls[key] = (rstring, critable)
        else:
            self.rolls = None

        # optionally load use info
        if "uses" in data:
            self.max_uses = data["uses"]
            self.uses = self.max_uses
        else:
            self.max_uses = None


    def __call__(self) -> str:
        """
        Perform the action and return a string with result

        :return: The result of performing the action
        """
        if self.max_uses is not None:
            if not self._can_use():
                return style_exhausted(self._uses_str())
            
        if self.rolls is not None:
            roll_list = []
            # perform all rolls and join into return value
            for key, rstring in self.rolls.items():
                rstring, critable = rstring
                roll_val = Roller.roll_string(rstring, critable=critable)

                if critable:
                    retval.append(f"{key}: {roll_val[0]}")
                    if roll_val[1]:
                        retval = retval + ", crit!"
                else:
                    retval = f"{key}: {roll_val}"

                roll_list.append(retval)
                
            retstring = " - ".join(roll_list)
        else:
            retstring =  self.text

        if self.max_uses is not None:
            self._decrement_uses()
            retstring = f"{self._uses_str()} {retstring}"
    
        return retstring
    
    # usage hooks
    def _decrement_uses(self):
        """Called to decrement number of uses of this action"""
        self.uses -= 1
    def _can_use(self) -> bool:
        """Called to determine whether this action can be used"""
        return self.uses > 0
    def _uses_str(self) -> str:
        """Gets the string to display uses"""
        return style_uses(self.uses, self.max_uses)


    # default preview hook
    def _preview_str_default(self) -> str:
        """The default preview string"""
        return self.text

    def preview(self) ->str:
        """
        Generate the string to be shown during menu preview

        :return: The string to be shown during menu preview
        """
        if self.max_uses is None:
            return self._preview_str_default()
        
        if self._can_use():
            return f"{self._uses_str()} {self._preview_str_default()}"
        else:
            return style_exhausted(self._uses_str())

class ResourceAction(Action):
    """A special action that uses statblock resources rather than individual resources"""
    def __init__(self, parent: StatBlock, data: dict, stats: Stats):
        """
        Init the resource action

        :param parent: The statblock this resource action belongs to
        :param data: The resource action's info
        :param stats: The stats object for the parent statblock
        """
        super().__init__(data, stats)
        self.parent = parent
        self.resource_key = data["resource"]
        self.resource_cost = data["cost"]

        self.max_uses = self.parent.max_resources[self.resource_key]
        self.update_uses()

    def _decrement_uses(self):
        """Decrement parent resources"""
        self.uses -= self.resource_cost
        self.parent.resources[self.resource_key] = self.uses
        self.parent.update_children()
    def _can_use(self) -> bool:
        """Can only use if parent has enough of the resource"""
        return self.uses >= self.resource_cost
    def _uses_str(self) -> str:
        """Also show cost of using"""
        return f"{style_cost(self.resource_cost)}{style_uses(self.uses, self.max_uses)}"

    def update_uses(self):
        """Update parent's resources"""
        self.uses = self.parent.resources[self.resource_key]


class Attack:
    """Manage an attack"""
    def __init__(self, data: dict, stats: Stats) -> None:
        """
        Initializes attack

        :param data: The attack's info
        :param stats: The stats object of the statblock with this attack
        """
        self.hit_bonus = stats.replace_stats(data["to-hit"])
        self.hit_string = "1d20+"+self.hit_bonus
        raw_dstring = data["damage"].split(",")
        self.dmg_string = stats.replace_stats(raw_dstring[0])
        self.dmg_type = raw_dstring[1].strip()

        self.type = data["type"]
        self.range = data["range"]
    
    def __call__(self) -> str:
        """
        Perform the attack and return the result as a string

        :return: The attack damage, damage type, and whether it crit
        """
        to_hit, crit = Roller.roll_string(self.hit_string, critable=True)
        damage = Roller.roll_string(self.dmg_string)
        retstring = f"{to_hit} to hit, {damage} dmg {self.dmg_type}"
        if crit:
            retstring = retstring + ", crit!"
        return retstring

    def preview(self):
        return f"{self.type} {self.range}, +{Roller.roll_string(self.hit_bonus)} to hit, {self.dmg_string}"

class Multiattack():
    """A multiattack action"""
    def __init__(self, data: dict, attacks: list[Attack]):
        """
        Init multiattack from info and attacks

        :param data: The multiattack info
        :param attacks: A list of attack which the statblock has
        """
        self.attack_options = {}
        for elem in data:
            num_attacks, attack = elem.split("*")
            self.attack_options[attack] = (int(num_attacks), attacks[attack])
    
    def __call__(self) -> str:
        """Present a menu of multiattacks and return a string of the result of selected multiattack"""
        menu = TerminalMenu(self.attack_options.keys(), preview_command=lambda key: self.attack_options[key][1].preview())
        choice = list(self.attack_options.keys())[menu.show()]
        attack = self.attack_options[choice]
        return "\n".join([attack[1]() for _ in range(attack[0])]), choice
    
    def preview(self) -> str:
        """Generate preview string"""
        return "Make "+ " attacks or ".join([f"{val[0]} {key}" for key, val in self.attack_options.items()]) +" attacks"