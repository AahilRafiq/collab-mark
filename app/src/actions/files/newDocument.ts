'use server'
import { actionResponseObj } from "@/lib/helpers/actionResHelpers"
import type { actionRes } from "@/types/serverActionResponse"
import { Documents } from "@/db/schema"
import { db } from "@/db/db"
import { cookies } from "next/headers"
import { verifyToken } from "@/lib/auth/auth"

export async function createNewDocument(documentName: string , parentFolderID: number | null):Promise<actionRes> {
    
    const token = cookies().get('auth_token')
    if(!token) return actionResponseObj(false,'Unauthorized')

    if(!documentName || documentName.length < 1) return actionResponseObj(false,'Document name is required')
    
    try {
        const userID: number = verifyToken(token.value).id

        await db.insert(Documents).values({
            name: documentName,
            ownerID: userID,
            parentFolder: parentFolderID,
            public: true,
            content: ''
        })

        return actionResponseObj(true)

    } catch(err) {
        console.log(err);
        return actionResponseObj(false , 'Interval Server Error')
    }
}