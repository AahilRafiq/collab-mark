import { db } from "@/db/db";
import { Folders } from "@/db/schema";
import { eq, and, isNull } from "drizzle-orm";

export async function getFolders(parentFolderID: string , userID: number) {

    const parentID = parseInt(parentFolderID) === 0 ? null : parseInt(parentFolderID)

    return db
        .select()
        .from(Folders)
        .where(
            and(
                parentID ? eq(Folders.parentFolder, parentID) : isNull(Folders.parentFolder),
                eq(Folders.ownerID , userID)
            )
        );
}