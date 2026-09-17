"use client";

import { useState, useTransition } from "react";
import ConfirmDialog from "@/components/ConfirmDialog";
import { deleteProject, togglePublish, toggleFeatured } from "../action";

export default function ProjectRowActions({
  id,
  slug,
  published,
  featured,
}: {
  id: string;
  slug: string;
  published: boolean;
  featured: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [confirmOpen, setConfirmOpen] = useState(false);

  function handleDelete() {
    startTransition(() => {
      deleteProject(id);
      setConfirmOpen(false);
    });
  }

  function handleTogglePublish() {
    startTransition(() => {
      togglePublish(id, !published);
    });
  }

  function handleToggleFeatured() {
    startTransition(() => {
      toggleFeatured(id, !featured);
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={handleToggleFeatured}
        disabled={isPending}
        className="text-xs text-zinc-500 transition-colors hover:text-zinc-300 disabled:opacity-50"
      >
        {featured ? "Unpin" : "Pin"}
      </button>
      <button
        type="button"
        onClick={handleTogglePublish}
        disabled={isPending}
        className="text-xs text-zinc-500 transition-colors hover:text-zinc-300 disabled:opacity-50"
      >
        {published ? "Unpublish" : "Publish"}
      </button>
      <button
        type="button"
        onClick={() => setConfirmOpen(true)}
        disabled={isPending}
        className="text-xs text-zinc-500 transition-colors hover:text-red-400 disabled:opacity-50"
      >
        Delete
      </button>

      <ConfirmDialog
        open={confirmOpen}
        title={`Delete "${slug}"?`}
        description="Project ini akan dihapus permanen dan tidak bisa dikembalikan."
        confirmLabel="Delete"
        destructive
        pending={isPending}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}
