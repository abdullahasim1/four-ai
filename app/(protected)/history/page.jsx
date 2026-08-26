"use client";

import { useEffect, useState } from "react";
import {
  FaCalendarAlt,
  FaHistory,
  FaImage,
  FaMicrophone,
  FaRobot,
  FaWaveSquare,
} from "react-icons/fa";

import PageShell, { PageHeader } from "@/components/PageShell";
import { toast } from "@/lib/toast";
import { accountApi } from "@/lib/api";

const FEATURE_META = {
  "text-to-speech": { label: "Text to Speech", icon: <FaMicrophone className="text-sky-300" /> },
  "voice-generator": { label: "Voice Generator", icon: <FaRobot className="text-violet-300" /> },
  "voice-changer": { label: "Voice Changer", icon: <FaWaveSquare className="text-fuchsia-300" /> },
  "image-generator": { label: "Image Generator", icon: <FaImage className="text-emerald-300" /> },
};

const formatDate = (iso) =>
  new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    accountApi
      .getHistory(50)
      .then(({ data }) => {
        if (!cancelled && data.success) setHistory(data.history);
      })
      .catch(() => {
        if (!cancelled) toast.error("Couldn't load history. Please refresh to try again.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <PageShell contentClassName="mx-auto max-w-3xl px-4 py-12">
      <PageHeader
        icon={<FaHistory className="gradient-text" />}
        title="Usage History"
        subtitle="Your last 50 generations and tool sessions, synced with your account."
      />

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="glass-card h-20 animate-pulse !bg-white/[0.04]" />
          ))}
        </div>
      ) : history.length === 0 ? (
        <div className="glass-card p-10 text-center">
          <FaHistory className="mx-auto mb-4 text-4xl text-indigo-400/40" />
          <p className="font-medium text-slate-200">Nothing here yet</p>
          <p className="mt-1 text-sm text-slate-400">
            Start using the AI tools and your activity will appear here.
          </p>
        </div>
      ) : (
        <ol className="relative space-y-3 border-l border-white/10 pl-6">
          {history.map((item) => {
            const meta = FEATURE_META[item.feature] || {
              label: item.feature,
              icon: <FaHistory className="text-slate-400" />,
            };
            return (
              <li key={item.id} className="relative">
                <span className="absolute -left-[31px] top-5 flex h-5 w-5 items-center justify-center rounded-full border border-indigo-400/40 bg-[#0b1120] text-[10px] text-indigo-300">
                  ●
                </span>
                <div className="glass-card flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between hover:border-indigo-400/25 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="rounded-lg bg-white/5 p-2.5">{meta.icon}</span>
                    <div>
                      <h3 className="text-sm font-semibold text-white">{meta.label}</h3>
                      <p className="text-xs leading-relaxed text-slate-400">
                        {item.description || "—"}
                      </p>
                    </div>
                  </div>
                  <span className="flex shrink-0 items-center gap-1.5 text-xs text-slate-500">
                    <FaCalendarAlt />
                    {formatDate(item.timestamp)}
                  </span>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </PageShell>
  );
}
