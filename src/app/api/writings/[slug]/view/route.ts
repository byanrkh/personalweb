import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { randomUUID } from "crypto";
import { createClient } from "@/libs/supabase/server";
import { checkIpRateLimit } from "@/libs/ViewRateLimit";
import { VISITOR_COOKIE } from "@/proxy";

export const runtime = "nodejs";

const COOLDOWN_MINUTES = 30;
const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

type RpcResult = {
  views_count: number;
  counted: boolean;
  rate_limited: boolean;
};

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  // --- Layer 0: cheap IP throttle, rejects obvious floods before we even
  //     touch the database. See ViewRateLimit.ts for why this is only a
  //     secondary signal, not the real defense. ---
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  if (!checkIpRateLimit(ip)) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }

  // --- Anonymous visitor id: read the cookie middleware already set; if
  //     it's somehow missing (e.g. middleware config changes later), fall
  //     back to minting one here so this endpoint stays correct on its own. ---
  const cookieStore = await cookies();
  const existingVisitorId = cookieStore.get(VISITOR_COOKIE)?.value ?? null;
  const visitorId = existingVisitorId ?? randomUUID();

  // --- The only place views_count ever changes: a SECURITY DEFINER RPC.
  //     There is no endpoint anywhere that accepts a raw "views + 1". ---
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("record_writing_view", {
    p_slug: slug,
    p_visitor_id: visitorId,
    p_cooldown_minutes: COOLDOWN_MINUTES,
  });

  if (error) {
    console.error("record_writing_view failed:", error.message);
    return NextResponse.json(
      { error: "Failed to record view." },
      { status: 500 },
    );
  }

  const result = (data?.[0] as RpcResult | undefined) ?? {
    views_count: 0,
    counted: false,
    rate_limited: false,
  };

  const response = NextResponse.json({
    views: Number(result.views_count),
    counted: result.counted,
  });

  if (!existingVisitorId) {
    response.cookies.set(VISITOR_COOKIE, visitorId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: ONE_YEAR_SECONDS,
    });
  }

  return response;
}
