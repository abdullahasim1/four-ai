"use client";
import { useEffect, useRef, useState } from "react";

/**
 * Shared Web Speech API hook for text-to-speech playback.
 */
export default function useSpeech() {
  const [voices, setVoices] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const utteranceRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    const load = () => {
      const available = window.speechSynthesis.getVoices();
      if (available.length) setVoices(available);
    };
    load();
    window.speechSynthesis.onvoiceschanged = load;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
      window.speechSynthesis.cancel();
    };
  }, []);

  const speak = ({ text, voice, rate = 1, lang, onEnd }) => {
    if (!window.speechSynthesis || !text?.trim()) return false;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    if (voice) utterance.voice = voice;
    utterance.rate = rate;
    if (lang) utterance.lang = lang;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      onEnd?.();
    };
    utterance.onerror = () => setIsSpeaking(false);

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    return true;
  };

  const pause = () => {
    window.speechSynthesis?.pause();
  };

  const resume = () => {
    window.speechSynthesis?.resume();
  };

  const stop = () => {
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
  };

  return { voices, isSpeaking, speak, pause, resume, stop };
}
