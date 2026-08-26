"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaChevronDown,
  FaClosedCaptioning,
  FaCog,
  FaHistory,
  FaImage,
  FaMicrophoneAlt,
  FaSignOutAlt,
  FaSlidersH,
  FaUser,
  FaUserCircle,
  FaVolumeUp,
} from "react-icons/fa";
import { clearSession, getSession } from "@/lib/auth-client";
import { authApi } from "@/lib/api";

const NAV_LINKS = [
  { title: "Home", path: "/home" },
  { title: "Features", path: "/features" },
  { title: "Pricing", path: "/pricing" },
  { title: "Team", path: "/team" },
];

const AI_TOOLS = [
  { to: "/voice-generator", label: "Voice Generator", icon: <FaMicrophoneAlt /> },
  { to: "/text-to-speech", label: "Text to Speech", icon: <FaVolumeUp /> },
  { to: "/speech-to-text", label: "Speech to Text", icon: <FaClosedCaptioning /> },
  { to: "/voicechanger", label: "Voice Changer", icon: <FaSlidersH /> },
  { to: "/imagegenerator", label: "Image Generator", icon: <FaImage /> },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [session, setSession] = useState(null);
  const dropdownRef = useRef(null);
  const toolsRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
    setToolsOpen(false);
  }, [pathname]);

  useEffect(() => {
    setSession(getSession());
    const sync = () => setSession(getSession());
    window.addEventListener("fourai:auth-changed", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("fourai:auth-changed", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  useEffect(() => {
    const onClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (toolsRef.current && !toolsRef.current.contains(event.target)) {
        setToolsOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch {
      /* session may already be gone */
    }
    clearSession();
    window.dispatchEvent(new Event("fourai:auth-changed"));
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[#070b16]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/home" className="flex items-center gap-2.5">
          <img src="/logo.png" alt="Four AI logo" className="h-8 w-auto rounded-md" />
          <span className="font-display text-lg font-bold tracking-tight text-white">
            Four<span className="gradient-text"> AI</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={`nav-link ${pathname === link.path ? "active" : ""}`}
            >
              {link.title}
            </Link>
          ))}

          {/* AI Tools dropdown */}
          <div className="relative" ref={toolsRef}>
            <button
              onClick={() => setToolsOpen((v) => !v)}
              className={`flex items-center gap-1.5 nav-link ${
                AI_TOOLS.some((t) => t.to === pathname) ? "active" : ""
              }`}
            >
              AI Tools
              <FaChevronDown className={`text-[10px] transition-transform ${toolsOpen ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {toolsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 mt-2 w-56 overflow-hidden rounded-xl border border-white/10 bg-slate-900/95 shadow-2xl shadow-black/50 backdrop-blur-xl"
                >
                  {AI_TOOLS.map((tool) => (
                    <Link
                      key={tool.to}
                      href={tool.to}
                      onClick={() => setToolsOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
                    >
                      <span className="text-indigo-300">{tool.icon}</span>
                      {tool.label}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {!session ? (
            <>
              <Link href="/login" className="hidden text-sm font-medium text-slate-300 transition-colors hover:text-white sm:block">
                Log in
              </Link>
              <Link href="/signup" className="btn-primary !px-4 !py-2 !text-sm">
                Get Started
              </Link>
            </>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((v) => !v)}
                className="flex items-center gap-2.5 rounded-full border border-white/10 bg-white/5 py-1.5 pl-1.5 pr-3 transition-colors hover:border-white/20"
              >
                {session.user.avatar ? (
                  <img src={session.user.avatar} alt="" className="h-7 w-7 rounded-full object-cover" />
                ) : (
                  <FaUserCircle className="h-6 w-6 text-indigo-300" />
                )}
                <span className="hidden max-w-[120px] truncate text-sm font-medium text-slate-200 sm:block">
                  {session.user.name}
                </span>
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-white/10 bg-slate-900/95 shadow-2xl shadow-black/50 backdrop-blur-xl"
                  >
                    <div className="border-b border-white/5 px-4 py-3">
                      <p className="truncate text-sm font-semibold text-white">{session.user.name}</p>
                      <p className="truncate text-xs text-slate-400">{session.user.email}</p>
                    </div>
                    {[
                      { to: "/profile", icon: <FaUser />, label: "My Profile" },
                      { to: "/history", icon: <FaHistory />, label: "History" },
                      { to: "/settings", icon: <FaCog />, label: "Settings" },
                    ].map((item) => (
                      <Link
                        key={item.to}
                        href={item.to}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
                      >
                        <span className="text-indigo-300">{item.icon}</span>
                        {item.label}
                      </Link>
                    ))}
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-rose-300 transition-colors hover:bg-rose-500/10"
                    >
                      <FaSignOutAlt /> Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Mobile toggle */}
          <button
            className="rounded-lg p-2 text-slate-300 transition-colors hover:bg-white/5 md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={mobileOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-white/5 bg-[#070b16]/95 md:hidden"
          >
            <div className="space-y-1 px-4 py-3">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`block rounded-lg px-3 py-2 text-sm ${
                    pathname === link.path ? "bg-indigo-500/20 text-white" : "text-slate-300"
                  }`}
                >
                  {link.title}
                </Link>
              ))}

              <p className="px-3 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                AI Tools
              </p>
              {AI_TOOLS.map((tool) => (
                <Link
                  key={tool.to}
                  href={tool.to}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${
                    pathname === tool.to ? "bg-indigo-500/20 text-white" : "text-slate-300"
                  }`}
                >
                  <span className="text-indigo-300">{tool.icon}</span>
                  {tool.label}
                </Link>
              ))}

              {!session && (
                <Link href="/login" className="block rounded-lg px-3 py-2 text-sm text-slate-300">
                  Log in
                </Link>
              )}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
