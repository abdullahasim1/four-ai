"use client";

import { useEffect, useMemo, useState } from "react";
import {
  FaBookOpen,
  FaCommentDots,
  FaDownload,
  FaHeadphones,
  FaLanguage,
  FaMicrophoneAlt,
  FaPlay,
  FaStop,
  FaUser,
  FaVolumeUp,
  FaWaveSquare,
} from "react-icons/fa";

import PageShell, { PageHeader } from "@/components/PageShell";
import FloatingIcons from "@/components/FloatingIcons";
import { toast } from "@/lib/toast";
import useSpeech from "@/lib/useSpeech";
import { accountApi } from "@/lib/api";

const MAX_CHARS = 5000;

const PRESETS = [
  { name: "Document narration", icon: <FaBookOpen className="text-indigo-300" />, text: "Chapter one. In the beginning, the universe was neither quiet nor empty — it hummed with possibility." },
  { name: "Video voiceover", icon: <FaVolumeUp className="text-fuchsia-300" />, text: "What if I told you that everything you know about productivity is wrong? Stay with me — this changes everything." },
  { name: "Podcast intro", icon: <FaMicrophoneAlt className="text-violet-300" />, text: "You're listening to Deep Signals, the show where we decode the technology shaping tomorrow. Let's get into it." },
  { name: "Casual message", icon: <FaCommentDots className="text-sky-300" />, text: "Hey! Just checking in — let me know when you're free to catch up this week." },
];

export default function TextToSpeech() {
  const [text, setText] = useState("");
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState("en-US");
  const [speed, setSpeed] = useState(1);
  const { voices, isSpeaking, speak, pause, resume, stop } = useSpeech();

  const languages = useMemo(
    () => [...new Set(voices.map((v) => v.lang))].sort(),
    [voices]
  );
  const filteredVoices = useMemo(
    () => voices.filter((v) => v.lang === selectedLanguage),
    [voices, selectedLanguage]
  );

  // Defaults once voices load
  useEffect(() => {
    if (voices.length && !selectedVoice) {
      const def = voices.find((v) => v.default && v.lang.startsWith("en")) || voices.find((v) => v.lang.startsWith("en")) || voices[0];
      setSelectedVoice(def);
      setSelectedLanguage(def.lang);
    }
  }, [voices, selectedVoice]);

  const handleLanguageChange = (lang) => {
    setSelectedLanguage(lang);
    const next = voices.find((v) => v.lang === lang);
    if (next) setSelectedVoice(next);
  };

  const handlePlayPause = () => {
    if (!text.trim()) {
      toast.error("Enter some text first");
      return;
    }
    if (isSpeaking) {
      pause();
      return;
    }
    if (window.speechSynthesis?.paused && window.speechSynthesis?.speaking) {
      resume();
      return;
    }
    speak({ text, voice: selectedVoice, rate: speed });
    accountApi
      .trackActivity("text-to-speech", `Converted ${text.length} characters to speech`)
      .catch(() => {});
  };

  const previewVoice = (voice) => {
    speak({ text: `Hi, I'm ${voice.name}.`, voice, rate: speed });
  };

  const handleDownload = () => {
    toast.info("Browser speech can't be saved as a file directly — use Voice Changer to export WAV audio.");
  };

  return (
    <PageShell
      icons={<FloatingIcons icons={[<FaWaveSquare key="1" />, <FaHeadphones key="2" />, <FaVolumeUp key="3" />]} count={7} />}
      contentClassName="mx-auto max-w-5xl px-4 py-12"
    >
      <PageHeader
        icon={<FaWaveSquare className="gradient-text" />}
        title="Text to Speech"
        subtitle="Convert any text into natural speech with full control over voice, language and speed."
      />

      <div className="glass-card p-6 md:p-8">
        {/* Text area */}
        <label className="input-label"><FaBookOpen /> Your text</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, MAX_CHARS))}
          rows={6}
          placeholder="Paste an article, write a script, or type a quick note…"
          className="input-field resize-none !bg-black/30 leading-relaxed"
        />
        <div className="mt-2 flex justify-between text-xs">
          <span className="text-slate-500">Supports long-form scripts</span>
          <span className={text.length >= MAX_CHARS ? "text-rose-400" : "text-slate-500"}>
            {text.length}/{MAX_CHARS}
          </span>
        </div>

        {/* Control bar */}
        <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-white/5 pt-6">
          <div className="flex items-center gap-2">
            <FaLanguage className="text-lg text-indigo-300" />
            <select
              value={selectedLanguage}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="input-field !w-auto !py-2"
            >
              {languages.map((lang) => (
                <option key={lang} value={lang} className="bg-slate-900">{lang}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <FaUser className="text-lg text-violet-300" />
            <select
              value={selectedVoice?.name || ""}
              onChange={(e) => setSelectedVoice(voices.find((v) => v.name === e.target.value))}
              className="input-field !w-auto max-w-[220px] !py-2"
            >
              {(filteredVoices.length ? filteredVoices : voices).map((voice) => (
                <option key={voice.name} value={voice.name} className="bg-slate-900">
                  {voice.name} ({voice.lang})
                </option>
              ))}
            </select>
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-400">
            Speed
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={speed}
              onChange={(e) => setSpeed(parseFloat(e.target.value))}
              className="w-28 accent-indigo-500"
            />
            <span className="w-8 tabular-nums">{speed.toFixed(1)}x</span>
          </label>

          <div className="ml-auto flex items-center gap-2">
            <button onClick={stop} disabled={!isSpeaking} className="btn-secondary !px-3 !py-2.5" title="Stop">
              <FaStop />
            </button>
            <button
              onClick={handleDownload}
              className="btn-secondary !px-3 !py-2.5"
              title="Export audio"
            >
              <FaDownload />
            </button>
            <button onClick={handlePlayPause} className="btn-primary" disabled={!text.trim()}>
              {isSpeaking ? (
                <>
                  <FaStop className="rotate-90" /> Pause
                </>
              ) : (
                <>
                  <FaPlay /> Play
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Voice gallery */}
      <h3 className="mt-10 mb-4 flex items-center gap-2 font-display text-lg font-semibold text-white">
        <FaMicrophoneAlt className="text-indigo-300" /> Available voices
      </h3>
      {voices.length === 0 ? (
        <p className="glass-card p-6 text-center text-sm text-slate-400">
          No system voices detected yet — try reloading the page.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {(filteredVoices.length ? filteredVoices : voices).map((voice) => (
            <button
              key={voice.name + voice.lang}
              onClick={() => setSelectedVoice(voice)}
              className={`glass-card group flex items-center gap-4 p-4 text-left transition-all hover:-translate-y-0.5 ${
                selectedVoice?.name === voice.name ? "!border-indigo-400/50 !bg-indigo-500/10" : ""
              }`}
            >
              <span className="rounded-xl bg-gradient-to-br from-indigo-500/30 to-fuchsia-500/30 p-3 text-indigo-200">
                <FaUser />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-semibold text-white">{voice.name}</span>
                <span className="block text-xs text-slate-400">{voice.lang}{voice.default ? " · default" : ""}</span>
              </span>
              <span
                role="button"
                tabIndex={0}
                aria-label={`Preview ${voice.name}`}
                onClick={(e) => {
                  e.stopPropagation();
                  previewVoice(voice);
                }}
                onKeyDown={(e) => e.key === "Enter" && previewVoice(voice)}
                className="rounded-full border border-white/10 bg-white/5 p-2.5 text-xs transition-all hover:border-indigo-400/40 hover:text-indigo-300"
              >
                <FaPlay />
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Presets */}
      <h3 className="mt-10 mb-4 font-display text-lg font-semibold text-white">Use-case presets</h3>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {PRESETS.map((preset) => (
          <button
            key={preset.name}
            onClick={() => {
              setText(preset.text);
              toast.info(`"${preset.name}" loaded`);
            }}
            className="glass-card flex flex-col items-center gap-2 p-5 text-center transition-all hover:-translate-y-1 hover:border-indigo-400/30"
          >
            <span className="text-xl">{preset.icon}</span>
            <span className="text-sm font-medium text-slate-200">{preset.name}</span>
          </button>
        ))}
      </div>
    </PageShell>
  );
}
