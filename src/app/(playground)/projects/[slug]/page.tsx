import { notFound } from "next/navigation";
import Link from "next/link";
import Container from "@/components/Container";
import Markdown from "@/components/Articles/Markdown";
import { getAdminUser } from "@/libs/supabase/auth";
import { createClient } from "@/libs/supabase/server";
import { newsreader } from "@/libs/Fonts";
import type { Project } from "@/types/Project";
import { ArrowUpRight, GitHub } from "react-feather";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const admin = await getAdminUser();
  const supabase = await createClient();

  const { data } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  const project = data as Project | null;

  if (!project) {
    notFound();
  }

  if (!project.published && !admin) {
    notFound();
  }

  return (
    <Container className="max-w-3xl space-y-10 py-20">
      <div className="flex items-center justify-between">
        <Link
          href="/projects"
          className="inline-block text-sm text-zinc-500 underline decoration-dashed underline-offset-4 hover:text-zinc-200"
        >
          ← Back to Projects
        </Link>

        {admin ? (
          <Link
            href={`/projects/${project.slug}/edit`}
            className="text-sm text-zinc-500 underline decoration-dashed underline-offset-4 hover:text-zinc-200"
          >
            Edit
          </Link>
        ) : null}
      </div>

      {project.cover_image ? (
        <div className="overflow-hidden rounded-xl border border-zinc-900">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.cover_image}
            alt={project.title}
            className="aspect-video w-full object-cover"
          />
        </div>
      ) : null}

      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          {!project.published ? (
            <span className="rounded-full border border-zinc-800 px-2 py-0.5 text-xs text-zinc-500">
              Draft
            </span>
          ) : null}
          {project.featured ? (
            <span className="rounded-full border border-emerald-900 bg-emerald-950/50 px-2 py-0.5 text-xs text-emerald-400">
              Featured
            </span>
          ) : null}
          {project.year ? (
            <span className="text-sm text-zinc-500">{project.year}</span>
          ) : null}
        </div>

        <h1 className={`text-4xl italic text-zinc-50 ${newsreader.className}`}>
          {project.title}
        </h1>

        {project.summary ? (
          <p className="max-w-xl text-base text-zinc-400">{project.summary}</p>
        ) : null}

        {project.stack?.length ? (
          <ul className="flex flex-wrap gap-2">
            {project.stack.map((item) => (
              <li
                key={item}
                className="rounded-md border border-zinc-800 px-2.5 py-1 text-xs text-zinc-400"
              >
                {item}
              </li>
            ))}
          </ul>
        ) : null}

        <div className="flex flex-wrap items-center gap-3 pt-2">
          {project.project_url ? (
            <Link
              href={project.project_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-300"
            >
              Visit site <ArrowUpRight size={14} />
            </Link>
          ) : null}
          {project.repo_url ? (
            <Link
              href={project.repo_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 px-4 py-2 text-sm text-zinc-300 transition-colors hover:border-zinc-600"
            >
              <GitHub size={14} /> View source
            </Link>
          ) : null}
        </div>
      </div>

      {project.content ? (
        <div className="space-y-6 border-t border-zinc-900 pt-10">
          <Markdown content={project.content} />
        </div>
      ) : null}
    </Container>
  );
}
