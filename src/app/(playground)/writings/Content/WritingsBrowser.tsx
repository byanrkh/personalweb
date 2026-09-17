"use client";

import { useMemo, useState } from "react";
import { Search } from "react-feather";
import type { Writing } from "@/types/Writing";
import WritingsList from "./WritingsList";

export default function WritingsBrowser({
  writings,
  admin,
  emptyMessage = "Belum ada tulisan.",
}: {
  writings: Writing[];
  admin: boolean;
  emptyMessage?: string;
}) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return writings;

    return writings.filter((writing) => {
      const haystack = [writing.title, writing.excerpt, ...(writing.tags ?? [])]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [writings, query]);

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search
          size={15}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Articles..."
          className="w-full rounded-lg border border-zinc-800 bg-transparent py-2 pl-9 pr-3 text-sm text-zinc-100 outline-none focus-visible:border-zinc-600"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-zinc-500">
          {query ? `Search not found, "${query}".` : emptyMessage}
        </p>
      ) : (
        <WritingsList writings={filtered} admin={admin} />
      )}
    </div>
  );
}
