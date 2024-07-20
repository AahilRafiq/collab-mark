"use server";
import { cookies } from "next/headers";
import { actionResponseObj } from "@/lib/helpers/actionResHelpers";
import { verifyToken } from "@/lib/auth/auth";
import { db } from "@/db/db";
import { Documents } from "@/db/schema";
import type { actionRes } from "@/types/serverActionResponse";
import { getFirstRecord } from "@/db/getFirstRecord";
import { eq } from "drizzle-orm";

export async function updatePublicStatus(
    documentID: number,
    publicStatus: boolean
):Promise<actionRes> {
    try {
        const cookie = cookies().get("auth_token");
        if (!cookie) return actionResponseObj(false, "Unauthorized");
        const token = verifyToken(cookie.value);
        if (!token) return actionResponseObj(false, "Unauthorized");
        const document = getFirstRecord(
            await db
                .select()
                .from(Documents)
                .where(eq(Documents.id, documentID))
        );
        if (!document) return actionResponseObj(false, "Document not found");
        if (token.id !== document.ownerID)
            return actionResponseObj(
                false,
                "You don't have permission to update this document"
            );

        await db
            .update(Documents)
            .set({
                public: publicStatus,
            })
            .where(eq(Documents.id, documentID));

        return actionResponseObj(true, "Document Updated");
    } catch (error) {
        console.error(error);
        return actionResponseObj(
            false,
            "An error occurred while updating the document"
        );
    }
}
