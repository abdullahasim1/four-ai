"use client";

import { useEffect, useRef, useState } from "react";
import { FaCamera, FaEdit, FaEnvelope, FaMapMarkerAlt, FaPhone, FaSave, FaUser } from "react-icons/fa";

import PageShell, { PageHeader } from "@/components/PageShell";
import { toast } from "@/lib/toast";
import { accountApi } from "@/lib/api";
import { getSession, updateUser } from "@/lib/auth-client";

// Downscale an image file to a compact JPEG data URL
function fileToResizedDataUrl(file, maxSide = 256) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read the image"));
    reader.onloadend = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Invalid image file"));
      img.onload = () => {
        const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

export default function Profile() {
  const [user, setUser] = useState({ name: "", email: "", phone: "", address: "", avatar: null });
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pendingAvatar, setPendingAvatar] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const session = getSession();
    if (!session) return;

    // Seed instantly from local session, then refresh from server
    setUser((u) => ({ ...u, ...session.user }));
    accountApi
      .getProfile()
      .then(({ data }) => {
        if (data.success) setUser(data.user);
      })
      .catch(() => toast.error("Couldn't load latest profile from server"));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const dataUrl = await fileToResizedDataUrl(file);
      setPendingAvatar(dataUrl);
      setUser((prev) => ({ ...prev, avatar: dataUrl }));
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        name: user.name,
        phone: user.phone,
        address: user.address,
        ...(pendingAvatar ? { avatar: pendingAvatar } : {}),
      };
      const data = await accountApi.updateProfile(payload);
      if (data.success) {
        updateUser(data.user);
        window.dispatchEvent(new Event("fourai:auth-changed"));
        toast.success("Profile saved");
        setIsEditing(false);
        setPendingAvatar(null);
      } else {
        toast.error(data.message || "Save failed");
      }
    } catch (err) {
      toast.error(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageShell contentClassName="mx-auto max-w-2xl px-4 py-12">
      <PageHeader icon={<FaUser className="gradient-text" />} title="My Profile" subtitle="Manage how you appear across Four AI." />

      <div className="glass-card p-6 md:p-8">
        {/* Avatar */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <img
              src={user.avatar || "/logo.png"}
              alt={user.name || "Profile"}
              className={`h-28 w-28 rounded-full object-cover ring-4 ${isEditing ? "ring-fuchsia-400/40" : "ring-indigo-400/30"}`}
            />
            {isEditing && (
              <button
                onClick={() => fileInputRef.current.click()}
                className="absolute -bottom-1 -right-1 rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 p-3 text-white shadow-lg transition-transform hover:scale-110"
                aria-label="Change photo"
              >
                <FaCamera />
              </button>
            )}
            <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
          </div>

          <button
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            disabled={saving}
            className={`${isEditing ? "btn-primary" : "btn-secondary"} mt-5`}
          >
            {saving ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> Saving…
              </>
            ) : isEditing ? (
              <>
                <FaSave /> Save changes
              </>
            ) : (
              <>
                <FaEdit /> Edit profile
              </>
            )}
          </button>
        </div>

        {/* Fields */}
        <div className="mt-8 space-y-4">
          {[
            { key: "name", label: "Full name", icon: <FaUser className="text-violet-300" />, placeholder: "Your name" },
            { key: "email", label: "Email", icon: <FaEnvelope className="text-sky-300" />, placeholder: "you@example.com", readOnly: true },
            { key: "phone", label: "Phone", icon: <FaPhone className="text-indigo-300" />, placeholder: "+92 300 0000000" },
            { key: "address", label: "Address", icon: <FaMapMarkerAlt className="text-fuchsia-300" />, placeholder: "City, Country" },
          ].map((field) => (
            <div key={field.key} className="glass-card !rounded-xl flex items-center gap-3 p-3.5">
              <span>{field.icon}</span>
              <input
                name={field.key}
                value={user[field.key] || ""}
                onChange={handleChange}
                disabled={!isEditing || field.readOnly}
                placeholder={field.placeholder}
                className="w-full bg-transparent text-sm text-white placeholder-slate-500 outline-none disabled:text-slate-400"
              />
            </div>
          ))}
        </div>

        <p className="mt-4 text-center text-xs text-slate-500">
          Email changes are handled in Settings for security.
        </p>
      </div>
    </PageShell>
  );
}
