import Link from "next/link";
import type { Project } from "@/types/Project";
import ProjectRowActions from "./ProjectRowActions";
import ProjectSummary from "./ProjectSummary";

export default function ProjectsList({
  projects,
  admin,
}: {
  projects: Project[];
  admin: boolean;
}) {
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2">
      {projects.map((project) => (
        <div key={project.id}>
          <Link href={`/projects/${project.slug}`} className="group block">
            {project.cover_image ? (
              <div className="overflow-hidden rounded-lg border border-zinc-900 transition-colors group-hover:border-zinc-700">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={project.cover_image}
                  alt={project.title}
                  className="aspect-[4/3] w-full object-cover"
                />
              </div>
            ) : null}

            <div className="mt-3 flex items-baseline justify-between gap-3">
              <span className="font-medium text-zinc-100 transition-colors group-hover:text-zinc-400">
                {project.title}
              </span>
              {project.year ? (
                <span className="shrink-0 text-sm text-zinc-500">
                  {project.year}
                </span>
              ) : null}
            </div>
            <ProjectSummary summary={project.summary} />
          </Link>

          {admin ? (
            <div className="mt-2 flex items-center gap-3 text-xs">
              <span
                className={
                  project.published
                    ? "text-emerald-400"
                    : "rounded border border-zinc-500 bg-zinc-800 px-1 text-zinc-300"
                }
              >
                {project.published ? "Published" : "Draft"}
              </span>
              {project.featured ? (
                <span className="text-zinc-500">★ Featured</span>
              ) : null}
              <Link
                href={`/projects/${project.slug}/edit`}
                className="text-zinc-500 transition-colors hover:text-zinc-300"
              >
                Edit
              </Link>
              <ProjectRowActions
                id={project.id}
                slug={project.slug}
                published={project.published}
                featured={project.featured}
              />
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
