
/**
 * Generate a random integer between a min and max inclusive
 * @param {int} min - The minimum value
 * @param {int} max - The maximum value
 * @returns {int} The generated value
 */
function randInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

// explicit operation functions
function plus(n1, n2) {return n1 + n2}
function minus(n1, n2) {return n1 - n2}

/**
 * Read a single dice token
 * @param {string} dstring - A string composed of valid dice roll tokens
 *  includes: 
 *      `n(int)"d"s(int)` - a dice string indicating to roll `n` dice with `s` sides
 *      `nds"*"v` - indicates a roll can be crit with a roll of `v` or higher
 * @returns {[int, boolean]} An array containing the rolled value,
 *  and whether any rolls crit
 */
function rollDstring(dstring){
    let critVal = null;
    if (dstring.includes("*")){
        [dstring, critString] = dstring.split("*");
        critVal = parseInt(critString);
    }
    [number, sides] = dstring.split("d")
    let [results, crits] = rollDice(
        parseInt(number), parseInt(sides), critVal
    )
    results = results.reduce((pSum, elem) => pSum + elem, 0);
    crits = crits.reduce((pBool, elem) => pBool || elem, false);

    return [results, crits];
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
function rollString(dstring){
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
            [val, crit] = rollDstring(token);
            if (crit) {
                retString = `${retString} (${val})! `;
            }else{
                retString = `${retString}${val}`;
            }
        }else{
            val = token;
            retString = retString + token;
        }

        total = operator(total, parseInt(val))
    }
    return [total, retString];
}

/**
 * Roll a number of the same dice
 * @param {int} number - The number of dice to roll
 * @param {int} sides - The number of sides the dice have
 * @param {int} [critVal=null] - The value at which the roll will crit
 * @returns {[[int], [bool]]} An array containing arrays of each result and whether it crit
 */
function rollDice(number, sides, critVal=null){
    let results = [];
    let crits = [];
    for (let i=0; i < number; i++){
        let roll = randInt(1, sides);
        results.push(roll);
        if (critVal != null) {crits.push(roll >= critVal);}
        else {crits.push(false)}
        
    }
    return [results, crits];
}

exports.rollString = rollString;