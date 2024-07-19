import { db } from "@/db/db";
import { Documents } from "@/db/schema";
import { eq, and, isNull } from "drizzle-orm";
import { cookies } from "next/headers";
import { verifyToken } from "../auth/auth";

export async function getDocuments(parentFolderID: string , userID: number) {

    const parentID = parseInt(parentFolderID) === 0 ? null : parseInt(parentFolderID)
    const token = cookies().get('auth_token')
    if(!token) throw new Error("Unauthorized")

    return db
        .select()
        .from(Documents)
        .where(
            and(
                parentID ? eq(Documents.parentFolder, parentID) : isNull(Documents.parentFolder),
                eq(Documents.ownerID , userID)
            )
        );
}