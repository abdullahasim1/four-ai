"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaArrowRight,
  FaBolt,
  FaCloud,
  FaGlobe,
  FaHeadphones,
  FaMicrophone,
  FaPalette,
  FaRobot,
  FaShieldAlt,
  FaVolumeUp,
} from "react-icons/fa";
import Link from "next/link";

import PageShell from "@/components/PageShell";
import FloatingIcons from "@/components/FloatingIcons";
import { getSession } from "@/lib/auth-client";

const CORE = [
  { title: "AI voice generation", text: "Generate natural, expressive speech from any text with advanced neural voices.", icon: <FaMicrophone />, gradient: "from-pink-500 to-purple-500" },
  { title: "Voice effects studio", text: "Robot, echo, reverb, distortion, tremolo — nine effects applied instantly in the browser.", icon: <FaRobot />, gradient: "from-blue-500 to-indigo-500" },
  { title: "AI image generation", text: "Describe a scene and watch it become artwork, powered by Stable Diffusion.", icon: <FaPalette />, gradient: "from-green-500 to-emerald-500" },
  { title: "Multi-language support", text: "Dozens of system voices and languages for truly global content.", icon: <FaGlobe />, gradient: "from-amber-500 to-orange-500" },
  { title: "Real-time playback", text: "Instant previews with adjustable speed so you can iterate quickly.", icon: <FaBolt />, gradient: "from-cyan-500 to-blue-500" },
  { title: "Secure by default", text: "API keys stay on our server. Your audio never leaves your browser unless you ask.", icon: <FaShieldAlt />, gradient: "from-indigo-500 to-violet-500" },
];

const EXTRAS = [
  { title: "Usage history", text: "Every generation is logged to your account automatically." },
  { title: "Profile & avatar", text: "Personalize how you show up across the platform." },
  { title: "Admin controls", text: "User management with instant ban / unban." },
  { title: "WAV export", text: "Download processed audio as clean WAV files." },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.55, delay },
});

export default function Features() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(Boolean(getSession()));
  }, []);

  return (
    <PageShell
      icons={<FloatingIcons icons={[<FaHeadphones key="1" />, <FaVolumeUp key="2" />, <FaCloud key="3" />]} count={8} />}
      contentClassName="mx-auto max-w-7xl px-4 py-16 sm:px-6"
    >
      {/* Hero */}
      <motion.div {...fadeUp()} className="mx-auto max-w-2xl text-center">
        <span className="badge mx-auto">Features</span>
        <h1 className="mt-4 section-title">Everything Four AI can do</h1>
        <p className="section-subtitle">
          A complete creative toolkit for voice and image — thoughtfully built, fast and private.
        </p>
      </motion.div>

      {/* Core grid */}
      <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {CORE.map((feature, i) => (
          <motion.div key={feature.title} {...fadeUp(i * 0.05)}>
            <div className="glass-card group h-full p-6 transition-all hover:-translate-y-1 hover:border-indigo-400/25">
              <span className={`inline-flex rounded-xl bg-gradient-to-br ${feature.gradient} p-3.5 text-white shadow-lg transition-transform group-hover:scale-110`}>
                {feature.icon}
              </span>
              <h3 className="mt-4 font-semibold text-white">{feature.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{feature.text}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Extras strip */}
      <motion.div {...fadeUp()} className="glass-card mt-14 p-8">
        <h2 className="text-center font-display text-xl font-semibold text-white">And there&apos;s more</h2>
        <div className="mt-6 grid grid-cols-1 gap-x-10 gap-y-4 sm:grid-cols-2">
          {EXTRAS.map((extra) => (
            <div key={extra.title} className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-gradient-to-br from-indigo-400 to-fuchsia-400" />
              <p className="text-sm leading-relaxed text-slate-300">
                <span className="font-semibold text-white">{extra.title}</span> — {extra.text}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div {...fadeUp()} className="py-16 text-center">
        <h2 className="section-title">{loggedIn ? "Jump back in" : "Try it for yourself"}</h2>
        <p className="section-subtitle">
          {loggedIn
            ? "Your studio is ready — pick a tool and start creating."
            : "Free account. No credit card required."}
        </p>
        {loggedIn ? (
          <Link href="/voice-generator" className="btn-primary group mt-8 !px-8 !py-3.5 !text-base">
            Open AI Tools <FaArrowRight className="transition-transform group-hover:translate-x-1" />
          </Link>
        ) : (
          <Link href="/signup" className="btn-primary group mt-8 !px-8 !py-3.5 !text-base">
            Create free account <FaArrowRight className="transition-transform group-hover:translate-x-1" />
          </Link>
        )}
      </motion.div>
    </PageShell>
  );
}
