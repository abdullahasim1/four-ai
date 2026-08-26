import { getDb, ensureSchema } from "@/lib/db";
import { isDuplicateEmailError } from "@/lib/http";

export async function GET(request) {
  const origin = new URL(request.url).origin;
  const redirect = (state) => Response.redirect(`${origin}/settings?emailChanged=${state}`, 302);
  const token = new URL(request.url).searchParams.get("token");

  if (!token) return redirect("invalid");

  try {
    await ensureSchema();
    const rows = await getDb()`
      SELECT id, pending_email FROM users
      WHERE email_change_token = ${token}
        AND email_change_expires > now()
        AND pending_email IS NOT NULL`;

    if (rows.length === 0) return redirect("invalid");

    try {
      await getDb()`
        UPDATE users SET
          email = pending_email,
          email_verified = TRUE,
          pending_email = NULL,
          email_change_token = NULL,
          email_change_expires = NULL
        WHERE id = ${rows[0].id}`;
      return redirect("1");
    } catch (err) {
      if (isDuplicateEmailError(err)) {
        // Someone registered with that address in the meantime
        await getDb()`
          UPDATE users SET pending_email = NULL, email_change_token = NULL, email_change_expires = NULL
          WHERE id = ${rows[0].id}`;
        return redirect("taken");
      }
      throw err;
    }
  } catch (error) {
    console.error("❌ Confirm email error:", error);
    return redirect("error");
  }
}
