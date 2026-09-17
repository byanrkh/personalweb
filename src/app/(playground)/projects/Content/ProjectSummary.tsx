"use client";

import { useLayoutEffect, useRef, useState } from "react";

export default function ProjectSummary({ summary }: { summary: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [truncated, setTruncated] = useState(false);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    setTruncated(el.scrollHeight > el.clientHeight + 1);
  }, [summary]);

  if (!summary) return null;

  return (
    <div className="mt-1">
      <p ref={ref} className="line-clamp-2 text-sm text-zinc-500">
        {summary}
      </p>
      {truncated ? (
        <span className="text-xs text-zinc-400 underline decoration-dashed underline-offset-2 transition-colors group-hover:text-zinc-200">
          Read more
        </span>
      ) : null}
    </div>
  );
}
