"use client";

import { motion } from "framer-motion";
import {
  FaArrowRight,
  FaHeadphones,
  FaMicrophone,
  FaStar,
  FaVolumeUp,
} from "react-icons/fa";
import Link from "next/link";

import PageShell, { PageHeader } from "@/components/PageShell";
import FloatingIcons from "@/components/FloatingIcons";

const FEATURED = [
  {
    name: "Carter's Edge",
    description: "A rugged & masculine voice — perfect for narration and podcasts.",
    icon: <FaMicrophone className="text-xl" />,
    listens: "17.8m",
    rating: "4.9",
    gradient: "from-pink-500 to-purple-500",
  },
  {
    name: "Carter Motivational",
    description: "A commanding voice for motivational content and speeches.",
    icon: <FaHeadphones className="text-xl" />,
    listens: "5.4m",
    rating: "4.8",
    gradient: "from-cyan-500 to-blue-500",
  },
  {
    name: "Sophie AI",
    description: "A warm, friendly female voice for guides and support content.",
    icon: <FaVolumeUp className="text-xl" />,
    listens: "8.2m",
    rating: "4.7",
    gradient: "from-emerald-500 to-teal-500",
  },
];

export default function ExploreVoiceLibrary() {
  return (
    <PageShell
      icons={<FloatingIcons icons={[<FaMicrophone key="1" />, <FaVolumeUp key="2" />, <FaStar key="3" />]} count={8} />}
      contentClassName="mx-auto max-w-6xl px-4 py-16 sm:px-6"
    >
      <PageHeader
        icon={<FaHeadphones className="gradient-text" />}
        title="Explore Voice Library"
        subtitle="Discover signature voices crafted for every kind of project. Preview them in the Voice Generator."
      />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {FEATURED.map((voice, i) => (
          <motion.div
            key={voice.name}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.12 }}
            className="glass-card group p-7 text-center transition-all hover:-translate-y-1.5 hover:border-indigo-400/30"
          >
            <span className={`inline-flex rounded-2xl bg-gradient-to-br ${voice.gradient} p-4 text-white shadow-lg transition-transform group-hover:scale-110`}>
              {voice.icon}
            </span>
            <h3 className="mt-4 font-display text-lg font-semibold text-white">{voice.name}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">{voice.description}</p>
            <div className="mt-5 flex items-center justify-center gap-5 border-t border-white/5 pt-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5"><FaHeadphones /> {voice.listens} plays</span>
              <span className="flex items-center gap-1.5"><FaStar className="text-amber-300" /> {voice.rating}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="glass-card mt-10 flex flex-col items-center justify-between gap-5 p-8 text-center sm:flex-row sm:text-left"
      >
        <div>
          <h3 className="font-display text-lg font-semibold text-white">Want to hear these voices?</h3>
          <p className="mt-1 text-sm text-slate-400">
            Open the Voice Generator and pick any system voice to preview instantly.
          </p>
        </div>
        <Link href="/voice-generator" className="btn-primary shrink-0">
          Try Voice Generator <FaArrowRight />
        </Link>
      </motion.div>

      <p data-reveal className="mt-8 text-center text-xs text-slate-500">
        More curated voices are on the way.
      </p>
    </PageShell>
  );
}
