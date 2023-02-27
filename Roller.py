from random import randint
import re


def plus(n1, n2):
    return n1 + n2


def minus(n1, n2):
    return n1 - n2


def roll_string(dstring):
    tokens = re.split("(\+|\-)", dstring)
    if "" in tokens:
        tokens.remove("")
    total = 0
    operator = plus
    for token in tokens:
        if token == "+":
            operator = plus
            continue
        elif token == "-":
            operator = minus
            continue

        if "d" in token:
            single_dstring = token.split("d")
            val = roll(
                int(single_dstring[0]),
                int(single_dstring[1])
            )
        else:
            val = int(token)

        total = operator(total, val)
    return total


def roll(number, sides, modifier=0, times=1):
    return sum([randint(1, sides) for _ in range(number)]) + modifier
