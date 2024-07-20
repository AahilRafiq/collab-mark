"use server";
import { actionResponseObj } from "@/lib/helpers/actionResHelpers";
import type { actionRes } from "@/types/serverActionResponse";
import { Users } from "@/db/schema";
import { db } from "@/db/db";
import { eq, or } from "drizzle-orm";
import { cookies } from "next/headers";
import { getFirstRecord } from "@/db/getFirstRecord";
import { generateToken } from "@/lib/auth/auth";
import { hashPassword } from "@/lib/auth/hashPassword";

export async function SignUp(
    username: string,
    email: string,
    password: string,
    confirmPassword: string
): Promise<actionRes> {
    try {
        // Check username length
        if (username.length < 3) {
            return actionResponseObj(false, "Username must be at least 3 characters long");
        }

        // Check password length
        if (password.length < 6) {
            return actionResponseObj(false, "Password must be at least 6 characters long");
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            return actionResponseObj(false, "Passwords don't match");
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return actionResponseObj(false, "Invalid email format");
        }

        // Check if username or email already exists
        const existingUser = getFirstRecord(
            await db
                .select()
                .from(Users)
                .where(or(eq(Users.name, username), eq(Users.email, email)))
        );

        if (existingUser) {
            return actionResponseObj(false, "Username or email already in use");
        }

        const hashedPassword = await hashPassword(password);

        // Insert new user
        const newUser = getFirstRecord(
            await db
                .insert(Users)
                .values({ name: username, email, password: hashedPassword })
                .returning()
        );

        if (!newUser) {
            return actionResponseObj(false, "Failed to create user");
        }

        // Generate and set token
        const token = generateToken({id: newUser.id, name: newUser.name});
        cookies().set('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 // 7 days
        });

        return actionResponseObj(true, "User registered successfully");

    } catch (err) {
        console.error("SignUp error:", err);
        return actionResponseObj(false, 'Internal Server Error');
    }
}