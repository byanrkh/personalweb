"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";

type Props = {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  pending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive = false,
  pending = false,
  onConfirm,
  onCancel,
}: Props) {
  useEffect(() => {
    if (!open) return;

    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onCancel();
    }

    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [open, onCancel]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative w-full max-w-sm space-y-4 rounded-xl border border-zinc-800 bg-zinc-950 p-6 shadow-xl">
        <div className="space-y-1.5">
          <h2 className="text-base font-medium text-zinc-100">{title}</h2>
          {description ? (
            <p className="text-sm text-zinc-500">{description}</p>
          ) : null}
        </div>
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={pending}
            className="rounded-lg border border-zinc-800 px-3 py-1.5 text-sm text-zinc-300 transition-colors hover:border-zinc-600 disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={pending}
            className={
              destructive
                ? "rounded-lg bg-red-500/90 px-3 py-1.5 text-sm font-medium text-zinc-50 transition-colors hover:bg-red-500 disabled:opacity-50"
                : "rounded-lg bg-zinc-100 px-3 py-1.5 text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-300 disabled:opacity-50"
            }
          >
            {pending ? "Please wait…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
