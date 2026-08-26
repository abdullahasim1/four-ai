import { getSession } from "./auth-client";

/**
 * Minimal same-origin API client. The backend lives in this same Next.js app
 * under /api/*, so no base URL is needed.
 */

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

async function request(path, { method = "GET", body, headers = {}, timeout = 60000 } = {}) {
  const session = getSession();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  let res;
  try {
    res = await fetch(`/api${path}`, {
      method,
      headers: {
        ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
        ...(session ? { Authorization: `Bearer ${session.token}` } : {}),
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
  } catch (err) {
    clearTimeout(timeoutId);
    throw new Error(
      err.name === "AbortError" ? "Request timed out. Please try again." : "Network error. Is the server running?"
    );
  }
  clearTimeout(timeoutId);

  let data = null;
  try {
    data = await res.json();
  } catch {
    /* empty or non-JSON body */
  }

  if (!res.ok) {
    throw new ApiError(data?.message || `Request failed (${res.status})`, res.status);
  }
  return data;
}

// ---- Auth ----
export const authApi = {
  signup: (payload) => request("/auth/signup", { method: "POST", body: payload }),
  login: (payload) => request("/auth/login", { method: "POST", body: payload }),
  logout: () => request("/auth/logout", { method: "POST" }),
  forgotPassword: (payload) => request("/auth/forgot-password", { method: "POST", body: payload }),
  resendVerification: (email) =>
    request("/auth/resend-verification", { method: "POST", body: { email } }),
};

// ---- Account / profile / history ----
export const accountApi = {
  getProfile: () => request("/account/profile"),
  updateProfile: (payload) => request("/account/profile", { method: "PUT", body: payload }),
  updatePassword: (payload) => request("/account/password", { method: "PUT", body: payload }),
  updateEmail: (payload) => request("/account/email", { method: "PUT", body: payload }),
  getHistory: (limit = 50) => request(`/account/history?limit=${limit}`),
  trackActivity: (feature, description) =>
    request("/account/history", { method: "POST", body: { feature, description }, timeout: 10000 }),
};

// ---- Admin ----
export const adminApi = {
  getUsers: (search = "") =>
    request(`/admin/users?search=${encodeURIComponent(search)}`),
  banUser: (userId, banned) =>
    request("/admin/ban-user", { method: "POST", body: { userId, banned } }),
};

// ---- Image generation ----
export async function generateImage({ prompt, negativePrompt, steps, guidance }) {
  const session = getSession();
  if (!session) throw new ApiError("Please log in first", 401);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 120000);
  try {
    const res = await fetch("/api/generate/image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.token}`,
      },
      body: JSON.stringify({ prompt, negativePrompt, steps, guidance }),
      signal: controller.signal,
    });

    if (!res.ok) {
      let message = `Image generation failed (${res.status})`;
      try {
        const data = await res.json();
        if (data.message) message = data.message;
      } catch {
        /* non-JSON error */
      }
      throw new ApiError(message, res.status);
    }

    const blob = await res.blob();
    return { url: URL.createObjectURL(blob), model: res.headers.get("X-Model") || "" };
  } finally {
    clearTimeout(timeoutId);
  }
}
