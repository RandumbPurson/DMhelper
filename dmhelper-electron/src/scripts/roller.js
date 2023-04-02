
function randInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function plus(n1, n2) {return n1 + n2}
function minus(n1, n2) {return n1 - n2}

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