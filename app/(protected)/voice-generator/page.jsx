"use client";

import Link from "next/link";
import { FaImage, FaMagic, FaMicrophone, FaVolumeUp } from "react-icons/fa";

import PageShell, { PageHeader } from "@/components/PageShell";
import FloatingIcons from "@/components/FloatingIcons";
import { VoiceGeneratorTool } from "@/components/VoiceGeneratorTool";

const TOOLS = [
  {
    title: "Text to Speech",
    description: "Convert text into natural-sounding speech",
    icon: <FaVolumeUp className="text-xl" />,
    route: "/text-to-speech",
    gradient: "from-indigo-500 to-violet-500",
  },
  {
    title: "Voice Changer",
    description: "Apply studio effects to any audio file",
    icon: <FaMagic className="text-xl" />,
    route: "/voicechanger",
    gradient: "from-fuchsia-500 to-pink-500",
  },
  {
    title: "Image Generator",
    description: "Turn prompts into AI artwork",
    icon: <FaImage className="text-xl" />,
    route: "/imagegenerator",
    gradient: "from-emerald-500 to-teal-500",
  },
];

export default function VoiceGeneratorPage() {
  return (
    <PageShell
      icons={<FloatingIcons icons={[<FaMicrophone key="1" />, <FaVolumeUp key="2" />, <FaMagic key="3" />]} count={7} />}
      contentClassName="mx-auto max-w-6xl px-4 py-12"
    >
      <PageHeader
        icon={<FaMicrophone className="gradient-text" />}
        title="AI Voice Generator"
        subtitle="Type anything and hear it spoken in natural, human-like voices — powered by your browser's speech engine."
      />

      {/* Tool cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {TOOLS.map((tool) => (
          <Link
            key={tool.route}
            href={tool.route}
            className="glass-card group p-5 text-left transition-all hover:-translate-y-1 hover:border-indigo-400/30"
          >
            <span className={`inline-flex rounded-xl bg-gradient-to-br ${tool.gradient} p-3 text-white shadow-lg transition-transform group-hover:scale-110`}>
              {tool.icon}
            </span>
            <h3 className="mt-3 font-semibold text-white">{tool.title}</h3>
            <p className="mt-1 text-sm text-slate-400">{tool.description}</p>
          </Link>
        ))}
      </div>

      {/* Main editor card */}
      <VoiceGeneratorTool />
    </PageShell>
  );
}
