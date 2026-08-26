/**
 * Transactional email. Priority:
 *   1. Gmail SMTP (GMAIL_USER + GMAIL_APP_PASSWORD) — sends from your Gmail
 *   2. Resend HTTP API (RESEND_API_KEY)
 *   3. No provider configured → links logged to the server console
 */
import nodemailer from "nodemailer";

let _gmail;

function getGmail() {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) return null;
  if (!_gmail) {
    _gmail = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });
  }
  return _gmail;
}

export async function sendEmail({ to, subject, html }) {
  const gmail = getGmail();
  if (gmail) {
    try {
      await gmail.sendMail({
        from: `"Four AI" <${process.env.GMAIL_USER}>`,
        to,
        subject,
        html,
      });
      return true;
    } catch (err) {
      console.error("❌ Gmail send failed:", err.message);
    }
  }

  const key = process.env.RESEND_API_KEY;
  if (key) {
    const from = process.env.EMAIL_FROM || "Four AI <onboarding@resend.dev>";
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({ from, to, subject, html }),
      });
      if (res.ok) return true;
      console.error("❌ Resend error:", res.status, await safeText(res));
    } catch (err) {
      console.error("❌ Email send failed:", err);
    }
  }

  if (!gmail && !key) {
    console.warn(`⚠️ No email provider configured — skipping real email to ${to}.`);
  }
  return false;
}

async function safeText(res) {
  try {
    return await res.text();
  } catch {
    return "";
  }
}

function actionEmailHtml({ title, body, ctaText, url }) {
  return `
  <div style="font-family:Arial,Helvetica,sans-serif;background:#0f172a;padding:40px 16px">
    <div style="max-width:480px;margin:0 auto;background:#1e293b;border-radius:16px;padding:32px;color:#e2e8f0">
      <h1 style="margin:0 0 8px;font-size:22px;color:#ffffff">${title}</h1>
      <p style="margin:0 0 24px;font-size:14px;line-height:1.6;color:#94a3b8">
        ${body} This link expires in 24 hours.
      </p>
      <a href="${url}"
         style="display:inline-block;background:linear-gradient(90deg,#6366f1,#d946ef);color:#ffffff;
                text-decoration:none;font-weight:bold;font-size:14px;padding:12px 28px;border-radius:10px">
        ${ctaText}
      </a>
      <p style="margin:24px 0 0;font-size:12px;line-height:1.6;color:#64748b;word-break:break-all">
        Button not working? Copy this link into your browser:<br/>${url}
      </p>
    </div>
  </div>`;
}

export function verificationEmailHtml({ name, url }) {
  const fallbackName = String(name || "there").split(" ")[0];
  return actionEmailHtml({
    title: `Confirm your email, ${fallbackName} 👋`,
    body: "Welcome to Four AI! Please confirm your email address to activate your account.",
    ctaText: "Confirm my email",
    url,
  });
}

export function emailChangeEmailHtml({ newEmail, url }) {
  return actionEmailHtml({
    title: "Confirm your new email",
    body: `A request was made to change your Four AI account email to <b style="color:#e2e8f0">${newEmail}</b>. Click below to confirm — until then your current email stays active.`,
    ctaText: "Confirm new email",
    url,
  });
}
