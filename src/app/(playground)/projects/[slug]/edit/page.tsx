import { notFound, redirect } from "next/navigation";
import Container from "@/components/Container";
import PageHeading from "@/components/Heading";
import { getAdminUser } from "@/libs/supabase/auth";
import { createClient } from "@/libs/supabase/server";
import type { Project } from "@/types/Project";
import ProjectForm from "../../Content/ProjectForm";
import { updateProject } from "../../action";

export default async function EditProjectPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const admin = await getAdminUser();
  if (!admin) {
    redirect("/projects");
  }

  const { slug } = await params;
  const { error } = await searchParams;

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

  const boundAction = updateProject.bind(null, slug);

  return (
    <Container className="space-y-10 py-20">
      <PageHeading
        title="Edit Project"
        description="Update the details, links, or publish status."
      />
      <ProjectForm
        action={boundAction}
        error={error}
        defaultValues={project}
        isEdit
      />
    </Container>
  );
}
