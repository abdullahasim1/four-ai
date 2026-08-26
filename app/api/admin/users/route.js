import { getDb, ensureSchema } from "@/lib/db";
import { getAdminFromRequest } from "@/lib/session";

export async function GET(request) {
  const auth = await getAdminFromRequest(request);
  if (!auth || auth.banned || auth.forbidden) {
    const status = auth?.forbidden ? 403 : 401;
    return Response.json({ success: false, message: "Admin authentication required" }, { status });
  }

  try {
    await ensureSchema();
    const search = `%${(new URL(request.url).searchParams.get("search") || "").toLowerCase()}%`;

    const rows = await getDb()`
      SELECT u.id, u.name, u.email, u.banned, u.created_at,
             COUNT(a.id)::int AS activity_count
      FROM users u
      LEFT JOIN activities a ON a.user_id = u.id
      WHERE LOWER(u.name) LIKE ${search} OR LOWER(u.email) LIKE ${search}
      GROUP BY u.id
      ORDER BY u.created_at DESC`;

    return Response.json({
      success: true,
      users: rows.map((r) => ({
        id: r.id,
        name: r.name,
        email: r.email,
        banned: r.banned,
        activityCount: r.activity_count,
        createdAt: r.created_at,
      })),
    });
  } catch (error) {
    console.error("❌ Admin users error:", error);
    return Response.json({ success: false, message: "Could not load users" }, { status: 500 });
  }
}
