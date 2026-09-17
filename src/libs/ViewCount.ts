export function formatViews(count: number): string {
  const n = Number.isFinite(count) ? Math.max(0, Math.trunc(count)) : 0;
  const formatted = new Intl.NumberFormat("en-US").format(n);
  return `${formatted} ${n === 1 ? "view" : "views"}`;
}
