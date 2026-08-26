import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { getDb } from "@/lib/db";
import { getUserFromRequest } from "@/lib/session";
import { isValidEmail, readJson, getBaseUrl } from "@/lib/http";
import { sendEmail, emailChangeEmailHtml } from "@/lib/email";

export async function PUT(request) {
  const auth = await getUserFromRequest(request);
  if (!auth) {
    return Response.json({ success: false, message: "Session expired. Please log in again." }, { status: 401 });
  }
  if (auth.banned) {
    return Response.json({ success: false, message: "Your account has been banned." }, { status: 403 });
  }

  try {
    const { email, currentPassword } = await readJson(request);
    if (!isValidEmail(email)) {
      return Response.json({ success: false, message: "A valid new email is required" }, { status: 400 });
    }
    if (!currentPassword) {
      return Response.json(
        { success: false, message: "Your current password is required to change email" },
        { status: 400 }
      );
    }

    const normalized = String(email).toLowerCase().trim();
    if (normalized === auth.user.email.toLowerCase()) {
      return Response.json({ success: false, message: "This is already your current email" }, { status: 400 });
    }

    // Verify ownership with the current password
    const rows = await getDb()`SELECT password FROM users WHERE id = ${auth.user.id}`;
    const match = await bcrypt.compare(String(currentPassword), rows[0].password);
    if (!match) {
      return Response.json({ success: false, message: "Current password is incorrect" }, { status: 401 });
    }

    // New address must not belong to another account
    const taken = await getDb()`
      SELECT id FROM users WHERE email = ${normalized} AND id <> ${auth.user.id}`;
    if (taken.length > 0) {
      return Response.json({ success: false, message: "That email is already in use" }, { status: 409 });
    }

    // Store as pending; the swap happens only after confirmation
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await getDb()`
      UPDATE users
      SET pending_email = ${normalized}, email_change_token = ${token}, email_change_expires = ${expires}
      WHERE id = ${auth.user.id}`;

    const confirmUrl = `${getBaseUrl(request)}/api/auth/confirm-email?token=${token}`;
    const sent = await sendEmail({
      to: normalized,
      subject: "Confirm your new Four AI email",
      html: emailChangeEmailHtml({ newEmail: normalized, url: confirmUrl }),
    });
    if (!sent && !process.env.RESEND_API_KEY) {
      console.warn(`📧 Email-change link for ${auth.user.email} → ${normalized}: ${confirmUrl}`);
    }

    return Response.json({
      success: true,
      message: `Confirmation link sent to ${normalized}. Click it within 24 hours to complete the change.`,
      pendingEmail: normalized,
    });
  } catch (error) {
    console.error("❌ Email change error:", error);
    return Response.json({ success: false, message: "Could not update email" }, { status: 500 });
  }
}
