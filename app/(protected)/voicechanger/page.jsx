"use client";

import { useRef, useState } from "react";
import { FaDownload, FaMagic, FaMicrophoneAlt, FaMusic, FaVolumeUp, FaWaveSquare } from "react-icons/fa";

import PageShell, { PageHeader } from "@/components/PageShell";
import FloatingIcons from "@/components/FloatingIcons";
import { toast } from "@/lib/toast";
import { encodeWAV } from "@/lib/wavEncoder";
import { accountApi } from "@/lib/api";

const EFFECTS = [
  { value: "normal", label: "Normal" },
  { value: "robot", label: "Robot" },
  { value: "slow", label: "Slow" },
  { value: "fast", label: "Fast" },
  { value: "echo", label: "Echo" },
  { value: "distortion", label: "Distortion" },
  { value: "reverb", label: "Reverb" },
  { value: "tremolo", label: "Tremolo" },
  { value: "lowpass", label: "Lowpass filter" },
];

async function processAudio(file, effect, speed) {
      const arrayBuffer = await file.arrayBuffer();
      const tempCtx = new (window.AudioContext || window.webkitAudioContext)();
      const decoded = await tempCtx.decodeAudioData(arrayBuffer);
      tempCtx.close();

      let durationInSamples = Math.ceil(decoded.length * speed);
      if (effect === "echo") durationInSamples += Math.ceil(0.5 * 44100);
      if (effect === "reverb") durationInSamples += Math.ceil(2 * 44100);

      const audioCtx = new (window.OfflineAudioContext || window.webkitOfflineAudioContext)(
        1,
        durationInSamples,
        44100
      );

      let source = audioCtx.createBufferSource();
      source.buffer = decoded;
      source.playbackRate.value = speed;
      let node = source;
      let lastNode = node;

      if (effect === "robot") {
        const filter = audioCtx.createBiquadFilter();
        filter.type = "highpass";
        filter.frequency.value = 1000;
        lastNode.connect(filter);
        lastNode = filter;
        const gain = audioCtx.createGain();
        gain.gain.value = 1.2;
        lastNode.connect(gain);
        lastNode = gain;
      } else if (effect === "slow") {
        source.playbackRate.value = Math.max(0.5, speed * 0.7);
      } else if (effect === "fast") {
        source.playbackRate.value = Math.min(2.0, speed * 1.5);
      } else if (effect === "echo") {
        const delay = audioCtx.createDelay();
        delay.delayTime.value = 0.25;
        const feedback = audioCtx.createGain();
        feedback.gain.value = 0.4;
        lastNode.connect(delay);
        delay.connect(feedback);
        feedback.connect(delay);
        delay.connect(audioCtx.destination);
        lastNode = null;
      } else if (effect === "distortion") {
        const distortion = audioCtx.createWaveShaper();
        function makeDistortionCurve(amount) {
          const n_samples = 44100;
          const curve = new Float32Array(n_samples);
          for (let i = 0; i < n_samples; ++i) {
            const x = (i * 2) / n_samples - 1;
            curve[i] = ((3 + amount) * x * 20 * Math.PI / 180) / (Math.PI + amount * Math.abs(x));
          }
          return curve;
        }
        distortion.curve = makeDistortionCurve(400);
        distortion.oversample = "4x";
        lastNode.connect(distortion);
        lastNode = distortion;
      } else if (effect === "reverb") {
        const convolver = audioCtx.createConvolver();
        const irBuffer = audioCtx.createBuffer(2, audioCtx.sampleRate * 2, audioCtx.sampleRate);
        for (let c = 0; c < irBuffer.numberOfChannels; c++) {
          const channel = irBuffer.getChannelData(c);
          for (let i = 0; i < irBuffer.length; i++) {
            channel[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / irBuffer.length, 2);
          }
        }
        convolver.buffer = irBuffer;
        lastNode.connect(convolver);
        lastNode = convolver;
      } else if (effect === "tremolo") {
        const gain = audioCtx.createGain();
        const lfo = audioCtx.createOscillator();
        lfo.type = "sine";
        lfo.frequency.value = 8;
        const lfoGain = audioCtx.createGain();
        lfoGain.gain.value = 0.5;
        lfo.connect(lfoGain);
        lfoGain.connect(gain.gain);
        lfo.start(0);
        lastNode.connect(gain);
        lastNode = gain;
      } else if (effect === "lowpass") {
        const filter = audioCtx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = 800;
        lastNode.connect(filter);
        lastNode = filter;
      }

    if (lastNode) lastNode.connect(audioCtx.destination);
    source.start();
    return await audioCtx.startRendering();
}

export default function VoiceChanger() {
  const [file, setFile] = useState(null);
  const [fileDuration, setFileDuration] = useState(null);
  const [effect, setEffect] = useState("normal");
  const [customSpeed, setCustomSpeed] = useState(1);
  const [audioUrl, setAudioUrl] = useState(null);
  const [processing, setProcessing] = useState(false);
  const objectUrlRef = useRef(null);

  const revokeOldUrl = () => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
  };

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    revokeOldUrl();
    setAudioUrl(null);
    setFile(selectedFile);

    if (!selectedFile) {
      setFileDuration(null);
      return;
    }
    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const tempCtx = new (window.AudioContext || window.webkitAudioContext)();
      const decoded = await tempCtx.decodeAudioData(arrayBuffer);
      setFileDuration(decoded.duration);
      tempCtx.close();
    } catch {
      setFileDuration(null);
      toast.error("Could not read that file. Is it a valid audio format?");
    }
  };

  const handleApplyEffect = async () => {
    if (!file) {
      toast.error("Choose an audio file first");
      return;
    }
    setProcessing(true);
    revokeOldUrl();
    setAudioUrl(null);
    try {
      const processedBuffer = await processAudio(file, effect, customSpeed);
      const wav = encodeWAV(processedBuffer);
      const blob = new Blob([wav], { type: "audio/wav" });
      const url = URL.createObjectURL(blob);
      objectUrlRef.current = url;
      setAudioUrl(url);
      toast.success(`"${EFFECTS.find((e) => e.value === effect)?.label}" applied`);
      accountApi
        .trackActivity("voice-changer", `Applied ${effect} effect to ${(file.size / 1024).toFixed(0)} KB audio`)
        .catch(() => {});
    } catch (err) {
      toast.error("Failed to process audio: " + err.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <PageShell
      icons={<FloatingIcons icons={[<FaMagic key="1" />, <FaWaveSquare key="2" />, <FaVolumeUp key="3" />, <FaMusic key="4" />]} count={8} />}
      contentClassName="flex items-center justify-center px-4 py-12"
    >
      <div className="glass-card w-full max-w-lg p-8">
        <PageHeader
          icon={<FaWaveSquare className="gradient-text" />}
          title="Voice Changer"
          subtitle="Upload audio and apply studio-style effects. Everything is processed locally — no time limits."
        />

        {/* File picker */}
        <label className="group flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-white/15 bg-black/20 px-6 py-8 text-center transition-colors hover:border-indigo-400/50">
          <span className="rounded-full bg-gradient-to-br from-indigo-500/30 to-fuchsia-500/30 p-3 text-indigo-200 transition-transform group-hover:scale-110">
            <FaMicrophoneAlt className="text-xl" />
          </span>
          <span className="text-sm font-medium text-slate-200">
            {file ? file.name : "Click to upload an audio file"}
          </span>
          <span className="text-xs text-slate-500">MP3, WAV, OGG and more</span>
          <input type="file" accept="audio/*" onChange={handleFileChange} className="hidden" />
        </label>

        {fileDuration != null && (
          <p className="mt-3 rounded-lg border border-emerald-500/25 bg-emerald-500/10 px-3 py-2 text-center text-sm text-emerald-300">
            Duration: {Math.floor(fileDuration / 60)}:{(fileDuration % 60).toFixed(1).padStart(4, "0")}
          </p>
        )}

        {/* Effect */}
        <div className="mt-6">
          <label className="input-label"><FaMagic /> Effect</label>
          <select
            value={effect}
            onChange={(e) => setEffect(e.target.value)}
            className="input-field"
          >
            {EFFECTS.map((e) => (
              <option key={e.value} value={e.value} className="bg-slate-900">{e.label}</option>
            ))}
          </select>
        </div>

        {/* Speed */}
        <div className="mt-5">
          <label className="input-label">Playback speed · {customSpeed.toFixed(2)}x</label>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.01"
            value={customSpeed}
            onChange={(e) => setCustomSpeed(parseFloat(e.target.value))}
            className="w-full accent-indigo-500"
          />
        </div>

        <button onClick={handleApplyEffect} disabled={processing} className="btn-primary mt-7 w-full">
          {processing ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Processing…
            </>
          ) : (
            "Apply effect"
          )}
        </button>

        {/* Result */}
        {audioUrl && (
          <div className="mt-7 border-t border-white/5 pt-6">
            <audio controls src={audioUrl} className="w-full" />
            <a href={audioUrl} download="fourai-processed.wav" className="btn-secondary mt-4 w-full justify-center">
              <FaDownload /> Download WAV
            </a>
          </div>
        )}
      </div>
    </PageShell>
  );
}
