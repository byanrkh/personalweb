"use client";

import { useState, useTransition } from "react";
import ConfirmDialog from "@/components/ConfirmDialog";
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
  const [confirmOpen, setConfirmOpen] = useState(false);

  function handleDelete() {
    startTransition(() => {
      deleteWriting(id);
      setConfirmOpen(false);
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
        onClick={() => setConfirmOpen(true)}
        disabled={isPending}
        className="text-xs text-zinc-500 transition-colors hover:text-red-400 disabled:opacity-50"
      >
        Delete
      </button>

      <ConfirmDialog
        open={confirmOpen}
        title={`Delete "${slug}"?`}
        description="Tulisan ini akan dihapus permanen dan tidak bisa dikembalikan."
        confirmLabel="Delete"
        destructive
        pending={isPending}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}
