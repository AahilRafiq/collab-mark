'use server'
import { cookies } from "next/headers";
import { actionResponseObj } from "@/lib/helpers/actionResHelpers";
import { verifyToken } from "@/lib/auth/auth";
import { db } from "@/db/db";
import { Documents } from "@/db/schema";
import type { actionRes } from "@/types/serverActionResponse";
import { getFirstRecord } from "@/db/getFirstRecord";
import { eq } from "drizzle-orm";

export async function getDocument(documentID: number):Promise<actionRes<string>> {
    try {
        const cookie = cookies().get("auth_token");
        if (!cookie) return actionResponseObj(false, "Unauthorized");
        const token = verifyToken(cookie.value);
        if (!token) return actionResponseObj(false, "Unauthorized");
        const document = getFirstRecord(await db.select().from(Documents).where(eq(Documents.id , documentID)));
        if(!document) return actionResponseObj(false, "Document not found");
        if(!document.public && token.id !== document.ownerID) return actionResponseObj(false, "You don't have permission to view this document");
        
        return actionResponseObj(true ,'Document Updated', document.content);
    } catch (error) {
        console.error(error);
        return actionResponseObj(false, "An error occurred while fetching the document");
    }
}