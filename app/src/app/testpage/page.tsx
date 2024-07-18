import ClientPage from "./pageContent";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth/auth";

export default async function() {

    const token = cookies().get('auth_token');
    const data = verifyToken(token.value);
    const userID = parseInt(data.id)

    return (
        <ClientPage userID={userID}/>
    );
}