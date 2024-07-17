export type actionRes<T = undefined> = {
    success: boolean,
    message?: string,
    res?: T
}