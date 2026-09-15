import Container from "@/components/Container";
import PageHeading from "@/components/Heading";
import { newsreader } from "@/libs/Fonts";
import Link from "next/link";
import React from "react";

const WRITINGS: {
  title: string;
  date: string;
  excerpt: string;
  href: string;
}[] = [
  {
    title: "Judul tulisan",
    date: "Sep 2026",
    excerpt: "Satu-dua kalimat ringkasan.",
    href: "/writings/slug",
  },
];

export default function WritingsPage() {
  return (
    <Container className="space-y-10 py-20">
      <PageHeading
        title="Writings"
        description="Notes, thoughts, and things I'm learning."
      />

      {WRITINGS.length === 0 ? (
        <p className="text-sm text-zinc-500">
          Nothing published yet — first post is coming soon.
        </p>
      ) : (
        <ul className="divide-y divide-zinc-900">
          {WRITINGS.map((post) => (
            <li key={post.title} className="py-6 first:pt-0">
              <Link
                href={post.href}
                className="group flex items-baseline justify-between gap-4"
              >
                <span className="font-medium text-zinc-100 transition-colors group-hover:text-zinc-400">
                  {post.title}
                </span>
                <span className="shrink-0 text-sm text-zinc-500">
                  {post.date}
                </span>
              </Link>
              <p className="mt-1 text-sm text-zinc-500">{post.excerpt}</p>
            </li>
          ))}
        </ul>
      )}
    </Container>
  );
}
