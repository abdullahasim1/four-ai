const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Simple in-memory limiter (per warm serverless instance)
const attempts = new Map();

export function rateLimit(key, max, windowMs) {
  const now = Date.now();
  const entry = attempts.get(key) || { count: 0, start: now };
  if (now - entry.start > windowMs) {
    entry.count = 0;
    entry.start = now;
  }
  entry.count += 1;
  attempts.set(key, entry);
  return entry.count <= max;
}

export function isValidEmail(email) {
  return typeof email === "string" && EMAIL_RE.test(email);
}

export async function readJson(request) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}

export function isDuplicateEmailError(err) {
  return err?.code === "23505" || /duplicate key|unique constraint/i.test(err?.message || "");
}

/** Public origin of the app, proxy-aware (Vercel sets x-forwarded-* headers). */
export function getBaseUrl(request) {
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
  if (host) {
    const proto = request.headers.get("x-forwarded-proto") || (host.startsWith("localhost") ? "http" : "https");
    return `${proto}://${host}`;
  }
  return new URL(request.url).origin;
}
