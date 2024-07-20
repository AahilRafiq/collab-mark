"use server";
import { actionResponseObj } from "@/lib/helpers/actionResHelpers";
import { db } from "@/db/db";
import { Documents } from "@/db/schema";
import type { actionRes } from "@/types/serverActionResponse";
import { getFirstRecord } from "@/db/getFirstRecord";
import { eq } from "drizzle-orm";

interface Res{
    isPublic: boolean;
    ownerID: number;
}

export async function getDocPublicStatus(
    documentID: number
): Promise<actionRes<Res>> {
    try {
        const document = getFirstRecord(
            await db
                .select()
                .from(Documents)
                .where(eq(Documents.id, documentID))
        );
        if (!document) return actionResponseObj(false, "Document not found");
        return actionResponseObj(true, "Document Updated", {
            isPublic: document.public,
            ownerID: document.ownerID,
        });
    } catch (error) {
        console.error(error);
        return actionResponseObj(
            false,
            "An error occurred while fetching the document"
        );
    }
}
