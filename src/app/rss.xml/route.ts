import { NextResponse } from "next/server";
import { parse } from "marked";
import { createClient } from "@/libs/supabase/server";
import { sortWritings } from "@/libs/Articles/SortWriting";
import type { Writing } from "@/types/Writing";

export const runtime = "nodejs";
export const revalidate = 3600;

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://byanrkh.com").replace(
  /\/$/,
  "",
);
const SITE_TITLE = "Abyan Raditya";
const SITE_DESCRIPTION =
  "Personal site of Abyan Raditya — builder, developer, and product tinkerer.";
const MAX_ITEMS = 30;

function escapeXml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function markdownToHtml(content: string): string {
  return parse(content, { async: false }) as string;
}

function buildItem(post: Writing): string {
  const url = `${SITE_URL}/writings/${post.slug}`;
  const pubDate = new Date(post.published_at ?? post.updated_at).toUTCString();
  const categories = post.tags
    .map((tag) => `<category>${escapeXml(tag)}</category>`)
    .join("");

  return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(post.excerpt)}</description>
      ${categories}
      <content:encoded><![CDATA[${markdownToHtml(post.content)}]]></content:encoded>
    </item>`;
}

export async function GET() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("writings")
    .select("*")
    .eq("published", true);

  if (error) {
    console.error("Failed to load writings for RSS feed:", error.message);
  }

  const items = sortWritings((data ?? []) as Writing[]).slice(0, MAX_ITEMS);

  const lastBuildDate = items[0]
    ? new Date(items[0].published_at ?? items[0].updated_at).toUTCString()
    : new Date().toUTCString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escapeXml(SITE_TITLE)}</title>
    <link>${SITE_URL}</link>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>en-us</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    ${items.map(buildItem).join("")}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control":
        "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}