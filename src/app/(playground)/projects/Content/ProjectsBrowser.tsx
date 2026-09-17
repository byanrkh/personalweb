"use client";

import { useMemo, useState } from "react";
import { Search } from "react-feather";
import type { Project } from "@/types/Project";
import ProjectsList from "./ProjectsList";

export default function ProjectsBrowser({
  projects,
  admin,
  emptyMessage = "Belum ada project.",
}: {
  projects: Project[];
  admin: boolean;
  emptyMessage?: string;
}) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return projects;

    return projects.filter((project) => {
      const haystack = [
        project.title,
        project.summary,
        ...(project.stack ?? []),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [projects, query]);

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
          placeholder="Search projects..."
          className="w-full rounded-lg border border-zinc-800 bg-transparent py-2 pl-9 pr-3 text-sm text-zinc-100 outline-none focus-visible:border-zinc-600"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-zinc-500">
          {query ? `Search not found, "${query}".` : emptyMessage}
        </p>
      ) : (
        <ProjectsList projects={filtered} admin={admin} />
      )}
    </div>
  );
}
