import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { getDb, ensureSchema } from "@/lib/db";
import { isValidEmail, rateLimit, readJson, isDuplicateEmailError, getBaseUrl } from "@/lib/http";
import { sendEmail, verificationEmailHtml } from "@/lib/email";

export async function POST(request) {
  try {
    const { name, email, password } = await readJson(request);

    if (!name || !String(name).trim()) {
      return Response.json({ success: false, message: "Name is required" }, { status: 400 });
    }
    if (!isValidEmail(email)) {
      return Response.json({ success: false, message: "A valid email is required" }, { status: 400 });
    }
    if (!password || String(password).length < 6) {
      return Response.json(
        { success: false, message: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    if (!rateLimit(`signup:${request.headers.get("x-forwarded-for") || "local"}`, 10, 3600_000)) {
      return Response.json(
        { success: false, message: "Too many signup attempts. Try again later." },
        { status: 429 }
      );
    }

    await ensureSchema();
    const normalizedEmail = String(email).toLowerCase().trim();
    const hash = await bcrypt.hash(password, 12);

    // The configured admin skips email verification entirely
    const adminEmail = (process.env.ADMIN_EMAIL || "").toLowerCase().trim();
    const isAdminSignup = Boolean(adminEmail) && normalizedEmail === adminEmail;

    let rows;
    try {
      rows = await getDb()`
        INSERT INTO users (name, email, password, email_verified)
        VALUES (${String(name).trim()}, ${normalizedEmail}, ${hash}, ${isAdminSignup})
        ON CONFLICT (email) DO NOTHING
        RETURNING id, name, email`;
    } catch (err) {
      if (isDuplicateEmailError(err)) {
        return Response.json(
          { success: false, message: "An account with this email already exists" },
          { status: 409 }
        );
      }
      throw err;
    }

    if (rows.length === 0) {
      return Response.json(
        { success: false, message: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const user = rows[0];

    if (!isAdminSignup) {
      // Email verification token (24h validity)
      const verifyToken = crypto.randomBytes(32).toString("hex");
      const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
      await getDb()`
        UPDATE users SET verification_token = ${verifyToken}, verification_expires = ${expires}
        WHERE id = ${user.id}`;

      const verifyUrl = `${getBaseUrl(request)}/api/auth/verify-email?token=${verifyToken}`;
      const sent = await sendEmail({
        to: user.email,
        subject: "Confirm your Four AI account",
        html: verificationEmailHtml({ name: user.name, url: verifyUrl }),
      });
      if (!sent && !process.env.RESEND_API_KEY) {
        console.warn(`📧 Verification link for ${user.email}: ${verifyUrl}`);
      }
    }

    if (isAdminSignup) {
      return Response.json(
        {
          success: true,
          message: "Admin account created successfully!",
        },
        { status: 201 }
      );
    }

    // No session until the address is confirmed
    return Response.json(
      {
        success: true,
        needsVerification: true,
        message:
          "Account created! We've sent a confirmation link to your email. Please verify to log in.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Signup error:", error);
    return Response.json(
      { success: false, message: "Could not create account. Please try again." },
      { status: 500 }
    );
  }
}
