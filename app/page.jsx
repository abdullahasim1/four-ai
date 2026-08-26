"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { FaArrowRight, FaHeadphones, FaImage, FaMagic, FaMicrophoneAlt } from "react-icons/fa";

import PageShell from "@/components/PageShell";
import Link from "next/link";
import { getSession } from "@/lib/auth-client";

function SplitLine({ text, className = "" }) {
  return (
    <span className={`block overflow-hidden pb-1 ${className}`}>
      {Array.from(text).map((char, i) => (
        <span key={i} data-char className="inline-block will-change-transform">
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  );
}

const HIGHLIGHTS = [
  {
    icon: <FaMicrophoneAlt className="text-xl" />,
    title: "Natural AI Voices",
    text: "Instantly turn any script into expressive, human-like speech.",
  },
  {
    icon: <FaMagic className="text-xl" />,
    title: "Voice Effects Studio",
    text: "Robot, reverb, echo and more — applied right in your browser.",
  },
  {
    icon: <FaImage className="text-xl" />,
    title: "Text to Image",
    text: "Describe anything and watch it become artwork in seconds.",
  },
];

export default function Startpage() {
  const titleRef = useRef(null);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(Boolean(getSession()));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const chars = titleRef.current?.querySelectorAll("[data-char]");
    if (!chars?.length) return;
    const tween = gsap.from(chars, {
      yPercent: 130,
      opacity: 0,
      rotateZ: 6,
      duration: 0.85,
      ease: "power4.out",
      stagger: 0.032,
      delay: 0.2,
    });
    return () => tween.kill();
  }, []);

  return (
    <PageShell
      contentClassName="relative flex min-h-screen flex-col items-center justify-center px-4 py-24 text-center"
    >
      {/* Glow orb */}
      <div
        aria-hidden="true"
        data-parallax="-70"
        className="pointer-events-none absolute left-1/2 top-1/3 h-[480px] w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-600/20 blur-[120px] will-change-transform"
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 max-w-4xl"
      >
        <span className="badge mx-auto">
          <FaHeadphones /> AI Voice & Image Studio
        </span>

        <h1
          ref={titleRef}
          className="mt-6 font-display text-5xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-7xl"
        >
          <SplitLine text="Create voices." />
          <SplitLine text="Generate art." className="gradient-text" />
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-400">
          Four AI puts studio-grade voice generation, audio effects and image creation in one
          clean workspace. No installs, no complexity — just create.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          {loggedIn ? (
            <Link href="/voice-generator" className="btn-primary !px-8 !py-3.5 !text-base">
              Open studio <FaArrowRight />
            </Link>
          ) : (
            <Link href="/signup" className="btn-primary !px-8 !py-3.5 !text-base">
              Get started free <FaArrowRight />
            </Link>
          )}
          <Link href="/features" className="btn-secondary !px-8 !py-3.5 !text-base">
            See what it can do
          </Link>
        </div>

        {/* Feature highlights */}
        <div className="mt-20 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {HIGHLIGHTS.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.15, duration: 0.55 }}
              className="glass-card p-6 text-left transition-all hover:-translate-y-1 hover:border-indigo-400/30"
            >
              <span className="inline-flex rounded-xl bg-gradient-to-br from-indigo-500/30 to-fuchsia-500/30 p-3 text-indigo-200">
                {item.icon}
              </span>
              <h3 className="mt-4 font-semibold text-white">{item.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2"
      >
        <div className="h-9 w-5 rounded-full border-2 border-slate-600 p-1">
          <motion.span
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.6 }}
            className="block h-1.5 w-1.5 rounded-full bg-indigo-300"
          />
        </div>
      </motion.div>
    </PageShell>
  );
}
