"use client";

import { useRef, useState } from "react";
import { Image as ImageIcon, Loader, X } from "react-feather";

type Props = {
  id: string;
  name: string;
  label?: string;
  defaultValue?: string | null;
};

export default function CoverImageInput({
  id,
  name,
  label = "Cover image",
  defaultValue = "",
}: Props) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function uploadImage(file: File) {
    if (!file.type.startsWith("image/")) {
      setError("File harus berupa gambar.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Ukuran gambar maksimal 5MB.");
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "projects");
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Upload gagal.");
      }

      setUrl(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload gagal.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm text-zinc-500">
        {label} <span className="text-zinc-600">(opsional)</span>
      </label>

      {url ? (
        <div className="relative overflow-hidden rounded-lg border border-zinc-800">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt="Cover preview"
            className="max-h-48 w-full object-cover"
          />
          <button
            type="button"
            onClick={() => setUrl("")}
            className="absolute right-2 top-2 rounded-full bg-zinc-950/80 p-1 text-zinc-300 transition-colors hover:text-zinc-50"
            aria-label="Remove cover image"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-zinc-800 px-3 py-6 text-sm text-zinc-500 transition-colors hover:border-zinc-600 hover:text-zinc-300 disabled:opacity-50"
        >
          {uploading ? (
            <Loader size={14} className="animate-spin" />
          ) : (
            <ImageIcon size={14} />
          )}
          {uploading ? "Uploading…" : "Upload cover image"}
        </button>
      )}

      {error ? <p className="text-xs text-red-400">{error}</p> : null}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) uploadImage(file);
          e.target.value = "";
        }}
      />

      <input id={id} type="hidden" name={name} value={url} />
    </div>
  );
}
