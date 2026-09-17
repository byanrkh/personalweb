"use client";

import { useState, type KeyboardEvent } from "react";
import { X } from "react-feather";

type Props = {
  id: string;
  name: string;
  label?: string;
  defaultValue?: string[];
  placeholder?: string;
};

export default function TagsInput({
  id,
  name,
  label = "Tags",
  defaultValue = [],
  placeholder = "nextjs supabase notes",
}: Props) {
  const [tags, setTags] = useState<string[]>(defaultValue);
  const [input, setInput] = useState("");

  function addTag(raw: string) {
    const tag = raw.trim();
    if (!tag) return;
    setTags((prev) => (prev.includes(tag) ? prev : [...prev, tag]));
    setInput("");
  }

  function removeTag(tag: string) {
    setTags((prev) => prev.filter((t) => t !== tag));
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === " " || e.key === "Enter") {
      // Spasi (atau enter) mengubah teks yang sedang diketik jadi box tag.
      e.preventDefault();
      addTag(input);
      return;
    }

    if (e.key === "Backspace" && !input && tags.length > 0) {
      // Backspace di input kosong menghapus tag terakhir.
      e.preventDefault();
      removeTag(tags[tags.length - 1]);
    }
  }

  function handleBlur() {
    if (input.trim()) {
      addTag(input);
    }
  }

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm text-zinc-500">
        {label}{" "}
        <span className="text-zinc-600">(tekan spasi buat misahin tag)</span>
      </label>

      <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-zinc-800 bg-transparent px-2 py-1.5 focus-within:border-zinc-600">
        {tags.map((tag) => (
          <span
            key={tag}
            className="flex items-center gap-1 rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1 text-xs text-zinc-300"
          >
            <span className="text-zinc-500">#</span>
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="text-zinc-500 transition-colors hover:text-zinc-200"
              aria-label={`Hapus tag ${tag}`}
            >
              <X size={12} />
            </button>
          </span>
        ))}

        <input
          id={id}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          placeholder={tags.length ? "" : placeholder}
          className="min-w-[100px] flex-1 bg-transparent px-1 py-1 text-sm text-zinc-100 outline-none! shadow-none"
        />
      </div>

      <input type="hidden" name={name} value={tags.join(",")} />
    </div>
  );
}
