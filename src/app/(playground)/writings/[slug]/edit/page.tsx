import { notFound, redirect } from "next/navigation";
import Container from "@/components/Container";
import PageHeading from "@/components/Heading";
import { getAdminUser } from "@/libs/supabase/auth";
import { createClient } from "@/libs/supabase/server";
import type { Writing } from "@/types/Writing";
import WritingForm from "../../Content/WritingForm";
import { updateWriting } from "../../actions";

export default async function EditWritingPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const admin = await getAdminUser();
  if (!admin) {
    redirect("/writings");
  }

  const { slug } = await params;
  const { error } = await searchParams;

  const supabase = await createClient();
  const { data } = await supabase
    .from("writings")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  const writing = data as Writing | null;

  if (!writing) {
    notFound();
  }

  const boundAction = updateWriting.bind(null, slug);

  return (
    <Container className="space-y-10 py-20">
      <PageHeading
        title="Edit Writing"
        description="Update the content, tags, or publish status."
      />
      <WritingForm
        action={boundAction}
        error={error}
        defaultValues={writing}
        isEdit
      />
    </Container>
  );
}
