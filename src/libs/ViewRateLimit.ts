/**
 * Lightweight in-memory sliding-window rate limiter, keyed by IP.
 *
 * IMPORTANT: this is a *secondary*, best-effort layer only — it lives in
 * the memory of a single server process, so on serverless/multi-instance
 * deployments it won't be perfectly consistent across instances (each
 * instance has its own bucket map). It exists purely to blunt naive,
 * single-source floods cheaply, with zero extra infrastructure.
 *
 * The *real*, always-correct spam protection is the Postgres-backed
 * cooldown in record_writing_view() (see the SQL migration), which is
 * keyed by the anonymous visitor id and enforced atomically no matter how
 * many server instances are running.
 *
 * Also note this is intentionally NOT the identifier used to decide
 * whether a view counts — it only throttles request *volume* per IP as an
 * extra layer, on top of (not instead of) the per-visitor cooldown.
 *
 * If you outgrow this (real adversarial traffic at scale), swap it for a
 * shared store like Upstash Redis or Vercel KV — same function signature.
 */

const WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 30; // generous — no real reader hits this

type Bucket = { count: number; windowStart: number };

const buckets = new Map<string, Bucket>();

export function checkIpRateLimit(ip: string): boolean {
  const now = Date.now();
  const bucket = buckets.get(ip);

  if (!bucket || now - bucket.windowStart > WINDOW_MS) {
    buckets.set(ip, { count: 1, windowStart: now });
    return true;
  }

  bucket.count += 1;
  return bucket.count <= MAX_REQUESTS_PER_WINDOW;
}

// Keep the map from growing forever on a long-running process.
if (typeof setInterval !== "undefined") {
  const sweep = setInterval(
    () => {
      const now = Date.now();
      for (const [ip, bucket] of buckets) {
        if (now - bucket.windowStart > WINDOW_MS * 5) {
          buckets.delete(ip);
        }
      }
    },
    WINDOW_MS * 5,
  );
  sweep.unref?.();
}
