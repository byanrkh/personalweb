"use client";

import { useState } from "react";
import Link from "next/link";
import { slugify } from "@/libs/Articles/Slug";
import type { Project } from "@/types/Project";
import MarkdownEditor from "@/components/Articles/MarkdownEditor";
import TagsInput from "@/components/Articles/TagsInput";
import CoverImageInput from "./CoverImageInput";

type Props = {
  action: (formData: FormData) => void;
  error?: string;
  defaultValues?: Project;
  isEdit?: boolean;
};

export default function ProjectForm({
  action,
  error,
  defaultValues,
  isEdit,
}: Props) {
  const [title, setTitle] = useState(defaultValues?.title ?? "");
  const [slug, setSlug] = useState(defaultValues?.slug ?? "");
  const [slugEdited, setSlugEdited] = useState(!!defaultValues);

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugEdited) {
      setSlug(slugify(value));
    }
  }

  function handleSlugChange(value: string) {
    setSlugEdited(true);
    setSlug(value);
  }

  const isPublished = !!defaultValues?.published;

  return (
    <form action={action} className="space-y-6">
      <Link
        href="/projects"
        className="inline-block text-sm text-zinc-500 underline decoration-dashed underline-offset-4 hover:text-zinc-200"
      >
        ← Back to Projects
      </Link>

      {error ? <p className="text-sm text-red-400">{error}</p> : null}

      <div className="space-y-1.5">
        <label htmlFor="title" className="text-sm text-zinc-500">
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          className="w-full rounded-lg border border-zinc-800 bg-transparent px-3 py-2 text-sm text-zinc-100 outline-none focus-visible:border-zinc-600"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="slug" className="text-sm text-zinc-500">
          Slug
        </label>
        <input
          id="slug"
          name="slug"
          type="text"
          value={slug}
          onChange={(e) => handleSlugChange(e.target.value)}
          className="w-full rounded-lg border border-zinc-800 bg-transparent px-3 py-2 text-sm text-zinc-100 outline-none focus-visible:border-zinc-600"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="summary" className="text-sm text-zinc-500">
          Summary
        </label>
        <textarea
          id="summary"
          name="summary"
          rows={2}
          defaultValue={defaultValues?.summary}
          placeholder="Satu-dua kalimat tentang project ini"
          className="w-full rounded-lg border border-zinc-800 bg-transparent px-3 py-2 text-sm text-zinc-100 outline-none focus-visible:border-zinc-600"
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="project_url" className="text-sm text-zinc-500">
            Live URL <span className="text-zinc-600">(opsional)</span>
          </label>
          <input
            id="project_url"
            name="project_url"
            type="url"
            defaultValue={defaultValues?.project_url ?? ""}
            placeholder="https://example.com"
            className="w-full rounded-lg border border-zinc-800 bg-transparent px-3 py-2 text-sm text-zinc-100 outline-none focus-visible:border-zinc-600"
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="repo_url" className="text-sm text-zinc-500">
            Repo URL <span className="text-zinc-600">(opsional)</span>
          </label>
          <input
            id="repo_url"
            name="repo_url"
            type="url"
            defaultValue={defaultValues?.repo_url ?? ""}
            placeholder="https://github.com/username/repo"
            className="w-full rounded-lg border border-zinc-800 bg-transparent px-3 py-2 text-sm text-zinc-100 outline-none focus-visible:border-zinc-600"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="year" className="text-sm text-zinc-500">
          Year <span className="text-zinc-600">(opsional)</span>
        </label>
        <input
          id="year"
          name="year"
          type="number"
          defaultValue={defaultValues?.year ?? new Date().getFullYear()}
          className="w-full max-w-[140px] rounded-lg border border-zinc-800 bg-transparent px-3 py-2 text-sm text-zinc-100 outline-none focus-visible:border-zinc-600"
        />
      </div>

      <TagsInput
        id="stack"
        name="stack"
        label="Stack"
        defaultValue={defaultValues?.stack ?? []}
        placeholder="nextjs typescript supabase"
      />

      <CoverImageInput
        id="cover_image"
        name="cover_image"
        defaultValue={defaultValues?.cover_image}
      />

      <label className="flex items-center gap-2 text-sm text-zinc-400">
        <input
          type="checkbox"
          name="featured"
          defaultChecked={defaultValues?.featured}
          className="h-4 w-4 rounded border-zinc-700 bg-transparent accent-zinc-100"
        />
        Pin as featured
      </label>

      <MarkdownEditor
        id="content"
        name="content"
        label="Case study (opsional)"
        defaultValue={defaultValues?.content}
        rows={14}
      />

      <div className="flex items-center gap-3">
        {isEdit ? (
          <>
            <button
              type="submit"
              name="intent"
              value="save"
              formNoValidate
              className="rounded-lg border border-zinc-800 px-3 py-2 text-sm text-zinc-300 transition-colors hover:border-zinc-600"
            >
              Save changes
            </button>
            {isPublished ? (
              <button
                type="submit"
                name="intent"
                value="unpublish"
                formNoValidate
                className="rounded-lg border border-zinc-800 px-3 py-2 text-sm text-zinc-300 transition-colors hover:border-zinc-600"
              >
                Unpublish
              </button>
            ) : (
              <button
                type="submit"
                name="intent"
                value="publish"
                className="rounded-lg bg-zinc-100 px-3 py-2 text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-300"
              >
                Publish
              </button>
            )}
          </>
        ) : (
          <>
            <button
              type="submit"
              name="intent"
              value="draft"
              formNoValidate
              className="rounded-lg border border-zinc-800 px-3 py-2 text-sm text-zinc-300 transition-colors hover:border-zinc-600"
            >
              Save as Draft
            </button>
            <button
              type="submit"
              name="intent"
              value="publish"
              className="rounded-lg bg-zinc-100 px-3 py-2 text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-300"
            >
              Publish
            </button>
          </>
        )}
      </div>
    </form>
  );
}
