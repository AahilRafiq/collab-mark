export function actionResponseObj<T>(success:boolean , err?:string , res?: T) {
    return {
        success,
        err: err,
        res: res
    }
}

export function displayToast(toast:any, err: string) {
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