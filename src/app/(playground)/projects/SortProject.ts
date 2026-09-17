import type { Project } from "@/types/Project";

export function sortProjects(projects: Project[]): Project[] {
  return [...projects].sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;

    const aDate = a.published_at ?? a.updated_at;
    const bDate = b.published_at ?? b.updated_at;
    return new Date(bDate).getTime() - new Date(aDate).getTime();
  });
}