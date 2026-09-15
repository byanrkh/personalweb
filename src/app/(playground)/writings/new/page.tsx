import { redirect } from "next/navigation";
import Container from "@/components/Container";
import PageHeading from "@/components/Heading";
import { getAdminUser } from "@/libs/supabase/auth";
import WritingForm from "../WritingForm";
import { createWriting } from "../actions";

export default async function NewWritingPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const admin = await getAdminUser();
  if (!admin) {
    redirect("/writings");
  }

  const { error } = await searchParams;

  return (
    <Container className="space-y-10 py-20">
      <PageHeading
        title="New Writing"
        description="Draft a new piece. Save it as a draft or publish right away."
      />
      <WritingForm action={createWriting} error={error} />
    </Container>
  );
}
