import { db } from "@/db/db";
import { Documents } from "@/db/schema";
import { eq, and, isNull } from "drizzle-orm";

export async function getDocuments(parentFolderID: string) {

    const parentID = parseInt(parentFolderID) === 0 ? null : parseInt(parentFolderID)

    return db
        .select()
        .from(Documents)
        .where(
            and(
                parentID ? eq(Documents.parentFolder, parentID) : isNull(Documents.parentFolder),
            )
        );
}