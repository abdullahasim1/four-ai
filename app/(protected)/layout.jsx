"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getSession } from "@/lib/auth-client";

/**
 * Client-side auth guard + shell for tools & account pages.
 */
export default function ProtectedLayout({ children }) {
  const [session, setSession] = useState(undefined); // undefined = checking
  const router = useRouter();

  useEffect(() => {
    setSession(getSession());
  }, []);

  useEffect(() => {
    if (session === null) router.replace("/login");
  }, [session, router]);

  if (!session) {
    return (
      <div className="page-shell relative flex min-h-screen items-center justify-center">
        <div className="mesh-bg absolute inset-0" aria-hidden="true" />
        <span className="relative z-10 h-10 w-10 animate-spin rounded-full border-2 border-indigo-400/30 border-t-indigo-400" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
