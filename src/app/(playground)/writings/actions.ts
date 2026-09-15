"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/libs/supabase/server";
import { getAdminUser } from "@/libs/supabase/auth";
import { slugify } from "@/libs/Slug";

async function requireAdmin() {
  const admin = await getAdminUser();
  if (!admin) {
    redirect("/writings");
  }
  return admin;
}

async function ensureUniqueSlug(
  slug: string,
  excludeId?: string,
): Promise<boolean> {
  const supabase = await createClient();
  let query = supabase.from("writings").select("id").eq("slug", slug);
  if (excludeId) {
    query = query.neq("id", excludeId);
  }
  const { data } = await query.maybeSingle();
  return !data;
}

function parseTags(raw: string): string[] {
  return raw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

export async function createWriting(formData: FormData) {
  await requireAdmin();

  const title = ((formData.get("title") as string) ?? "").trim();
  const excerpt = ((formData.get("excerpt") as string) ?? "").trim();
  const content = ((formData.get("content") as string) ?? "").trim();
  const tags = parseTags((formData.get("tags") as string) ?? "");
  const intent = formData.get("intent") as string; // "draft" | "publish"
  const publish = intent === "publish";

  const rawSlug = ((formData.get("slug") as string) || title).trim();
  const slug = slugify(rawSlug);

  if (!title || !excerpt || !content || !slug) {
    redirect(
      `/writings/new?error=${encodeURIComponent(
        "Title, slug, excerpt, and content are required.",
      )}`,
    );
  }

  const unique = await ensureUniqueSlug(slug);
  if (!unique) {
    redirect(
      `/writings/new?error=${encodeURIComponent(
        `Slug "${slug}" is already in use.`,
      )}`,
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.from("writings").insert({
    title,
    slug,
    excerpt,
    content,
    tags,
    published: publish,
    published_at: publish ? new Date().toISOString() : null,
  });

  if (error) {
    redirect(`/writings/new?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/writings");
  revalidatePath("/writings/drafts");
  redirect(`/writings/${slug}`);
}

export async function updateWriting(originalSlug: string, formData: FormData) {
  await requireAdmin();

  const title = ((formData.get("title") as string) ?? "").trim();
  const excerpt = ((formData.get("excerpt") as string) ?? "").trim();
  const content = ((formData.get("content") as string) ?? "").trim();
  const tags = parseTags((formData.get("tags") as string) ?? "");
  const intent = formData.get("intent") as string; // "save" | "publish" | "unpublish"

  const rawSlug = ((formData.get("slug") as string) || title).trim();
  const slug = slugify(rawSlug);

  if (!title || !excerpt || !content || !slug) {
    redirect(
      `/writings/${originalSlug}/edit?error=${encodeURIComponent(
        "Title, slug, excerpt, and content are required.",
      )}`,
    );
  }

  const supabase = await createClient();

  const { data: existing, error: fetchError } = await supabase
    .from("writings")
    .select("id, published, published_at")
    .eq("slug", originalSlug)
    .single();

  if (fetchError || !existing) {
    redirect(
      `/writings/drafts?error=${encodeURIComponent("Writing not found.")}`,
    );
  }

  if (slug !== originalSlug) {
    const unique = await ensureUniqueSlug(slug, existing.id);
    if (!unique) {
      redirect(
        `/writings/${originalSlug}/edit?error=${encodeURIComponent(
          `Slug "${slug}" is already in use.`,
        )}`,
      );
    }
  }

  const nextPublished =
    intent === "publish" ? true : intent === "unpublish" ? false : existing.published;

  // Only set published_at the first time a writing goes live.
  const published_at =
    nextPublished && !existing.published_at
      ? new Date().toISOString()
      : existing.published_at;

  const { error } = await supabase
    .from("writings")
    .update({
      title,
      slug,
      excerpt,
      content,
      tags,
      published: nextPublished,
      published_at,
    })
    .eq("id", existing.id);

  if (error) {
    redirect(
      `/writings/${originalSlug}/edit?error=${encodeURIComponent(error.message)}`,
    );
  }

  revalidatePath("/writings");
  revalidatePath("/writings/drafts");
  revalidatePath(`/writings/${originalSlug}`);
  revalidatePath(`/writings/${slug}`);
  redirect(`/writings/${slug}`);
}

export async function deleteWriting(id: string) {
  await requireAdmin();

  const supabase = await createClient();
  await supabase.from("writings").delete().eq("id", id);

  revalidatePath("/writings");
  revalidatePath("/writings/drafts");
}

export async function togglePublish(id: string, publish: boolean) {
  await requireAdmin();

  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("writings")
    .select("published_at")
    .eq("id", id)
    .single();

  const published_at =
    publish && !existing?.published_at
      ? new Date().toISOString()
      : (existing?.published_at ?? null);

  await supabase.from("writings").update({ published: publish, published_at }).eq("id", id);

  revalidatePath("/writings");
  revalidatePath("/writings/drafts");
}