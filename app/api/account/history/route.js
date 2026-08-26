import { getDb } from "@/lib/db";
import { getUserFromRequest } from "@/lib/session";
import { readJson } from "@/lib/http";

export async function GET(request) {
  const auth = await getUserFromRequest(request);
  if (!auth) {
    return Response.json({ success: false, message: "Session expired. Please log in again." }, { status: 401 });
  }
  if (auth.banned) {
    return Response.json({ success: false, message: "Your account has been banned." }, { status: 403 });
  }

  try {
    const limitParam = new URL(request.url).searchParams.get("limit");
    const limit = Math.min(Math.max(parseInt(limitParam, 10) || 50, 1), 100);

    const rows = await getDb()`
      SELECT id, feature, description, created_at
      FROM activities WHERE user_id = ${auth.user.id}
      ORDER BY created_at DESC LIMIT ${limit}`;

    return Response.json({
      success: true,
      history: rows.map((r) => ({
        id: r.id,
        feature: r.feature,
        description: r.description,
        timestamp: r.created_at,
      })),
    });
  } catch (error) {
    console.error("❌ History error:", error);
    return Response.json({ success: false, message: "Could not load history" }, { status: 500 });
  }
}

export async function POST(request) {
  const auth = await getUserFromRequest(request);
  if (!auth) {
    return Response.json({ success: false, message: "Session expired. Please log in again." }, { status: 401 });
  }

  try {
    const { feature, description } = await readJson(request);
    if (!feature) {
      return Response.json({ success: false, message: "Feature is required" }, { status: 400 });
    }
    await getDb()`
      INSERT INTO activities (user_id, feature, description)
      VALUES (${auth.user.id}, ${String(feature).slice(0, 100)}, ${description ? String(description).slice(0, 1000) : ""})`;

    return Response.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("❌ Track activity error:", error);
    return Response.json({ success: false, message: "Could not save activity" }, { status: 500 });
  }
}
