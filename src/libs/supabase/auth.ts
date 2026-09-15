import { createClient } from "@/libs/supabase/server";

export async function getAdminUser() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) return null;

  const userId = data.claims.sub as string;
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();

  if (profile?.role !== "admin") return null;

  return { id: userId, email: data.claims.email as string };
}