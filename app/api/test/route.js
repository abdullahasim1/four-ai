import { getDb, ensureSchema } from "@/lib/db";

export async function GET() {
  return Response.json({ name: "Four AI API", status: "running", timestamp: new Date().toISOString() });
}

export async function HEAD() {
  return new Response(null, { status: 200 });
}
