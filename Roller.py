from random import randint

def roll_string():
    pass

def roll(number, sides, modifier, times = 1):
    return sum([randint(1, sides) for i in range(number)]) + modifier

