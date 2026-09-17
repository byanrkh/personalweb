import Link from "next/link";
import Container from "@/components/Container";
import PageHeading from "@/components/Heading";
import { getAdminUser } from "@/libs/supabase/auth";
import { createClient } from "@/libs/supabase/server";
import { sortWritings } from "@/libs/Articles/SortWriting";
import { slugify } from "@/libs/Articles/Slug";
import type { Writing } from "@/types/Writing";
import WritingsBrowser from "../../Content/WritingsBrowser";

export default async function TagPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
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

  const all = (data ?? []) as Writing[];
  const matching = all.filter((writing) =>
    writing.tags?.some((tag) => slugify(tag) === slug),
  );
  const items = sortWritings(matching);

  // Recover the original casing of the tag (e.g. "Next.js") for display.
  const tagLabel =
    items
      .find((writing) => writing.tags?.length)
      ?.tags.find((tag) => slugify(tag) === slug) ?? slug;

  return (
    <Container className="space-y-10 py-20">
      <div className="space-y-2">
        <Link
          href="/writings"
          className="inline-block text-sm text-zinc-500 underline decoration-dashed underline-offset-4 hover:text-zinc-200"
        >
          ← Back to Writings
        </Link>
        <PageHeading
          title={`#${tagLabel}`}
          description={`Tulisan yang ditandai dengan tag "${tagLabel}".`}
        />
      </div>

      <WritingsBrowser
        writings={items}
        admin={!!admin}
        emptyMessage="Belum ada tulisan dengan tag ini."
      />
    </Container>
  );
}
