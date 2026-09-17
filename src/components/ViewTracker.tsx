"use client";

import { useEffect } from "react";

/**
 * Fires a "someone opened this post" signal to the server once per page
 * mount. It never sends a count — the server (via record_writing_view)
 * is the sole authority on whether this turns into an actual +1.
 *
 * Rendering nothing and firing from useEffect (not during server render)
 * is intentional: simple bots/crawlers that only fetch the raw HTML never
 * execute this, so they never hit the endpoint at all.
 */
export default function ViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    const controller = new AbortController();

    fetch(`/api/writings/${slug}/view`, {
      method: "POST",
      signal: controller.signal,
      keepalive: true,
    }).catch(() => {
      // View tracking should never break the reading experience.
    });

    return () => controller.abort();
  }, [slug]);

  return null;
}
