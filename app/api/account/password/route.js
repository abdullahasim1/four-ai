import bcrypt from "bcryptjs";
import { getDb } from "@/lib/db";
import { getUserFromRequest } from "@/lib/session";
import { readJson } from "@/lib/http";

export async function PUT(request) {
  const auth = await getUserFromRequest(request);
  if (!auth) {
    return Response.json({ success: false, message: "Session expired. Please log in again." }, { status: 401 });
  }
  if (auth.banned) {
    return Response.json({ success: false, message: "Your account has been banned." }, { status: 403 });
  }

  try {
    const { currentPassword, newPassword } = await readJson(request);
    if (!currentPassword || !newPassword) {
      return Response.json(
        { success: false, message: "Current and new password are required" },
        { status: 400 }
      );
    }
    if (String(newPassword).length < 6) {
      return Response.json(
        { success: false, message: "New password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const rows = await getDb()`SELECT password FROM users WHERE id = ${auth.user.id}`;
    const match = await bcrypt.compare(currentPassword, rows[0].password);
    if (!match) {
      return Response.json({ success: false, message: "Current password is incorrect" }, { status: 401 });
    }

    const hash = await bcrypt.hash(newPassword, 12);
    await getDb()`UPDATE users SET password = ${hash} WHERE id = ${auth.user.id}`;

    return Response.json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error("❌ Password change error:", error);
    return Response.json({ success: false, message: "Could not update password" }, { status: 500 });
  }
}
