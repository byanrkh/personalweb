"use client";

import { useTransition } from "react";
import { deleteWriting, togglePublish } from "./actions";

export default function WritingRowActions({
  id,
  slug,
  published,
}: {
  id: string;
  slug: string;
  published: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm(`Delete "${slug}"? This cannot be undone.`)) return;
    startTransition(() => {
      deleteWriting(id);
    });
  }

  function handleTogglePublish() {
    startTransition(() => {
      togglePublish(id, !published);
    });
  }

  return (
    <>
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
        onClick={handleDelete}
        disabled={isPending}
        className="text-xs text-zinc-500 transition-colors hover:text-red-400 disabled:opacity-50"
      >
        Delete
      </button>
    </>
  );
}
