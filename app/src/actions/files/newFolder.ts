'use server'
import { actionResponseObj } from "@/lib/helpers/actionResHelpers"
import type { actionRes } from "@/types/serverActionResponse"
import { Folders } from "@/db/schema"
import { db } from "@/db/db"
import { cookies } from "next/headers"
import { verifyToken } from "@/lib/auth/auth"

export async function createNewFolder(folderName: string , parentFolderID: number | null):Promise<actionRes> {
    
    const token = cookies().get('auth_token')
    if(!token) return actionResponseObj(false,'Unauthorized')
    
    try {
        const userID: number = verifyToken(token.value).id

        await db.insert(Folders).values({
            name: folderName,
            ownerID: userID,
            parentFolder: parentFolderID
        })

        return actionResponseObj(true)

    } catch(err) {
        console.log(err);
        return actionResponseObj(false , 'Interval Server Error')
    }
}