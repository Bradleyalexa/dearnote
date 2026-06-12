/**
 * Simple in-memory rate limiter for Next.js API routes.
 * NOTE: Resets on server restart/redeploy. For persistent rate limiting,
 * consider Upstash Redis or Cloudflare WAF rules.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Cleanup old entries every 5 minutes to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (now > entry.resetAt) {
      store.delete(key);
    }
  }
}, 5 * 60 * 1000);

interface RateLimitOptions {
  /** Max requests allowed within the window */
  limit: number;
  /** Window duration in seconds */
  windowSeconds: number;
}

interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetAt: number;
}

/**
 * Check and update rate limit for a given key (e.g. IP address).
 * Returns { success: false } if the limit has been exceeded.
 */
export function rateLimit(key: string, opts: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  const windowMs = opts.windowSeconds * 1000;

  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    // New window
    const newEntry: RateLimitEntry = { count: 1, resetAt: now + windowMs };
    store.set(key, newEntry);
    return { success: true, remaining: opts.limit - 1, resetAt: newEntry.resetAt };
  }

  if (entry.count >= opts.limit) {
    return { success: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count += 1;
  return { success: true, remaining: opts.limit - entry.count, resetAt: entry.resetAt };
}

/**
 * Extract the real client IP from Next.js request headers.
 * Tries x-forwarded-for first (for proxies/CDN), then falls back to
 * a placeholder (no direct socket access in Next.js edge/serverless).
 */
export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp;
  return "unknown";
}
