"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  FaCopy,
  FaDownload,
  FaGlobe,
  FaMicrophone,
  FaStopCircle,
  FaTrashAlt,
  FaWaveSquare,
} from "react-icons/fa";

import PageShell, { PageHeader } from "@/components/PageShell";
import FloatingIcons from "@/components/FloatingIcons";
import { toast } from "@/lib/toast";
import { accountApi } from "@/lib/api";

const LANGUAGES = [
  { code: "en-US", label: "English (US)" },
  { code: "en-GB", label: "English (UK)" },
  { code: "ur-PK", label: "اردو (Urdu)" },
  { code: "hi-IN", label: "हिन्दी (Hindi)" },
  { code: "ar-SA", label: "العربية (Arabic)" },
];

function getRecognition() {
  if (typeof window === "undefined") return null;
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  return SR ? new SR() : null;
}

export default function SpeechToText() {
  const [supported, setSupported] = useState(true);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interim, setInterim] = useState("");
  const [language, setLanguage] = useState("en-US");
  const recognitionRef = useRef(null);
  const finalRef = useRef("");

  useEffect(() => {
    setSupported(Boolean(getRecognition()));
    return () => recognitionRef.current?.stop();
  }, []);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setListening(false);
    setInterim("");
  }, []);

  const start = () => {
    const recognition = getRecognition();
    if (!recognition) {
      toast.error("Speech recognition is not supported in this browser");
      return;
    }

    recognition.lang = language;
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let interimText = "";
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const chunk = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalRef.current = `${finalRef.current}${finalRef.current ? " " : ""}${chunk.trim()}`;
        } else {
          interimText += chunk;
        }
      }
      setTranscript(finalRef.current);
      setInterim(interimText);
    };

    recognition.onend = () => {
      // Auto-restart while the user still wants to listen
      if (recognitionRef.current) {
        try {
          recognition.start();
          return;
        } catch {
          /* already started */
        }
      }
      setListening(false);
    };

    recognition.onerror = (event) => {
      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        toast.error("Microphone permission denied. Allow it in your browser.");
      } else if (event.error === "no-speech") {
        return; // keep waiting
      }
      recognitionRef.current = null;
      setListening(false);
      setInterim("");
    };

    finalRef.current = transcript;
    recognitionRef.current = recognition;
    try {
      recognition.start();
      setListening(true);
    } catch {
      toast.error("Could not start listening. Try again.");
    }
  };

  const wordCount = transcript.trim() ? transcript.trim().split(/\s+/).length : 0;

  const handleCopy = async () => {
    if (!transcript.trim()) return toast.error("Nothing to copy yet");
    await navigator.clipboard.writeText(transcript);
    toast.success("Transcript copied!");
  };

  const handleDownload = () => {
    if (!transcript.trim()) return toast.error("Nothing to download yet");
    const blob = new Blob([transcript], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transcript-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    accountApi
      .trackActivity("speech-to-text", `Transcribed ${wordCount} words`)
      .catch(() => {});
    toast.success("Transcript downloaded");
  };

  const handleClear = () => {
    stop();
    setTranscript("");
    finalRef.current = "";
    setInterim("");
  };

  return (
    <PageShell
      icons={<FloatingIcons icons={[<FaMicrophone key="1" />, <FaWaveSquare key="2" />, <FaGlobe key="3" />]} count={8} />}
      contentClassName="mx-auto max-w-4xl px-4 py-16 sm:px-6"
    >
      <PageHeader
        icon={<FaMicrophone className="gradient-text" />}
        title="Speech to Text"
        subtitle="Speak naturally and watch your words appear in real time."
      />

      {!supported ? (
        <div className="glass-card p-10 text-center" data-reveal>
          <FaMicrophone className="mx-auto mb-4 text-5xl text-indigo-400/40" />
          <h3 className="font-display text-lg font-semibold text-white">Browser not supported</h3>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-400">
            Live speech recognition works in Chrome and Edge. Please open Four AI in one of those browsers to use this tool.
          </p>
        </div>
      ) : (
        <>
          {/* Controls */}
          <div className="glass-card mb-6 flex flex-col items-center gap-5 p-6 sm:flex-row sm:justify-between" data-reveal>
            <button
              onClick={listening ? stop : start}
              className={`flex items-center justify-center gap-3 rounded-full px-8 py-4 font-display text-lg font-bold text-white shadow-xl transition-all ${
                listening
                  ? "bg-gradient-to-r from-rose-500 to-red-500 shadow-rose-500/30 hover:brightness-110"
                  : "bg-gradient-to-r from-indigo-500 to-fuchsia-500 shadow-indigo-500/30 hover:brightness-110"
              }`}
            >
              {listening ? (
                <>
                  <span className="relative flex h-4 w-4">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/60" />
                    <span className="relative inline-flex h-4 w-4 rounded-full bg-white" />
                  </span>
                  Listening… click to stop
                </>
              ) : (
                <>
                  <FaMicrophone /> Start listening
                </>
              )}
            </button>

            <div className="flex items-center gap-3">
              <label className="input-label !mb-0">Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                disabled={listening}
                className="input-field !w-auto"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code} className="bg-slate-900">
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Transcript */}
          <div className="glass-card p-6" data-reveal>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h3 className="font-display text-lg font-semibold text-white">Live transcript</h3>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="rounded-full bg-white/5 px-3 py-1">{wordCount} words</span>
                <span className="rounded-full bg-white/5 px-3 py-1">{transcript.length} chars</span>
              </div>
            </div>

            <div className="min-h-[220px] max-h-[420px] overflow-y-auto whitespace-pre-wrap rounded-xl border border-white/10 bg-[#0a0f1e]/70 p-5 text-base leading-relaxed text-slate-200">
              {transcript || interim ? (
                <>
                  {transcript}
                  {interim && <span className="text-slate-500"> {interim}</span>}
                </>
              ) : (
                <span className="text-slate-600">
                  Press “Start listening” and begin speaking — your words will appear here…
                </span>
              )}
              {listening && <span className="ml-1 inline-block h-5 w-[2px] animate-pulse bg-fuchsia-400 align-middle" />}
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <button onClick={handleCopy} disabled={!transcript} className="btn-secondary !py-2 !text-sm disabled:opacity-40">
                <FaCopy /> Copy
              </button>
              <button onClick={handleDownload} disabled={!transcript} className="btn-primary !py-2 !text-sm disabled:opacity-40">
                <FaDownload /> Download .txt
              </button>
              <button onClick={handleClear} disabled={!transcript && !listening} className="btn-secondary !py-2 !text-sm disabled:opacity-40">
                <FaTrashAlt /> Clear
              </button>
            </div>
          </div>
        </>
      )}
    </PageShell>
  );
}
