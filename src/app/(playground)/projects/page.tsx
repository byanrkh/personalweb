import Container from "@/components/Container";
import PageHeading from "@/components/Heading";
import { getAdminUser } from "@/libs/supabase/auth";
import Link from "next/link";
import React from "react";

const PROJECTS = [
  {
    title: "byanrkh.dev",
    year: "2026",
    description:
      "This site — a small, ongoing playground for trying out ideas in public.",
    href: "https://github.com/byanrkh",
  },
  {
    title: "Project name",
    year: "2025",
    description: "One line describing what it does and why it exists.",
    href: "#",
  },
  {
    title: "Project name",
    year: "2024",
    description: "One line describing what it does and why it exists.",
    href: "#",
  },
];

export default async function ProjectsPage() {
  const admin = await getAdminUser();

  return (
    <Container className="space-y-10 py-20">
      <div className="flex items-start justify-between gap-4">
        <PageHeading
          title="Projects"
          description="A few things I've built and shipped."
        />
        {admin ? (
          <button className="shrink-0 rounded-lg border border-zinc-800 px-3 py-1.5 text-sm text-zinc-300 transition-colors hover:border-zinc-600">
            + Add Project
          </button>
        ) : null}
      </div>

      <ul className="divide-y divide-zinc-900">
        {PROJECTS.map((project, idx) => (
          <li key={idx} className="py-6 first:pt-0">
            <div className="flex items-baseline justify-between gap-4">
              <Link
                href={project.href}
                target="_blank"
                rel="noreferrer"
                className="group"
              >
                <span className="font-medium text-zinc-100 transition-colors group-hover:text-zinc-400">
                  {project.title}
                </span>
              </Link>
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
                <span className="text-sm text-zinc-500">{project.year}</span>
              </div>
            </div>
            <p className="mt-1 text-sm text-zinc-500">{project.description}</p>
          </li>
        ))}
      </ul>
    </Container>
  );
}
