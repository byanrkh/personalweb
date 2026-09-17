import { notFound } from "next/navigation";
import Link from "next/link";
import Container from "@/components/Container";
import PageHeading from "@/components/Heading";
import Markdown from "@/components/Articles/Markdown";
import { getAdminUser } from "@/libs/supabase/auth";
import { createClient } from "@/libs/supabase/server";
import { formatDate } from "@/libs/Articles/Format";
import { formatReadingTime } from "@/libs/Articles/ReadingTime";
import { formatViews } from "@/libs/ViewCount";
import { slugify } from "@/libs/Articles/Slug";
import type { Writing } from "@/types/Writing";
import ViewTracker from "@/components/ViewTracker";
import { Eye } from "react-feather";

export default async function WritingDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const admin = await getAdminUser();
  const supabase = await createClient();

  const { data } = await supabase
    .from("writings")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  const post = data as Writing | null;

  if (!post) {
    notFound();
  }

  if (!post.published && !admin) {
    notFound();
  }

  return (
    <Container className="space-y-10 py-20">
      <div className="space-y-4">
        {!post.published ? (
          <span className="inline-block rounded-full border border-zinc-800 px-2 py-0.5 text-xs text-zinc-500">
            Draft
          </span>
        ) : null}

        <PageHeading title={post.title} />

        <div className="flex items-center gap-4 text-sm text-zinc-500">
          <span>{formatDate(post.published_at ?? post.updated_at)}</span>
          <span className="text-xs text-zinc-500">•</span>
          <span className="text-xs text-zinc-500">
            {formatReadingTime(post.content)}
          </span>
          <span className="text-xs text-zinc-500">•</span>
          <span className="text-xs text-zinc-500 flex gap-1 items-center">
            <Eye size={10} />
            {formatViews(post.views_count)}
          </span>
        </div>

        {post.tags?.length ? (
          <ul className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <li key={tag}>
                <Link
                  href={`/writings/tags/${slugify(tag)}`}
                  className="inline-block rounded-lg border border-zinc-800 px-3 py-1 text-xs text-zinc-400 transition-colors hover:border-zinc-600 hover:text-zinc-200"
                >
                  {tag}
                </Link>
              </li>
            ))}
          </ul>
        ) : null}

        {admin ? (
          <Link
            href={`/writings/${post.slug}/edit`}
            className="inline-block text-sm text-zinc-500 underline decoration-dashed underline-offset-4 hover:text-zinc-200"
          >
            Edit this writing
          </Link>
        ) : null}
      </div>

      {post.published ? <ViewTracker slug={post.slug} /> : null}

      <Markdown content={post.content} />
    </Container>
  );
}
