import Link from "next/link";
import { formatDate } from "@/libs/Articles/Format";
import { formatReadingTime } from "@/libs/Articles/ReadingTime";
import { slugify } from "@/libs/Articles/Slug";
import type { Writing } from "@/types/Writing";
import WritingRowActions from "./WritingRowActions";
import { formatViews } from "@/libs/ViewCount";
import { Eye } from "react-feather";

export default function WritingsList({
  writings,
  admin,
}: {
  writings: Writing[];
  admin: boolean;
}) {
  return (
    <ul className="divide-y divide-zinc-900">
      {writings.map((writing) => (
        <li key={writing.id} className="py-6 first:pt-0">
          <div className="flex items-baseline justify-between gap-4">
            <Link href={`/writings/${writing.slug}`} className="group">
              <span className="font-medium text-zinc-100 transition-colors group-hover:text-zinc-400">
                {writing.title}
              </span>
            </Link>
            <div className="flex shrink-0 items-center gap-3">
              {admin ? (
                <>
                  <span
                    className={
                      writing.published
                        ? "text-xs text-emerald-400"
                        : "text-xs text-zinc-300 rounded bg-zinc-800 px-1 border border-zinc-500"
                    }
                  >
                    {writing.published ? "Published" : "Draft"}
                  </span>
                  <Link
                    href={`/writings/${writing.slug}/edit`}
                    className="text-xs text-zinc-500 transition-colors hover:text-zinc-300"
                  >
                    Edit
                  </Link>
                  <WritingRowActions
                    id={writing.id}
                    slug={writing.slug}
                    published={writing.published}
                  />
                </>
              ) : null}
              <span className="text-sm text-zinc-500">
                {formatDate(writing.published_at ?? writing.updated_at)}
              </span>
            </div>
          </div>
          <div className="mt-1 flex items-center gap-3">
            <p className="text-sm text-zinc-500">{writing.excerpt}</p>
            <span className="text-xs text-zinc-500">•</span>
            <p className="text-xs text-zinc-500">
              {formatReadingTime(writing.content)}
            </p>
            <span className="text-xs text-zinc-500">•</span>
            <p className="text-xs text-zinc-500 flex items-center gap-1">
              <Eye size={10} /> {formatViews(writing.views_count)}
            </p>
          </div>

          {writing.tags?.length ? (
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {writing.tags.map((tag) => (
                <li key={tag}>
                  <Link
                    href={`/writings/tags/${slugify(tag)}`}
                    className="inline-block rounded-md border border-zinc-800 px-2 py-0.5 text-xs text-zinc-500 transition-colors hover:border-zinc-600 hover:text-zinc-200"
                  >
                    {tag}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
