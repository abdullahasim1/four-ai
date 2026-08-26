import { getDb, ensureSchema } from "@/lib/db";
import { getAdminFromRequest } from "@/lib/session";
import { readJson } from "@/lib/http";

export async function POST(request) {
  const auth = await getAdminFromRequest(request);
  if (!auth || auth.banned || auth.forbidden) {
    const status = auth?.forbidden ? 403 : 401;
    return Response.json({ success: false, message: "Admin authentication required" }, { status });
  }

  try {
    const { userId, banned } = await readJson(request);
    if (!userId || typeof banned !== "boolean") {
      return Response.json(
        { success: false, message: "userId and banned are required" },
        { status: 400 }
      );
    }
    if (Number(userId) === auth.user.id) {
      return Response.json({ success: false, message: "You cannot ban yourself" }, { status: 400 });
    }

    await ensureSchema();
    const rows = await getDb()`
      UPDATE users SET banned = ${banned} WHERE id = ${userId}
      RETURNING id, name, email, banned`;

    if (rows.length === 0) {
      return Response.json({ success: false, message: "User not found" }, { status: 404 });
    }

    // Banning a user also kills their active sessions
    if (banned) {
      await getDb()`DELETE FROM sessions WHERE user_id = ${userId}`;
    }

    return Response.json({
      success: true,
      message: banned ? "User banned" : "User unbanned",
      user: rows[0],
    });
  } catch (error) {
    console.error("❌ Ban user error:", error);
    return Response.json({ success: false, message: "Could not update user" }, { status: 500 });
  }
}
