import { getDb, ensureSchema } from "@/lib/db";

export async function GET() {
  try {
    await ensureSchema();
    const rows = await getDb()`SELECT now() AS time`;
    return Response.json({ success: true, dbState: "connected", time: rows[0].time });
  } catch (error) {
    return Response.json({ success: false, dbState: "disconnected", error: error.message }, { status: 500 });
  }
}
