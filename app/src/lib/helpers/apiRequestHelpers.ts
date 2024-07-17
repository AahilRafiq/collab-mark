export type TApiResponse<T> = {
    success: boolean,
    err?: string,
    res?: T
}

export function displayErrorToast(toast:any, err: string) {
    toast({
        title: "Error",
        variant: "destructive",
        description: err
    })
}

export function displayNormalToast(toast:any,title:string, msg: string) {
    toast({
        title: title,
        variant: "default",
        description: msg
    })
}