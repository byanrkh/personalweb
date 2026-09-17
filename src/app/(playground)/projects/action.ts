"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/libs/supabase/server";
import { getAdminUser } from "@/libs/supabase/auth";
import { slugify } from "@/libs/Articles/Slug";

async function requireAdmin() {
  const admin = await getAdminUser();
  if (!admin) {
    redirect("/projects");
  }
  return admin;
}

async function ensureUniqueSlug(
  slug: string,
  excludeId?: string,
): Promise<boolean> {
  const supabase = await createClient();
  let query = supabase.from("projects").select("id").eq("slug", slug);
  if (excludeId) {
    query = query.neq("id", excludeId);
  }
  const { data } = await query.maybeSingle();
  return !data;
}

function parseList(raw: string): string[] {
  return raw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

function parseOptionalUrl(raw: string): string | null {
  const value = raw.trim();
  return value ? value : null;
}

function parseYear(raw: string): number | null {
  const value = Number.parseInt(raw, 10);
  return Number.isFinite(value) ? value : null;
}

export async function createProject(formData: FormData) {
  await requireAdmin();

  const title = ((formData.get("title") as string) ?? "").trim();
  const summary = ((formData.get("summary") as string) ?? "").trim();
  const content = ((formData.get("content") as string) ?? "").trim();
  const stack = parseList((formData.get("stack") as string) ?? "");
  const projectUrl = parseOptionalUrl((formData.get("project_url") as string) ?? "");
  const repoUrl = parseOptionalUrl((formData.get("repo_url") as string) ?? "");
  const coverImage = parseOptionalUrl((formData.get("cover_image") as string) ?? "");
  const year = parseYear((formData.get("year") as string) ?? "");
  const featured = formData.get("featured") === "on";
  const intent = formData.get("intent") as string; // "draft" | "publish"
  const publish = intent === "publish";

  if (!title) {
    redirect(
      `/projects/new?error=${encodeURIComponent(
        "Title wajib diisi, meskipun masih draft.",
      )}`,
    );
  }

  if (publish && !summary) {
    redirect(
      `/projects/new?error=${encodeURIComponent(
        "Summary wajib diisi sebelum publish.",
      )}`,
    );
  }

  const rawSlug = ((formData.get("slug") as string) || title).trim();
  const slug = slugify(rawSlug) || slugify(`untitled-${Date.now()}`);

  const unique = await ensureUniqueSlug(slug);
  if (!unique) {
    redirect(
      `/projects/new?error=${encodeURIComponent(
        `Slug "${slug}" sudah dipakai.`,
      )}`,
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.from("projects").insert({
    title,
    slug,
    summary,
    content,
    stack,
    project_url: projectUrl,
    repo_url: repoUrl,
    cover_image: coverImage,
    year,
    featured,
    published: publish,
    published_at: publish ? new Date().toISOString() : null,
  });

  if (error) {
    redirect(`/projects/new?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/projects");
  revalidatePath("/projects/drafts");
  redirect(publish ? `/projects/${slug}` : `/projects/${slug}/edit`);
}

export async function updateProject(originalSlug: string, formData: FormData) {
  await requireAdmin();

  const title = ((formData.get("title") as string) ?? "").trim();
  const summary = ((formData.get("summary") as string) ?? "").trim();
  const content = ((formData.get("content") as string) ?? "").trim();
  const stack = parseList((formData.get("stack") as string) ?? "");
  const projectUrl = parseOptionalUrl((formData.get("project_url") as string) ?? "");
  const repoUrl = parseOptionalUrl((formData.get("repo_url") as string) ?? "");
  const coverImage = parseOptionalUrl((formData.get("cover_image") as string) ?? "");
  const year = parseYear((formData.get("year") as string) ?? "");
  const featured = formData.get("featured") === "on";
  const intent = formData.get("intent") as string; // "save" | "publish" | "unpublish"

  if (!title) {
    redirect(
      `/projects/${originalSlug}/edit?error=${encodeURIComponent(
        "Title wajib diisi, meskipun masih draft.",
      )}`,
    );
  }

  const rawSlug = ((formData.get("slug") as string) || title).trim();
  const slug = slugify(rawSlug) || slugify(`untitled-${Date.now()}`);

  const supabase = await createClient();

  const { data: existing, error: fetchError } = await supabase
    .from("projects")
    .select("id, published, published_at")
    .eq("slug", originalSlug)
    .single();

  if (fetchError || !existing) {
    redirect(
      `/projects/drafts?error=${encodeURIComponent("Project not found.")}`,
    );
  }

  const nextPublished =
    intent === "publish" ? true : intent === "unpublish" ? false : existing.published;

  if (nextPublished && !summary) {
    redirect(
      `/projects/${originalSlug}/edit?error=${encodeURIComponent(
        "Summary wajib diisi sebelum publish.",
      )}`,
    );
  }

  if (slug !== originalSlug) {
    const unique = await ensureUniqueSlug(slug, existing.id);
    if (!unique) {
      redirect(
        `/projects/${originalSlug}/edit?error=${encodeURIComponent(
          `Slug "${slug}" sudah dipakai.`,
        )}`,
      );
    }
  }

  const published_at =
    nextPublished && !existing.published_at
      ? new Date().toISOString()
      : existing.published_at;

  const { error } = await supabase
    .from("projects")
    .update({
      title,
      slug,
      summary,
      content,
      stack,
      project_url: projectUrl,
      repo_url: repoUrl,
      cover_image: coverImage,
      year,
      featured,
      published: nextPublished,
      published_at,
    })
    .eq("id", existing.id);

  if (error) {
    redirect(
      `/projects/${originalSlug}/edit?error=${encodeURIComponent(error.message)}`,
    );
  }

  revalidatePath("/projects");
  revalidatePath("/projects/drafts");
  revalidatePath(`/projects/${originalSlug}`);
  revalidatePath(`/projects/${slug}`);
  redirect(intent === "publish" ? `/projects/${slug}` : `/projects/${slug}/edit`);
}

export async function deleteProject(id: string) {
  await requireAdmin();

  const supabase = await createClient();
  await supabase.from("projects").delete().eq("id", id);

  revalidatePath("/projects");
  revalidatePath("/projects/drafts");
}

export async function togglePublish(id: string, publish: boolean) {
  await requireAdmin();

  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("projects")
    .select("published_at")
    .eq("id", id)
    .single();

  const published_at =
    publish && !existing?.published_at
      ? new Date().toISOString()
      : (existing?.published_at ?? null);

  await supabase
    .from("projects")
    .update({ published: publish, published_at })
    .eq("id", id);

  revalidatePath("/projects");
  revalidatePath("/projects/drafts");
}

export async function toggleFeatured(id: string, featured: boolean) {
  await requireAdmin();

  const supabase = await createClient();
  await supabase.from("projects").update({ featured }).eq("id", id);

  revalidatePath("/projects");
  revalidatePath("/projects/drafts");
}