import { getDb, ensureSchema } from "@/lib/db";

export async function POST(request) {
  try {
    const header = request.headers.get("authorization") || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (token) {
      await ensureSchema();
      await getDb()`DELETE FROM sessions WHERE token = ${token}`;
    }
    return Response.json({ success: true, message: "Logged out" });
  } catch (error) {
    console.error("❌ Logout error:", error);
    return Response.json({ success: false, message: "Logout failed" }, { status: 500 });
  }
}
