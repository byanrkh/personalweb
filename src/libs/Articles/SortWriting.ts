import type { Writing } from "@/types/Writing";

export function sortWritings(writings: Writing[]): Writing[] {
  return [...writings].sort((a, b) => {
    const aDate = a.published_at ?? a.updated_at;
    const bDate = b.published_at ?? b.updated_at;
    return new Date(bDate).getTime() - new Date(aDate).getTime();
  });
}