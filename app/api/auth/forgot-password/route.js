import bcrypt from "bcryptjs";
import { getDb, ensureSchema } from "@/lib/db";
import { readJson } from "@/lib/http";

export async function POST(request) {
  try {
    const { email, newPassword } = await readJson(request);
    if (!email || !newPassword) {
      return Response.json(
        { success: false, message: "Email and new password are required" },
        { status: 400 }
      );
    }
    if (String(newPassword).length < 6) {
      return Response.json(
        { success: false, message: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    await ensureSchema();
    const normalized = String(email).toLowerCase().trim();
    const hash = await bcrypt.hash(newPassword, 12);

    const updated = await getDb()`
      UPDATE users SET password = ${hash} WHERE email = ${normalized} RETURNING id`;

    // Invalidate existing sessions after a password reset
    if (updated.length > 0) {
      await getDb()`DELETE FROM sessions WHERE user_id = ${updated[0].id}`;
    }

    // Never reveal whether the account exists
    return Response.json({
      success: true,
      message: "If that email exists, the password has been updated.",
    });
  } catch (error) {
    console.error("❌ Forgot password error:", error);
    return Response.json(
      { success: false, message: "Could not reset password. Please try again." },
      { status: 500 }
    );
  }
}
