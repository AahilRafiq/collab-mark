import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export function protectRoute(req: NextRequest) {
  if (cookies().get("auth_token") === undefined) {
    return NextResponse.redirect(new URL("/auth/signin", req.url))
  }
}