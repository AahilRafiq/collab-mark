'use server'
import { actionResponseObj } from "@/lib/helpers/actionResHelpers"
import type { actionRes } from "@/types/serverActionResponse"
import { Users } from "@/db/schema"
import { db } from "@/db/db"
import { eq } from "drizzle-orm"
import { cookies } from "next/headers"
import { getFirstRecord } from "@/db/getFirstRecord"
import { generateToken } from "@/lib/auth/auth"

export async function SignIn(username: string , password: string):Promise<actionRes> {
    try {
        const user = getFirstRecord(await db.select().from(Users).where(eq(Users.name , username)))
        if(!user) return actionResponseObj(false , 'User not found!')
        if(user.password != password) return actionResponseObj(false,'Incorrect Credentials!')

        const token = generateToken({id:user.id , name:user.name})
        cookies().set('auth_token',token)
        return actionResponseObj(true)
          
    } catch(err) {
        console.log(err)
        return actionResponseObj(false , 'Internal Server Error!')
    }
}