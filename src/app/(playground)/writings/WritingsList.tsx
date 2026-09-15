import Link from "next/link";
import { formatDate } from "@/libs/Format";
import { formatReadingTime } from "@/libs/ReadingTime";
import type { Writing } from "@/types/Writing";
import WritingRowActions from "./WritingRowActions";

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
                        : "text-xs text-zinc-500"
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
          <div className="mt-1 flex items-center gap-4">
            <p className="text-sm text-zinc-500">{writing.excerpt}</p>
            <span className="text-xs text-zinc-500">•</span>
            <p className="text-xs text-zinc-500">
              {formatReadingTime(writing.content)}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
