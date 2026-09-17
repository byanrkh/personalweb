import { redirect } from "next/navigation";
import Container from "@/components/Container";
import PageHeading from "@/components/Heading";
import { getAdminUser } from "@/libs/supabase/auth";
import { createClient } from "@/libs/supabase/server";
import { sortWritings } from "@/libs/Articles/SortWriting";
import type { Writing } from "@/types/Writing";
import AdminWritingsNav from "../Content/AdminWritingsNav";
import WritingsBrowser from "../Content/WritingsBrowser";

export default async function DraftsPage() {
  const admin = await getAdminUser();
  if (!admin) {
    redirect("/writings");
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("writings")
    .select("*")
    .eq("published", false);

  if (error) {
    console.error("Failed to load drafts:", error.message);
  }

  const items = sortWritings((data ?? []) as Writing[]);

  return (
    <Container className="space-y-10 py-20">
      <PageHeading
        title="Writings"
        description="Notes, thoughts, and things I'm learning."
      />

      <AdminWritingsNav active="drafts" />

      <WritingsBrowser
        writings={items}
        admin
        emptyMessage="No drafts right now."
      />
    </Container>
  );
}
