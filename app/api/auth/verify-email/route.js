import { getDb, ensureSchema } from "@/lib/db";

export async function GET(request) {
  const origin = new URL(request.url).origin;
  const token = new URL(request.url).searchParams.get("token");

  if (!token) {
    return Response.redirect(`${origin}/login?verified=invalid`, 302);
  }

  try {
    await ensureSchema();
    const rows = await getDb()`
      SELECT id FROM users
      WHERE verification_token = ${token}
        AND verification_expires > now()
        AND NOT email_verified`;

    if (rows.length === 0) {
      return Response.redirect(`${origin}/login?verified=invalid`, 302);
    }

    await getDb()`
      UPDATE users
      SET email_verified = TRUE, verification_token = NULL, verification_expires = NULL
      WHERE id = ${rows[0].id}`;

    return Response.redirect(`${origin}/login?verified=1`, 302);
  } catch (error) {
    console.error("❌ Email verification error:", error);
    return Response.redirect(`${origin}/login?verified=error`, 302);
  }
}
