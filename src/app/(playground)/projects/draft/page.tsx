import { redirect } from "next/navigation";
import Container from "@/components/Container";
import PageHeading from "@/components/Heading";
import { getAdminUser } from "@/libs/supabase/auth";
import { createClient } from "@/libs/supabase/server";
import { sortProjects } from "@/libs/Projects/SortProject";
import type { Project } from "@/types/Project";
import AdminProjectsNav from "../Content/AdminProjectsNav";
import ProjectsBrowser from "../Content/ProjectsBrowser";

export default async function ProjectDraftsPage() {
  const admin = await getAdminUser();
  if (!admin) {
    redirect("/projects");
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("published", false);

  if (error) {
    console.error("Failed to load draft projects:", error.message);
  }

  const items = sortProjects((data ?? []) as Project[]);

  return (
    <Container className="space-y-10 py-20">
      <PageHeading
        title="Projects"
        description="A few things I've built and shipped."
      />

      <AdminProjectsNav active="drafts" />

      <ProjectsBrowser
        projects={items}
        admin
        emptyMessage="No draft projects right now."
      />
    </Container>
  );
}
