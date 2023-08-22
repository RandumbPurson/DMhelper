
/**
 * Splits a numeric value and string separated by a given delimiter
 * @param valstrString A value string pair eg; "14, age"
 * @param delim The delimiter to split on; defaults to ","
 * @returns The separated value and string as an array eg; [14, "age"]
 */
function splitValStr(valstrString: string, delim=","): [number, string] {
    let valstrArr: string[] = valstrString.split(delim);
    let val = valstrArr[0] as unknown as number;
    let str = valstrArr[1];
    return [val, str];
}

export { splitValStr }
