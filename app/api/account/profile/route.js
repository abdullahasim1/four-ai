import { getDb } from "@/lib/db";
import { getUserFromRequest } from "@/lib/session";
import { readJson } from "@/lib/http";

export async function GET(request) {
  const auth = await getUserFromRequest(request);
  if (!auth) {
    return Response.json({ success: false, message: "Session expired. Please log in again." }, { status: 401 });
  }
  if (auth.banned) {
    return Response.json({ success: false, message: "Your account has been banned." }, { status: 403 });
  }
  return Response.json({ success: true, user: auth.user });
}

export async function PUT(request) {
  const auth = await getUserFromRequest(request);
  if (!auth) {
    return Response.json({ success: false, message: "Session expired. Please log in again." }, { status: 401 });
  }
  if (auth.banned) {
    return Response.json({ success: false, message: "Your account has been banned." }, { status: 403 });
  }

  try {
    const body = await readJson(request);
    const { name, phone, address, avatar } = body;

    if (name !== undefined && !String(name).trim()) {
      return Response.json({ success: false, message: "Name cannot be empty" }, { status: 400 });
    }
    if (avatar && avatar.length > 400_000) {
      return Response.json(
        { success: false, message: "Profile picture is too large. Please choose a smaller image." },
        { status: 413 }
      );
    }

    const rows = await getDb()`
      UPDATE users SET
        name = COALESCE(${name !== undefined ? String(name).trim() : null}, name),
        phone = COALESCE(${phone !== undefined ? String(phone).slice(0, 50) : null}, phone),
        address = COALESCE(${address !== undefined ? String(address).slice(0, 500) : null}, address),
        avatar = COALESCE(${avatar || null}, avatar)
      WHERE id = ${auth.user.id}
      RETURNING id, name, email, phone, address, avatar, banned, created_at`;

    return Response.json({ success: true, message: "Profile updated successfully", user: rows[0] });
  } catch (error) {
    console.error("❌ Profile update error:", error);
    return Response.json({ success: false, message: "Could not update profile" }, { status: 500 });
  }
}
