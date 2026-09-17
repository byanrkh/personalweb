import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { randomUUID } from "crypto";

export const VISITOR_COOKIE = "vid";
const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

/**
 * Ensures every visitor has a stable, anonymous, server-issued id cookie.
 *
 * This is deliberately HttpOnly: it can't be read, copied, or cleared from
 * page JavaScript the way a localStorage value can (a bad actor can't just
 * open devtools and reset it per refresh — clearing browser cookies
 * entirely is the only way out, same as it would be for any anonymous
 * analytics cookie).
 */
export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  if (!request.cookies.get(VISITOR_COOKIE)) {
    response.cookies.set(VISITOR_COOKIE, randomUUID(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: ONE_YEAR_SECONDS,
    });
  }

  return response;
}

export const config = {
  matcher: "/((?!_next/static|_next/image|favicon.ico).*)",
};
