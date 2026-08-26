import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { getDb, ensureSchema } from "@/lib/db";
import { publicUser } from "@/lib/session";
import { rateLimit, readJson } from "@/lib/http";

export async function POST(request) {
  try {
    const { email, password } = await readJson(request);
    if (!email || !password) {
      return Response.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    if (!rateLimit(`login:${request.headers.get("x-forwarded-for") || "local"}`, 20, 900_000)) {
      return Response.json(
        { success: false, message: "Too many login attempts. Try again later." },
        { status: 429 }
      );
    }

    await ensureSchema();
    const rows = await getDb()`
      SELECT * FROM users WHERE email = ${String(email).toLowerCase().trim()}`;

    if (rows.length === 0) {
      return Response.json({ success: false, message: "Invalid email or password" }, { status: 401 });
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return Response.json({ success: false, message: "Invalid email or password" }, { status: 401 });
    }

    if (user.banned) {
      return Response.json(
        { success: false, message: "Your account has been banned. Contact support." },
        { status: 403 }
      );
    }

    // Promote the configured ADMIN_EMAIL to the admin role on login
    // (admins also bypass email verification)
    const adminEmail = (process.env.ADMIN_EMAIL || "").toLowerCase().trim();
    if (adminEmail && user.email === adminEmail && (user.role !== "admin" || !user.email_verified)) {
      await getDb()`UPDATE users SET role = 'admin', email_verified = TRUE WHERE id = ${user.id}`;
      user.role = "admin";
      user.email_verified = true;
    }

    // Block login until the email address is confirmed
    if (!user.email_verified) {
      return Response.json(
        {
          success: false,
          needsVerification: true,
          message: "Please confirm your email first. Check your inbox for the verification link.",
        },
        { status: 403 }
      );
    }

    const token = crypto.randomUUID();
    await getDb()`INSERT INTO sessions (token, user_id) VALUES (${token}, ${user.id})`;

    return Response.json({ success: true, message: "Login successful", token, user: publicUser(user) });
  } catch (error) {
    console.error("❌ Login error:", error);
    return Response.json({ success: false, message: "Login failed. Please try again." }, { status: 500 });
  }
}
