import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { JwtPayload } from 'jsonwebtoken';

export type jwtPayload = {
    id:number,
    name:string,
}

export function generateToken(payload: jwtPayload ) {
    const token =  jwt.sign(payload , process.env.JWT_AUTH_SECRET , {
        expiresIn : '10 days'
    })
    return token
}
export function verifyToken(token:string) {
    const payload: JwtPayload = jwt.verify(token , process.env.JWT_AUTH_SECRET) as JwtPayload;
    return payload;
}

export function getServerSession() {
    let data = cookies().get('auth_token')
    if(data === undefined) return null
    const userdata = jwt.verify(data.value , process.env.JWT_AUTH_SECRET)
    return userdata
}