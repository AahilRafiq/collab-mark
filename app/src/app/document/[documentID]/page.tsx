import ClientPage from "./pageContent";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth/auth";
import { Users } from "@/db/schema";
import { getFirstRecord } from "@/db/getFirstRecord";
import { db } from "@/db/db";
import { eq } from "drizzle-orm";

interface Props {
    params: {
        documentID: string;
    };
}

export default async function({params}: Props) {

    const token = cookies().get('auth_token');
    const data = verifyToken(token.value);
    const userID = parseInt(data.id)
    const user = getFirstRecord(await db.select().from(Users).where(eq(Users.id , userID)).limit(1))

    return (
        <ClientPage userID={userID} username={user.name} documentID={parseInt(params.documentID)}/>
    );
}