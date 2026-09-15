"use client";

import { useState } from "react";
import Link from "next/link";
import { slugify } from "@/libs/Slug";
import type { Writing } from "@/types/Writing";
import MarkdownEditor from "@/components/MarkdownEditor";

type Props = {
  action: (formData: FormData) => void;
  error?: string;
  defaultValues?: Writing;
  isEdit?: boolean;
};

export default function WritingForm({
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
        href="/writings"
        className="inline-block text-sm text-zinc-500 underline decoration-dashed underline-offset-4 hover:text-zinc-200"
      >
        ← Back to Writings
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
        <label htmlFor="excerpt" className="text-sm text-zinc-500">
          Excerpt
        </label>
        <textarea
          id="excerpt"
          name="excerpt"
          rows={2}
          defaultValue={defaultValues?.excerpt}
          placeholder="Ringkasan singkat buat preview di list"
          className="w-full rounded-lg border border-zinc-800 bg-transparent px-3 py-2 text-sm text-zinc-100 outline-none focus-visible:border-zinc-600"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="tags" className="text-sm text-zinc-500">
          Tags <span className="text-zinc-600">(comma separated)</span>
        </label>
        <input
          id="tags"
          name="tags"
          type="text"
          defaultValue={defaultValues?.tags?.join(", ")}
          placeholder="nextjs, supabase, notes"
          className="w-full rounded-lg border border-zinc-800 bg-transparent px-3 py-2 text-sm text-zinc-100 outline-none focus-visible:border-zinc-600"
        />
      </div>

      <MarkdownEditor
        id="content"
        name="content"
        label="Content"
        defaultValue={defaultValues?.content}
        rows={18}
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
