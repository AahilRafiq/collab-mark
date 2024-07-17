"use server";
import { actionResponseObj } from "@/lib/helpers/actionResHelpers";
import type { actionRes } from "@/types/serverActionResponse";
import { Users } from "@/db/schema";
import { db } from "@/db/db";
import { eq, or } from "drizzle-orm";
import { cookies } from "next/headers";
import { getFirstRecord } from "@/db/getFirstRecord";
import { generateToken } from "@/lib/auth/auth";

export async function SignUp(
    username: string,
    email: string,
    password: string,
    confirmPassword: string
): Promise<actionRes> {
    try {
        if (password != confirmPassword)
            return actionResponseObj(false, "Passowrds Dont Match");

        const existingUser = getFirstRecord(
            await db
                .select()
                .from(Users)
                .where(or(eq(Users.name, username), eq(Users.email, email)))
        );

        if (existingUser)
            return actionResponseObj(false, "Username / Email already in use");

        const newUser = getFirstRecord(
            await db
                .insert(Users)
                .values({ name: username, email, password })
                .returning()
        );

        const token = generateToken({id:newUser.id , name:newUser.name})
        cookies().set('auth_token',token)

        return actionResponseObj(true)

    } catch (err) {
        console.log(err);
        return actionResponseObj(false , 'Internal Server Error!')
    }
}
