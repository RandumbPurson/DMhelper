
export function tryHandle(func: Function, errFunc: Function) {
    return (...args: any[]) => {
        try {
            func(...args)
        }catch{
            errFunc(...args)
        }
    }
}