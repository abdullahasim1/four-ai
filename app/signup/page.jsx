"use client";

import { useState } from "react";
import { FaCheckCircle, FaEnvelope, FaLock, FaUser } from "react-icons/fa";
import { motion } from "framer-motion";

import PageShell from "@/components/PageShell";
import { toast } from "@/lib/toast";
import { authApi } from "@/lib/api";
import Link from "next/link";

const PASSWORD_MIN = 6;

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim()) return setError("Please enter your name");
    if (form.password.length < PASSWORD_MIN) {
      return setError(`Password must be at least ${PASSWORD_MIN} characters`);
    }
    if (form.password !== form.confirm) {
      return setError("Passwords do not match");
    }

    setLoading(true);
    try {
      const data = await authApi.signup({
        name: form.name,
        email: form.email,
        password: form.password,
      });
      if (data.success) {
        setPendingEmail(form.email.toLowerCase().trim());
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (pendingEmail) {
    return (
      <PageShell contentClassName="flex min-h-screen items-center justify-center px-4 py-16">
        <motion.div
          initial={{ scale: 0.97, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 20 }}
          className="glass-card w-full max-w-md p-8 text-center"
        >
          <FaCheckCircle className="mx-auto mb-4 text-5xl text-emerald-400" />
          <h1 className="font-display text-2xl font-bold text-white">Confirm your email</h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-400">
            We&apos;ve sent a confirmation link to
            <br />
            <span className="font-semibold text-white">{pendingEmail}</span>
          </p>
          <p className="mt-2 text-sm text-slate-400">
            Click the link in the email to activate your account, then log in.
          </p>
          <Link href="/login" className="btn-primary mt-6 inline-flex w-full items-center justify-center">
            Go to login
          </Link>
        </motion.div>
      </PageShell>
    );
  }

  return (
    <PageShell contentClassName="flex min-h-screen items-center justify-center px-4 py-16">
      <motion.div
        initial={{ scale: 0.97, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 20 }}
        className="glass-card w-full max-w-md p-8"
      >
        <Link href="/" className="mb-8 flex items-center justify-center gap-2">
          <img src="/logo.png" alt="Four AI" className="h-10 w-auto rounded-lg" />
        </Link>

        <h1 className="text-center font-display text-2xl font-bold text-white">Create your account</h1>
        <p className="mt-2 text-center text-sm text-slate-400">
          Free forever. Start generating in seconds.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="input-label"><FaUser /> Full name</label>
            <input
              type="text"
              required
              autoComplete="name"
              className="input-field"
              placeholder="Ada Lovelace"
              value={form.name}
              onChange={set("name")}
              disabled={loading}
            />
          </div>

          <div>
            <label className="input-label"><FaEnvelope /> Email</label>
            <input
              type="email"
              required
              autoComplete="email"
              className="input-field"
              placeholder="you@example.com"
              value={form.email}
              onChange={set("email")}
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="input-label"><FaLock /> Password</label>
              <input
                type="password"
                required
                autoComplete="new-password"
                className="input-field"
                placeholder={`Min ${PASSWORD_MIN} chars`}
                value={form.password}
                onChange={set("password")}
                disabled={loading}
              />
            </div>
            <div>
              <label className="input-label"><FaLock /> Confirm</label>
              <input
                type="password"
                required
                autoComplete="new-password"
                className="input-field"
                placeholder="Repeat password"
                value={form.confirm}
                onChange={set("confirm")}
                disabled={loading}
              />
            </div>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-center text-sm text-rose-300"
            >
              {error}
            </motion.p>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Creating account…
              </>
            ) : (
              "Create account"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-indigo-300 hover:text-indigo-200">
            Log in
          </Link>
        </p>
      </motion.div>
    </PageShell>
  );
}
