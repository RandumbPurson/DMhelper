export function decoratePositives(num: number) {
    if (num >= 0) {
        return `+${num}`
    }else{
        return `${num}`
    }
}
