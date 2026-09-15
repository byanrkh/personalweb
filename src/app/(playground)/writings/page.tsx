import Container from "@/components/Container";
import PageHeading from "@/components/Heading";
import { getAdminUser } from "@/libs/supabase/auth";
import { createClient } from "@/libs/supabase/server";
import { sortWritings } from "@/libs/SortWriting";
import type { Writing } from "@/types/Writing";
import AdminWritingsNav from "./AdminWritingsNav";
import WritingsList from "./WritingsList";
import React from "react";

export default async function WritingsPage() {
  const admin = await getAdminUser();
  const supabase = await createClient();

  let query = supabase.from("writings").select("*");
  if (!admin) {
    // Defense in depth: RLS already restricts this, but keep it explicit.
    query = query.eq("published", true);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Failed to load writings:", error.message);
  }

  const items = sortWritings((data ?? []) as Writing[]);

  return (
    <Container className="space-y-10 py-20">
      <PageHeading
        title="Writings"
        description="Notes, thoughts, and things I'm learning."
      />

      {admin ? <AdminWritingsNav active="all" /> : null}

      {items.length === 0 ? (
        <p className="text-sm text-zinc-500">
          Nothing published yet — first post is coming soon.
        </p>
      ) : (
        <WritingsList writings={items} admin={!!admin} />
      )}
    </Container>
  );
}
