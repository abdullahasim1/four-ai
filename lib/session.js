import { getDb, ensureSchema } from "./db";

function publicUser(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone || "",
    address: row.address || "",
    avatar: row.avatar || null,
    role: row.role || "user",
    pendingEmail: row.pending_email || null,
    createdAt: row.created_at ?? null,
  };
}

/**
 * Resolves the bearer token to a user.
 * @returns {Promise<{user: object} | {banned: true} | null>}
 */
export async function getUserFromRequest(request) {
  const header = request.headers.get("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return null;

  await ensureSchema();
  const rows = await getDb()`
    SELECT u.id, u.name, u.email, u.phone, u.address, u.avatar, u.banned, u.role, u.pending_email, u.created_at
    FROM sessions s JOIN users u ON u.id = s.user_id
    WHERE s.token = ${token}`;

  if (rows.length === 0) return null;
  if (rows[0].banned) return { banned: true };
  return { user: publicUser(rows[0]) };
}

/**
 * Resolves the Bearer token and verifies the user has the admin role.
 * @returns {Promise<{user: object} | {banned: true} | {forbidden: true} | null>}
 */
export async function getAdminFromRequest(request) {
  const result = await getUserFromRequest(request);
  if (!result || result.banned) return result;
  if (result.user.role !== "admin") return { forbidden: true };
  return result;
}

export { publicUser };
