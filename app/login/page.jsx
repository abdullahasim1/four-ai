"use client";

import { Suspense, useEffect, useState } from "react";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { motion } from "framer-motion";

import PageShell from "@/components/PageShell";
import FloatingIcons from "@/components/FloatingIcons";
import { toast } from "@/lib/toast";
import { FaMagic, FaMicrophoneAlt } from "react-icons/fa";
import { authApi } from "@/lib/api";
import { setSession, isLoggedIn, isAdmin } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

const VERIFIED_MESSAGES = {
  "1": { tone: "ok", text: "Email confirmed successfully! You can log in now." },
  invalid: { tone: "err", text: "This verification link is invalid or has expired." },
  error: { tone: "err", text: "Something went wrong while verifying your email. Please try again." },
};

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [needsVerification, setNeedsVerification] = useState(false);
  const [resending, setResending] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Already logged in? Never show the login form again
  useEffect(() => {
    if (isLoggedIn()) {
      router.replace(isAdmin() ? "/admin/dashboard" : "/home");
      return;
    }
    setAuthChecked(true);
  }, [router]);

  useEffect(() => {
    const status = VERIFIED_MESSAGES[searchParams.get("verified")];
    if (status) {
      if (status.tone === "ok") setNotice(status.text);
      else setError(status.text);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleResend = async () => {
    setResending(true);
    try {
      const data = await authApi.resendVerification(email);
      toast.success(data.message || "Confirmation email sent!");
    } catch (err) {
      toast.error(err.message || "Could not send email. Please try again.");
    } finally {
      setResending(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setNotice("");
    setNeedsVerification(false);
    setLoading(true);
    try {
      const data = await authApi.login({ email, password });
      if (data.success) {
        setSession(data.token, data.user);
        window.dispatchEvent(new Event("fourai:auth-changed"));
        toast.success(`Welcome back, ${data.user.name}!`);
        router.push(data.user.role === "admin" ? "/admin/dashboard" : "/home");
      } else {
        setError(data.message || "Login failed");
        setNeedsVerification(Boolean(data.needsVerification));
      }
    } catch (err) {
      setError(err.message || "Login failed. Is the server reachable?");
      if (err.status === 403) setNeedsVerification(true);
    } finally {
      setLoading(false);
    }
  };

  if (!authChecked) {
    return (
      <PageShell contentClassName="flex min-h-screen items-center justify-center">
        <span className="h-10 w-10 animate-spin rounded-full border-2 border-indigo-400/30 border-t-indigo-400" />
      </PageShell>
    );
  }

  return (
    <PageShell icons={<FloatingIcons icons={[<FaMagic key="1" />, <FaMicrophoneAlt key="2" />]} count={6} />} contentClassName="flex min-h-screen items-center justify-center px-4 py-16">
      <motion.div
        initial={{ scale: 0.97, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 20 }}
        className="glass-card w-full max-w-md p-8"
      >
        <Link href="/" className="mb-8 flex items-center justify-center gap-2">
          <img src="/logo.png" alt="Four AI" className="h-10 w-auto rounded-lg" />
        </Link>

        <h1 className="text-center font-display text-2xl font-bold text-white">Welcome back</h1>
        <p className="mt-2 text-center text-sm text-slate-400">
          Log in to continue creating with Four AI
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="input-label" htmlFor="login-email"><FaEnvelope /> Email</label>
            <input
              id="login-email"
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
            <div className="flex items-center justify-between">
              <label className="input-label" htmlFor="login-password"><FaLock /> Password</label>
              <Link href="/forgot-password" className="mb-[0.45rem] text-xs text-indigo-300 hover:text-indigo-200 hover:underline">
                Forgot password?
              </Link>
            </div>
            <input
              id="login-password"
              type="password"
              required
              autoComplete="current-password"
              className="input-field"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          {notice && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-center text-sm text-emerald-300"
            >
              {notice}
            </motion.p>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-center text-sm text-rose-300"
            >
              <p>{error}</p>
              {needsVerification && (
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resending || !email}
                  className="mt-2 font-semibold text-indigo-300 underline-offset-2 hover:text-indigo-200 hover:underline disabled:opacity-50"
                >
                  {resending ? "Sending…" : "Resend confirmation email"}
                </button>
              )}
            </motion.div>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Signing in…
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-medium text-indigo-300 hover:text-indigo-200">
            Create one free
          </Link>
        </p>
      </motion.div>
    </PageShell>
  );
}

export default function Login() {
  return (
    <Suspense
      fallback={
        <PageShell contentClassName="flex min-h-screen items-center justify-center">
          <span className="h-10 w-10 animate-spin rounded-full border-2 border-indigo-400/30 border-t-indigo-400" />
        </PageShell>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
