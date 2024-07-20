'use server'
import { cookies } from "next/headers";
import { actionResponseObj } from "@/lib/helpers/actionResHelpers";
import { verifyToken } from "@/lib/auth/auth";
import { db } from "@/db/db";
import { Documents } from "@/db/schema";
import type { actionRes } from "@/types/serverActionResponse";
import { eq } from "drizzle-orm";

export async function saveDocument(value: string , documentID: number):Promise<actionRes> {
    try {
        const cookie = cookies().get("auth_token");
        if (!cookie) return actionResponseObj(false, "Unauthorized");
        const token = verifyToken(cookie.value);
        if (!token) return actionResponseObj(false, "Unauthorized");

        await db.update(Documents).set({content: value}).where(eq(Documents.id , documentID))
        return actionResponseObj(true, "Document saved successfully");
    } catch (error) {
        console.error(error);
        return actionResponseObj(false, "An error occurred while saving the document");
    }
}