import { getUserFromRequest } from "@/lib/session";
import { readJson } from "@/lib/http";

const API_BASE = "https://api-inference.huggingface.co/models";

// Tried in order until one succeeds
const IMAGE_MODELS = [
  "stabilityai/stable-diffusion-2-1",
  "stabilityai/stable-diffusion-xl-base-1.0",
  "runwayml/stable-diffusion-v1-5",
];

async function callModel(model, payload, apiKey) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 90_000);
  try {
    const response = await fetch(`${API_BASE}/${model}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      throw new Error(`${model} -> ${response.status} ${detail.slice(0, 200)}`);
    }
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function POST(request) {
  const auth = await getUserFromRequest(request);
  if (!auth) {
    return Response.json({ success: false, message: "Session expired. Please log in again." }, { status: 401 });
  }

  const apiKey = process.env.HUGGING_FACE_API_KEY;
  if (!apiKey) {
    return Response.json(
      { success: false, message: "Image generation is not configured on the server" },
      { status: 500 }
    );
  }

  const { prompt, negativePrompt = "", steps = 28, guidance = 3.5 } = await readJson(request);
  if (!prompt || !String(prompt).trim()) {
    return Response.json({ success: false, message: "Prompt is required" }, { status: 400 });
  }
  if (prompt.length > 1000) {
    return Response.json(
      { success: false, message: "Prompt is too long (max 1000 characters)" },
      { status: 400 }
    );
  }

  const payload = {
    inputs: String(prompt).trim(),
    parameters: {
      negative_prompt: negativePrompt,
      num_inference_steps: Math.min(Math.max(Number(steps) || 28, 10), 50),
      guidance_scale: Math.min(Math.max(Number(guidance) || 3.5, 1), 20),
    },
    options: { wait_for_model: true },
  };

  const errors = [];
  for (const model of IMAGE_MODELS) {
    try {
      const response = await callModel(model, payload, apiKey);
      const buffer = Buffer.from(await response.arrayBuffer());
      return new Response(buffer, {
        headers: {
          "Content-Type": response.headers.get("content-type") || "image/png",
          "X-Model": model,
          "Cache-Control": "no-store",
        },
      });
    } catch (error) {
      console.error(`❌ Image model failed (${error.message})`);
      errors.push(error.message);
    }
  }

  return Response.json(
    {
      success: false,
      message: "All image models failed. Please try again in a moment.",
      details: errors,
    },
    { status: 502 }
  );
}
