"use client";

import { useEffect, useMemo, useState } from "react";
import { FaCloud, FaDownload, FaImage, FaMagic, FaPalette, FaStar } from "react-icons/fa";

import PageShell, { PageHeader } from "@/components/PageShell";
import FloatingIcons from "@/components/FloatingIcons";
import { toast } from "@/lib/toast";
import { generateImage } from "@/lib/api";
import { accountApi } from "@/lib/api";

const IDEAS = [
  "A neon-lit cyberpunk street at night, rain reflections, cinematic",
  "An astronaut relaxing on a beach of a purple alien planet, digital art",
  "A cozy cabin in a snowy forest at dusk, warm light in the windows",
  "A majestic dragon flying over a medieval castle at sunrise",
  "Abstract 3D render of flowing liquid chrome shapes, studio lighting",
];

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [steps, setSteps] = useState(28);
  const [guidance, setGuidance] = useState(3.5);
  const [image, setImage] = useState(null);
  const [model, setModel] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  // Revoke object URLs to avoid leaks
  useEffect(() => () => {
    if (image) URL.revokeObjectURL(image);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ideas = useMemo(() => IDEAS.slice(0, 3), []);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Describe what you want to see first");
      return;
    }
    setLoading(true);
    setImage(null);
    setModel("");
    setStatus("Warming up the models…");

    try {
      const result = await generateImage({
        prompt,
        negativePrompt,
        steps,
        guidance,
      });
      setImage(result.url);
      setModel(result.model);
      setStatus("");
      toast.success("Image generated!");
      accountApi
        .trackActivity("image-generator", `Generated art: "${prompt.slice(0, 60)}${prompt.length > 60 ? "…" : ""}"`)
        .catch(() => {});
    } catch (err) {
      setStatus("");
      toast.error(err.message || "Generation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!image) return;
    const link = document.createElement("a");
    link.href = image;
    link.download = `fourai-${Date.now()}.png`;
    link.click();
  };

  return (
    <PageShell
      icons={<FloatingIcons icons={[<FaImage key="1" />, <FaPalette key="2" />, <FaMagic key="3" />, <FaStar key="4" />, <FaCloud key="5" />]} count={9} />}
      contentClassName="mx-auto max-w-5xl px-4 py-12"
    >
      <PageHeader
        icon={<FaImage className="gradient-text" />}
        title="AI Image Generator"
        subtitle="Turn text into stunning visuals. Your API key stays safely on the server — we proxy every request."
      />

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        {/* Canvas */}
        <div>
          <div className="glass-card relative flex aspect-square w-full items-center justify-center overflow-hidden !rounded-3xl">
            {loading ? (
              <div className="text-center">
                <span className="mx-auto mb-4 block h-14 w-14 animate-spin rounded-full border-4 border-indigo-400/20 border-t-indigo-400" />
                <p className="text-sm text-slate-300">{status}</p>
                <p className="mt-1 text-xs text-slate-500">This can take up to a minute</p>
              </div>
            ) : image ? (
              <>
                <img src={image} alt={prompt} className="h-full w-full object-cover" />
                {model && (
                  <span className="absolute bottom-3 left-3 rounded-full border border-white/10 bg-black/60 px-3 py-1 text-xs text-slate-300 backdrop-blur">
                    {model}
                  </span>
                )}
              </>
            ) : (
              <div className="p-8 text-center">
                <FaImage className="mx-auto mb-4 text-5xl text-indigo-400/50" />
                <p className="text-sm text-slate-400">Your generated image will appear here</p>
              </div>
            )}
          </div>

          {/* Idea chips */}
          <div className="mt-4 flex flex-wrap gap-2">
            {ideas.map((idea) => (
              <button
                key={idea}
                onClick={() => setPrompt(idea)}
                className="rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs text-slate-300 transition-all hover:border-fuchsia-400/40 hover:text-white"
              >
                {idea.length > 46 ? idea.slice(0, 46) + "…" : idea}
              </button>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="glass-card h-fit space-y-5 p-6">
          <div>
            <label className="input-label"><FaMagic /> Prompt</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
              placeholder="Describe your imagination…"
              className="input-field resize-none !bg-black/30"
              maxLength={1000}
            />
          </div>

          <div>
            <label className="input-label">Negative prompt</label>
            <textarea
              value={negativePrompt}
              onChange={(e) => setNegativePrompt(e.target.value)}
              rows={2}
              placeholder="What to avoid (blurry, low quality…)"
              className="input-field resize-none !bg-black/30"
              maxLength={500}
            />
          </div>

          <div>
            <label className="input-label">Steps · {steps}</label>
            <input
              type="range"
              min="20"
              max="50"
              value={steps}
              onChange={(e) => setSteps(Number(e.target.value))}
              className="w-full accent-indigo-500"
            />
          </div>

          <div>
            <label className="input-label">Guidance · {guidance.toFixed(1)}</label>
            <input
              type="range"
              min="1"
              max="20"
              step="0.1"
              value={guidance}
              onChange={(e) => setGuidance(Number(e.target.value))}
              className="w-full accent-indigo-500"
            />
          </div>

          <div className="flex gap-3 pt-1">
            <button onClick={handleGenerate} disabled={loading} className="btn-primary flex-1 justify-center">
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Generating…
                </>
              ) : (
                "Generate"
              )}
            </button>
            <button
              onClick={handleDownload}
              disabled={!image}
              className="btn-secondary !px-4"
              title="Download PNG"
            >
              <FaDownload />
            </button>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
