import Container from "@/components/Container";
import PageHeading from "@/components/Heading";
import { getAdminUser } from "@/libs/supabase/auth";
import React from "react";

const WRITINGS: {
  title: string;
  date: string;
  excerpt: string;
  href: string;
}[] = [
  {
    title: "First post",
    date: "Jan 1, 2026",
    excerpt: "This is the first post on this site. More to come!",
    href: "#",
  },
  {
    title: "First post",
    date: "Jan 1, 2026",
    excerpt: "This is the first post on this site. More to come!",
    href: "#",
  },
  {
    title: "First post",
    date: "Jan 1, 2026",
    excerpt: "This is the first post on this site. More to come!",
    href: "#",
  },
];

export default async function WritingsPage() {
  const admin = await getAdminUser();

  return (
    <Container className="space-y-10 py-20">
      <div className="flex items-start justify-between gap-4">
        <PageHeading
          title="Writings"
          description="Notes, thoughts, and things I'm learning."
        />
        {admin ? (
          <button className="shrink-0 rounded-lg border border-zinc-800 px-3 py-1.5 text-sm text-zinc-300 transition-colors hover:border-zinc-600">
            + Add Article
          </button>
        ) : null}
      </div>

      {WRITINGS.length === 0 ? (
        <p className="text-sm text-zinc-500">
          Nothing published yet — first post is coming soon.
        </p>
      ) : (
        <ul className="divide-y divide-zinc-900">
          {WRITINGS.map((post, idx) => (
            <li key={idx} className="py-6 first:pt-0">
              <div className="flex items-baseline justify-between gap-4">
                <a href={post.href} className="group">
                  <span className="font-medium text-zinc-100 transition-colors group-hover:text-zinc-400">
                    {post.title}
                  </span>
                </a>
                <div className="flex shrink-0 items-center gap-3">
                  {admin ? (
                    <>
                      <button className="text-xs text-zinc-500 transition-colors hover:text-zinc-300">
                        Edit
                      </button>
                      <button className="text-xs text-zinc-500 transition-colors hover:text-red-400">
                        Delete
                      </button>
                    </>
                  ) : null}
                  <span className="text-sm text-zinc-500">{post.date}</span>
                </div>
              </div>
              <div className="mt-1 flex items-center gap-4">
                <p className="text-sm text-zinc-500">{post.excerpt}</p>
                <span className="text-xs text-zinc-500">•</span>
                <p className="text-xs text-zinc-500">5 min read</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Container>
  );
}
