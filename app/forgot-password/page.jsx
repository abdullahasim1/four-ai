"use client";

import { useState } from "react";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { motion } from "framer-motion";

import PageShell from "@/components/PageShell";
import { toast } from "@/lib/toast";
import { authApi } from "@/lib/api";
import Link from "next/link";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (newPassword.length < 6) {
      return setError("New password must be at least 6 characters");
    }
    setLoading(true);
    try {
      const data = await authApi.forgotPassword({ email, newPassword });
      if (data.success) {
        setDone(true);
        toast.success(data.message || "Password updated");
      } else {
        setError(data.message || "Failed to update password");
      }
    } catch (err) {
      setError(err.message || "Error updating password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell contentClassName="flex min-h-screen items-center justify-center px-4 py-16">
      <motion.div
        initial={{ scale: 0.97, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 20 }}
        className="glass-card w-full max-w-md p-8"
      >
        <h1 className="text-center font-display text-2xl font-bold text-white">Reset your password</h1>
        <p className="mt-2 text-center text-sm text-slate-400">
          Choose a new password for your account.
        </p>

        {done ? (
          <div className="mt-8 space-y-6 text-center">
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
              If that email exists, the password has been updated.
            </div>
            <Link href="/login" className="btn-primary w-full justify-center">
              Back to login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="input-label"><FaEnvelope /> Email</label>
              <input
                type="email"
                required
                autoComplete="email"
                className="input-field"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>

            <div>
              <label className="input-label"><FaLock /> New password</label>
              <input
                type="password"
                required
                autoComplete="new-password"
                className="input-field"
                placeholder="At least 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={loading}
              />
            </div>

            {error && (
              <p className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-center text-sm text-rose-300">
                {error}
              </p>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? "Updating…" : "Reset password"}
            </button>

            <p className="text-center text-sm text-slate-400">
              Remembered it?{" "}
              <Link href="/login" className="font-medium text-indigo-300 hover:text-indigo-200">
                Log in
              </Link>
            </p>
          </form>
        )}
      </motion.div>
    </PageShell>
  );
}
