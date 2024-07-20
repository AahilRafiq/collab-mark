"use server";
import { actionResponseObj } from "@/lib/helpers/actionResHelpers";
import type { actionRes } from "@/types/serverActionResponse";
import { Users } from "@/db/schema";
import { db } from "@/db/db";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { getFirstRecord } from "@/db/getFirstRecord";
import { generateToken } from "@/lib/auth/auth";
import { comparePassword } from "@/lib/auth/hashPassword";

export async function SignIn(
    username: string,
    password: string
): Promise<actionRes> {
    try {
        const user = getFirstRecord(
            await db.select().from(Users).where(eq(Users.name, username))
        );
        if (!user) return actionResponseObj(false, "User not found!");
        if (await comparePassword(password, user.password)===false)
            return actionResponseObj(false, "Incorrect Credentials!");

        const token = generateToken({ id: user.id, name: user.name });
        cookies().set("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60, // 7 days
        });
        return actionResponseObj(true);
    } catch (err) {
        console.log(err);
        return actionResponseObj(false, "Internal Server Error!");
    }
}
