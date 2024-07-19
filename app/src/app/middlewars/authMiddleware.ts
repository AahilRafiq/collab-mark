import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export function authMiddleware(req: NextRequest) {
  if (cookies().get("auth_token") !== undefined) {
    return NextResponse.redirect(new URL("/home", req.url))
  }
}