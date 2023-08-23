
/**
 * Generate a random integer between a min and max inclusive
 * @param {int} min - The minimum value
 * @param {int} max - The maximum value
 * @returns {int} The generated value
 */
function randInt(min: number, max: number):number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// explicit operation functions
function plus(n1:number, n2:number):number {return n1 + n2}
function minus(n1:number, n2:number):number {return n1 - n2}

/**
 * Roll a number of the same dice
 * @param {int} number - The number of dice to roll
 * @param {int} sides - The number of sides the dice have
 * @param {int} [critVal=null] - The value at which the roll will crit
 * @returns {[[int], [bool]]} An array containing arrays of each result and whether it crit
 */
function rollDice(rollNum: number, sideNum: number, critVal: number | null=null):[number[], boolean[]]{
    let results = [];
    let crits = [];
    for (let i=0; i < rollNum; i++){
        let roll = randInt(1, sideNum);
        results.push(roll);
        if (critVal != null) {crits.push(roll >= critVal);}
        else {crits.push(false)}
    }
    return [results, crits];
}

/**
 * Read a single dice token
 * @param {string} dstring - A string composed of valid dice roll tokens
 *  includes: 
 *      `n(int)"d"s(int)` - a dice string indicating to roll `n` dice with `s` sides
 *      `nds"*"v` - indicates a roll can be crit with a roll of `v` or higher
 * @returns {[int, boolean]} An array containing the rolled value,
 *  and whether any rolls crit
 */
function rollDstring(dstring: string): [number[], boolean[]]{
    let critVal: number | null = null;
    if (dstring.includes("*")){
        let rawDarr: string[] = dstring.split("*");
        dstring = rawDarr[0];
        critVal = parseInt(rawDarr[1]);
    }
    let [rollNumStr, sideNumStr] = dstring.split("d")
    let [results, crits] = rollDice(
        parseInt(rollNumStr), parseInt(sideNumStr), critVal
    )
    //results = results.reduce((pSum, elem) => pSum + elem, 0);
    //crits = crits.reduce((pBool, elem) => pBool || elem, false);

    return [results, crits];
}
const double = (roll: number):number => roll*2;
function reduceRolls([ rolls, crits ]: [number[], boolean[]], critEffect=double): [number, boolean] {
    let total: number = 0;
    for (let i=0; i < rolls.length; i++) {
        total += crits[i] ? critEffect(rolls[i]) : rolls[i]
    }
    return [total, crits.includes(true)];
}

/**
 * Parse several dice and operator tokens and return result of rolls
 * @param {string} dstring - A string composed of valid dice and operator tokens
 *  includes:
 *      `+-` - operators specifying whether to add or subtract the following token
 *      int - a flat modifier to apply
 *      - any valid dice string token @see rollDstring
 * @returns {[int, string]} An array containing the total roll and a srting showing
 *  individual rolls
 */
function rollString(dstring: string): [number, string] {
    let tokens = dstring.split(/(\+|\-)/);
    tokens = tokens.filter(token => token !== "")

    let val = 0;
    let total = 0;
    let retString = "";
    let operator = plus;
    for (let i=0; i < tokens.length; i++){
        let token = tokens[i];
        if (token === "+") {
            operator=plus;
            retString = retString + token;
            continue;
        }
        if (token === "-") {
            operator=minus;
            retString = retString + token;
            continue;
        }

        if (token.includes("d")) {
            let crit = false;
            [val, crit] = reduceRolls(rollDstring(token));
            if (crit) {
                retString = `${retString} (${val})! `;
            }else{
                retString = `${retString}${val}`;
            }
        }else{
            val = parseInt(token);
            retString = retString + token;
        }

        total = operator(total, val)
    }
    return [total, retString];
}

export { rollString };