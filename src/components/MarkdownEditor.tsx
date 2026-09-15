"use client";

import { useRef, useState } from "react";
import { Image as ImageIcon, Loader } from "react-feather";
import { cn } from "@/libs/Cn";
import Markdown from "@/components/Markdown";

type Props = {
  id: string;
  name: string;
  label: string;
  defaultValue?: string;
  rows?: number;
  required?: boolean;
};

type ToolbarAction = {
  label: string;
  title: string;
  run: () => void;
};

export default function MarkdownEditor({
  id,
  name,
  label,
  defaultValue = "",
  rows = 16,
  required = false,
}: Props) {
  const [value, setValue] = useState(defaultValue);
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function insertText(text: string) {
    const textarea = textareaRef.current;
    if (!textarea) {
      setValue((v) => v + text);
      return;
    }
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const next = value.slice(0, start) + text + value.slice(end);
    setValue(next);
    requestAnimationFrame(() => {
      textarea.focus();
      const cursor = start + text.length;
      textarea.setSelectionRange(cursor, cursor);
    });
  }

  function wrapSelection(before: string, after: string, placeholder: string) {
    const textarea = textareaRef.current;
    if (!textarea) {
      insertText(`${before}${placeholder}${after}`);
      return;
    }
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.slice(start, end) || placeholder;
    const next =
      value.slice(0, start) + before + selected + after + value.slice(end);
    setValue(next);
    requestAnimationFrame(() => {
      textarea.focus();
      const from = start + before.length;
      const to = from + selected.length;
      textarea.setSelectionRange(from, to);
    });
  }

  function prefixLine(prefix: string) {
    const textarea = textareaRef.current;
    if (!textarea) {
      insertText(prefix);
      return;
    }
    const start = textarea.selectionStart;
    const lineStart = value.lastIndexOf("\n", Math.max(start - 1, 0)) + 1;
    const next = value.slice(0, lineStart) + prefix + value.slice(lineStart);
    setValue(next);
    requestAnimationFrame(() => {
      textarea.focus();
      const cursor = start + prefix.length;
      textarea.setSelectionRange(cursor, cursor);
    });
  }

  async function uploadImage(file: File) {
    if (!file.type.startsWith("image/")) {
      setUploadError("File harus berupa gambar.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Ukuran gambar maksimal 5MB.");
      return;
    }

    setUploadError(null);
    setUploading(true);

    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Upload gagal.");
      }

      insertText(`\n![${file.name.replace(/\.[^.]+$/, "")}](${data.url})\n`);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload gagal.");
    } finally {
      setUploading(false);
    }
  }

  function handlePaste(e: React.ClipboardEvent<HTMLTextAreaElement>) {
    const item = Array.from(e.clipboardData.items).find((i) =>
      i.type.startsWith("image/"),
    );
    if (!item) return;
    const file = item.getAsFile();
    if (!file) return;
    e.preventDefault();
    uploadImage(file);
  }

  function handleDrop(e: React.DragEvent<HTMLTextAreaElement>) {
    const file = Array.from(e.dataTransfer.files).find((f) =>
      f.type.startsWith("image/"),
    );
    if (!file) return;
    e.preventDefault();
    uploadImage(file);
  }

  const toolbar: ToolbarAction[] = [
    {
      label: "B",
      title: "Bold",
      run: () => wrapSelection("**", "**", "bold text"),
    },
    {
      label: "I",
      title: "Italic",
      run: () => wrapSelection("_", "_", "italic text"),
    },
    { label: "H2", title: "Heading", run: () => prefixLine("## ") },
    { label: "❝", title: "Quote", run: () => prefixLine("> ") },
    { label: "•", title: "Bullet list", run: () => prefixLine("- ") },
    { label: "1.", title: "Numbered list", run: () => prefixLine("1. ") },
    {
      label: "</>",
      title: "Inline code",
      run: () => wrapSelection("`", "`", "code"),
    },
    {
      label: "🔗",
      title: "Link",
      run: () => wrapSelection("[", "](https://)", "link text"),
    },
  ];

  return (
    <div className="">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-sm text-zinc-500">
          {label}
        </label>
        <div className="flex overflow-hidden rounded-lg border border-zinc-800 text-xs mb-1">
          <button
            type="button"
            onClick={() => setTab("write")}
            className={cn(
              "px-2.5 py-1 transition-colors",
              tab === "write"
                ? "bg-zinc-800 text-zinc-100"
                : "text-zinc-500 hover:text-zinc-300",
            )}
          >
            Write
          </button>
          <button
            type="button"
            onClick={() => setTab("preview")}
            className={cn(
              "px-2.5 py-1 transition-colors",
              tab === "preview"
                ? "bg-zinc-800 text-zinc-100"
                : "text-zinc-500 hover:text-zinc-300",
            )}
          >
            Preview
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1 rounded-t-lg border border-b-0 border-zinc-800 bg-zinc-950/40 px-2 py-1.5">
        {toolbar.map((item) => (
          <button
            key={item.title}
            type="button"
            title={item.title}
            onClick={item.run}
            className="min-w-[28px] rounded-md px-2 py-1 text-xs text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
          >
            {item.label}
          </button>
        ))}
        <span className="mx-1 h-4 w-px bg-zinc-800" />
        <button
          type="button"
          title="Insert image"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100 disabled:opacity-50"
        >
          {uploading ? (
            <Loader size={13} className="animate-spin" />
          ) : (
            <ImageIcon size={13} />
          )}
          Image
        </button>
      </div>

      <div className={tab === "write" ? "" : "hidden"}>
        <textarea
          ref={textareaRef}
          id={id}
          name={name}
          rows={rows}
          required={required}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onPaste={handlePaste}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="w-full rounded-b-lg border border-zinc-800 bg-transparent px-3 py-2 font-mono text-sm text-zinc-100 outline-none focus-visible:border-zinc-600"
        />
      </div>

      {tab === "preview" ? (
        <div className="min-h-[120px] rounded-b-lg border border-zinc-800 px-3 py-3">
          {value.trim() ? (
            <Markdown content={value} />
          ) : (
            <p className="text-sm text-zinc-600">
              Belum ada yang bisa dipreview.
            </p>
          )}
        </div>
      ) : null}

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

      {uploadError ? (
        <p className="text-xs text-red-400">{uploadError}</p>
      ) : null}
    </div>
  );
}
