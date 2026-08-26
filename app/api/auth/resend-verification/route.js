import crypto from "node:crypto";
import { getDb, ensureSchema } from "@/lib/db";
import { isValidEmail, rateLimit, readJson, getBaseUrl } from "@/lib/http";
import { sendEmail, verificationEmailHtml } from "@/lib/email";

export async function POST(request) {
  try {
    const { email } = await readJson(request);
    if (!isValidEmail(email)) {
      return Response.json({ success: false, message: "A valid email is required" }, { status: 400 });
    }

    if (!rateLimit(`resend:${request.headers.get("x-forwarded-for") || "local"}`, 5, 3600_000)) {
      return Response.json(
        { success: false, message: "Too many requests. Try again later." },
        { status: 429 }
      );
    }

    await ensureSchema();
    const normalized = String(email).toLowerCase().trim();
    const rows = await getDb()`
      SELECT id, name FROM users
      WHERE email = ${normalized} AND NOT email_verified`;

    // Always answer the same way so accounts can't be enumerated
    if (rows.length > 0) {
      const token = crypto.randomBytes(32).toString("hex");
      const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
      await getDb()`
        UPDATE users SET verification_token = ${token}, verification_expires = ${expires}
        WHERE id = ${rows[0].id}`;

      const verifyUrl = `${getBaseUrl(request)}/api/auth/verify-email?token=${token}`;
      const sent = await sendEmail({
        to: normalized,
        subject: "Confirm your Four AI account",
        html: verificationEmailHtml({ name: rows[0].name, url: verifyUrl }),
      });
      if (!sent && !process.env.RESEND_API_KEY) {
        console.warn(`📧 Verification link for ${normalized}: ${verifyUrl}`);
      }
    }

    return Response.json({
      success: true,
      message: "If the account needs verification, a new confirmation email has been sent.",
    });
  } catch (error) {
    console.error("❌ Resend verification error:", error);
    return Response.json({ success: false, message: "Could not send email. Please try again." }, { status: 500 });
  }
}
