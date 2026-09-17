import { redirect } from "next/navigation";
import Container from "@/components/Container";
import PageHeading from "@/components/Heading";
import { getAdminUser } from "@/libs/supabase/auth";
import ProjectForm from "../Content/ProjectForm";
import { createProject } from "../action";

export default async function NewProjectPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const admin = await getAdminUser();
  if (!admin) {
    redirect("/projects");
  }

  const { error } = await searchParams;

  return (
    <Container className="space-y-10 py-20">
      <PageHeading
        title="New Project"
        description="Add a new project. Save it as a draft or publish right away."
      />
      <ProjectForm action={createProject} error={error} />
    </Container>
  );
}
