"use client";

import Link from "next/link";
import {
  FaDiscord,
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";

const COLUMNS = [
  {
    title: "AI Tools",
    links: [
      { label: "Voice Generator", to: "/voice-generator" },
      { label: "Text to Speech", to: "/text-to-speech" },
      { label: "Speech to Text", to: "/speech-to-text" },
      { label: "Voice Changer", to: "/voicechanger" },
      { label: "Image Generator", to: "/imagegenerator" },
      { label: "Voice Library", to: "/explore-voice-library" },
    ],
  },
  {
    title: "Product",
    links: [
      { label: "Features", to: "/features" },
      { label: "Pricing", to: "/pricing" },
      { label: "Team", to: "/team" },
      { label: "Home", to: "/home" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Log in", to: "/login" },
      { label: "Sign up", to: "/signup" },
      { label: "Profile", to: "/profile" },
      { label: "History", to: "/history" },
    ],
  },
];

const SOCIALS = [
  { icon: FaGithub, label: "GitHub" },
  { icon: FaLinkedin, label: "LinkedIn" },
  { icon: FaTwitter, label: "Twitter" },
  { icon: FaInstagram, label: "Instagram" },
  { icon: FaYoutube, label: "YouTube" },
  { icon: FaDiscord, label: "Discord" },
];

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/5 bg-[#050810]">
      <div data-reveal className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
          {/* Brand */}
          <div className="col-span-2 md:col-span-2">
            <Link href="/home" className="flex items-center gap-2.5">
              <img src="/logo.png" alt="Four AI logo" className="h-9 w-auto rounded-md" />
              <span className="font-display text-xl font-bold text-white">
                Four<span className="gradient-text"> AI</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
              Studio-grade AI voice and image generation. Create natural speech, transform
              audio, and turn ideas into visuals — all in one place.
            </p>
            <div className="mt-6 flex gap-3">
              {SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href="#"
                  aria-label={social.label}
                  onClick={(e) => e.preventDefault()}
                  className="rounded-lg border border-white/10 bg-white/5 p-2.5 text-slate-400 transition-all hover:-translate-y-0.5 hover:border-indigo-400/40 hover:text-indigo-300"
                >
                  <social.icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {COLUMNS.map((column) => (
            <div key={column.title}>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-200">
                {column.title}
              </h4>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.to}
                      className="text-sm text-slate-400 transition-colors hover:text-indigo-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/5 pt-6 sm:flex-row">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} Four AI. All rights reserved.
          </p>
          <p className="text-xs text-slate-500">Built for creators, powered by AI.</p>
        </div>
      </div>
    </footer>
  );
}
