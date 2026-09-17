const WORDS_PER_MINUTE = 225;

export function calculateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}

export function formatReadingTime(content: string): string {
  return `${calculateReadingTime(content)} min read`;
}