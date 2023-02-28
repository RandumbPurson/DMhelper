from random import randint
import re

plus = lambda n1, n2: n1+n2
minus = lambda n1, n2: n1 - n2

def roll_string(dstring: str, critable=False) -> int:
    """
    Roll dice based on a dice string
    :param dstring: A dice string. It may contain any of the following tokens
        - `ndx`: a dice roll where `n` is the number of rolls and `x` is the number of sides
        - `+`, `-`: operators, specify whether to add or subtract the following token
        - `n`: an int that modifies the roll
    :return: The result of the roll
    """
    # generate tokens
    tokens = re.split("(\+|\-)", dstring)
    if "" in tokens:
        tokens.remove("")

    
    crit = False if critable else None
    total = 0
    operator = plus
    for token in tokens:
        # process operator tokens
        if token == "+":
            operator = plus
            continue
        elif token == "-":
            operator = minus
            continue

        # process dice tokens
        if "d" in token:
            single_dstring = token.split("d")
            val = roll(
                int(single_dstring[0]),
                int(single_dstring[1])
            )
            if critable and val == int(single_dstring[1]):
                crit = True

        else:
            # process modifier tokens
            val = int(token)

        total = operator(total, val)

    if critable:
        if crit:
            total = 2*total
        return total, crit
    else:
        return total


def roll(number, sides, modifier=0, times=1):
    """Basic rolling function"""
    return sum([sum([randint(1, sides) for _ in range(number)]) + modifier for _ in range(times)])
