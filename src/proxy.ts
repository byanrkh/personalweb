import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export const VISITOR_COOKIE = "vid";
const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  // Read this BEFORE the Supabase auth logic below has a chance to touch
  // request.cookies, so it reflects what the browser actually sent.
  const hasVisitorId = request.cookies.has(VISITOR_COOKIE);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  await supabase.auth.getClaims();

  // Anonymous, server-issued visitor id for the view-counter cooldown.
  // Deliberately HttpOnly: unlike localStorage, it can't be read, copied,
  // or cleared from page JavaScript — clearing browser cookies entirely
  // is the only way around it, same as any other anonymous analytics
  // cookie. `setAll` above may have reassigned `response`, so this always
  // sets on whichever response object is about to be returned.
  if (!hasVisitorId) {
    response.cookies.set(VISITOR_COOKIE, crypto.randomUUID(), {
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
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};