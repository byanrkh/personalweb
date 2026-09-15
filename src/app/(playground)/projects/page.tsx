import Container from "@/components/Container";
import PageHeading from "@/components/Heading";
import { newsreader } from "@/libs/Fonts";
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

export default function ProjectsPage() {
  return (
    <Container className="space-y-10 py-20">
      <PageHeading
        title="Projects"
        description="A few things I've built and shipped."
      />

      <ul className="divide-y divide-zinc-900">
        {PROJECTS.map((project, idx) => (
          <li key={idx} className="py-6 first:pt-0">
            <Link
              href={project.href}
              target="_blank"
              rel="noreferrer"
              className="group flex items-baseline justify-between gap-4"
            >
              <span className="font-medium text-zinc-100 transition-colors group-hover:text-zinc-400">
                {project.title}
              </span>
              <span className="shrink-0 text-sm text-zinc-500">
                {project.year}
              </span>
            </Link>
            <p className="mt-1 text-sm text-zinc-500">{project.description}</p>
          </li>
        ))}
      </ul>
    </Container>
  );
}
