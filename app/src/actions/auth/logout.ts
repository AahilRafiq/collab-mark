'use server'
import { cookies } from 'next/headers';

export async function logout() {
    const token = cookies().get('auth_token');
    if (!token) return null;
    cookies().delete('auth_token')
}