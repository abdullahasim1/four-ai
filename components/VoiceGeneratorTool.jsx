"use client";

import { useEffect, useState } from "react";
import { FaBookOpen, FaGlobe, FaMicrophone, FaPause, FaPlay, FaPodcast, FaStop, FaVideo } from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";
import { toast } from "@/lib/toast";
import useSpeech from "@/lib/useSpeech";
import { accountApi } from "@/lib/api";

const PRESETS = [
  {
    label: "Tell a story",
    icon: <FaBookOpen className="text-violet-300" />,
    text: "Once upon a time, in a world where machines could speak, a small idea sparked a revolution in how humans create…",
  },
  {
    label: "Podcast intro",
    icon: <FaPodcast className="text-emerald-300" />,
    text: "Welcome back to the show! I'm your host, and today we're diving deep into the future of artificial intelligence and creativity.",
  },
  {
    label: "Video voiceover",
    icon: <FaVideo className="text-sky-300" />,
    text: "In this video, you'll discover three powerful techniques that will completely change the way you produce content.",
  },
];

const MAX_CHARS = 500;

/**
 * The voice-generator editor card. Used standalone on /voice-generator
 * and embedded on /home.
 */
export function VoiceGeneratorTool() {
  const [text, setText] = useState(
    "The Four AI voice generator delivers high-quality, human-like speech. Perfect for audiobooks, video voiceovers, commercials, and more."
  );
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [rate, setRate] = useState(1);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { voices, isSpeaking, speak, pause, resume, stop } = useSpeech();

  // Pick a sensible default voice once loaded
  useEffect(() => {
    if (voices.length && !selectedVoice) {
      setSelectedVoice(voices.find((v) => v.default) || voices[0]);
    }
  }, [voices, selectedVoice]);

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
    speak({ text, voice: selectedVoice, rate });
    accountApi
      .trackActivity(
        "voice-generator",
        `Generated voice preview: "${text.slice(0, 40)}${text.length > 40 ? "…" : ""}"`
      )
      .catch(() => {});
  };

  const applyPreset = (presetText) => {
    setText(presetText);
    toast.info("Sample text added — press play to hear it");
  };

  return (
    <div className="glass-card p-6 md:p-8">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value.slice(0, MAX_CHARS))}
        rows={5}
        placeholder="Type or paste your script here…"
        className="input-field resize-none !bg-black/30 leading-relaxed"
      />
      <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
        <span>{text.length > MAX_CHARS - 50 ? "Approaching limit" : "Tip: punctuation makes pacing sound natural"}</span>
        <span className={text.length >= MAX_CHARS ? "text-rose-400" : ""}>
          {text.length}/{MAX_CHARS}
        </span>
      </div>

      {/* Controls */}
      <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-white/5 pt-6">
        {/* Voice selector */}
        <div className="relative">
          <button onClick={() => setDropdownOpen((v) => !v)} className="btn-secondary !py-2.5" type="button">
            <FaMicrophone className="text-indigo-300" />
            <span className="max-w-[140px] truncate">
              {selectedVoice ? selectedVoice.name : "Loading voices…"}
            </span>
            <IoMdArrowDropdown />
          </button>
          {dropdownOpen && (
            <div className="absolute z-20 mt-2 max-h-60 w-56 overflow-y-auto rounded-xl border border-white/10 bg-slate-900/95 py-1 shadow-2xl backdrop-blur-xl">
              {voices.map((v) => (
                <button
                  key={v.name + v.lang}
                  onClick={() => {
                    setSelectedVoice(v);
                    setDropdownOpen(false);
                  }}
                  className={`flex w-full items-center justify-between px-4 py-2 text-left text-sm transition-colors hover:bg-white/5 ${
                    selectedVoice?.name === v.name ? "text-indigo-300" : "text-slate-300"
                  }`}
                >
                  <span className="truncate">{v.name}</span>
                  <span className="ml-2 text-xs text-slate-500">{v.lang}</span>
                </button>
              ))}
              {voices.length === 0 && (
                <p className="px-4 py-3 text-sm text-slate-500">No voices found in this browser</p>
              )}
            </div>
          )}
        </div>

        {/* Speed */}
        <label className="flex items-center gap-2 text-sm text-slate-400">
          <FaGlobe className="text-fuchsia-300" />
          Speed
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={rate}
            onChange={(e) => setRate(parseFloat(e.target.value))}
            className="w-28 accent-indigo-500"
          />
          <span className="w-8 tabular-nums">{rate.toFixed(1)}x</span>
        </label>

        <div className="ml-auto flex items-center gap-2">
          <button onClick={stop} disabled={!isSpeaking} className="btn-secondary !px-3 !py-2.5" title="Stop">
            <FaStop />
          </button>
          <button onClick={handlePlayPause} className="btn-primary">
            {isSpeaking ? (
              <>
                <FaPause /> Pause
              </>
            ) : (
              <>
                <FaPlay /> Generate & Play
              </>
            )}
          </button>
        </div>
      </div>

      {/* Presets */}
      <div className="mt-6 flex flex-wrap gap-3 border-t border-white/5 pt-6">
        <span className="self-center text-xs font-semibold uppercase tracking-wider text-slate-500">Quick starts</span>
        {PRESETS.map((preset) => (
          <button
            key={preset.label}
            onClick={() => applyPreset(preset.text)}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 transition-all hover:border-indigo-400/40 hover:text-white"
          >
            {preset.icon}
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  );
}
