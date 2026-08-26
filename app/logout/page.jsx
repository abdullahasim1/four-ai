"use client";

import { useEffect } from "react";
import PageShell from "@/components/PageShell";
import FloatingIcons from "@/components/FloatingIcons";
import { FaMagic, FaMicrophoneAlt } from "react-icons/fa";
import { authApi } from "@/lib/api";
import { clearSession, getSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      const session = getSession();
      if (session) {
        try {
          await authApi.logout();
        } catch {
          /* best effort — clear locally regardless */
        }
      }
      clearSession();
      window.dispatchEvent(new Event("fourai:auth-changed"));
      if (!cancelled) {
        setTimeout(() => router.push("/login"), 600);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <PageShell icons={<FloatingIcons icons={[<FaMagic key="1" />, <FaMicrophoneAlt key="2" />]} count={6} />} contentClassName="flex min-h-screen items-center justify-center px-4">
      <div className="text-center">
        <span className="mx-auto mb-4 block h-10 w-10 animate-spin rounded-full border-2 border-indigo-400/30 border-t-indigo-400" />
        <h2 className="font-display text-xl font-semibold text-white">Logging you out…</h2>
        <p className="mt-2 text-sm text-slate-400">See you soon.</p>
      </div>
    </PageShell>
  );
}
