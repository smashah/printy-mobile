import type { ColoringPageData } from "../types";

const GENERATION_CONFIG_SCHEMA_RANDOM = {
  type: "object",
  properties: {
    title: { type: "string", description: "The short title of the drawing." },
    drawing_prompt: { type: "string", description: "The drawing prompt." },
    suggested_colors: {
      type: "array",
      items: { type: "string" },
      description: "List of 5 suggested colors for the drawing.",
    },
  },
  required: ["title", "drawing_prompt", "suggested_colors"],
};

const GENERATION_CONFIG_SCHEMA_METADATA = {
  type: "object",
  properties: {
    title: { type: "string", description: "The short title of the drawing." },
    suggested_colors: {
      type: "array",
      items: { type: "string" },
      description: "List of 5 suggested colors for the drawing.",
    },
  },
  required: ["title", "suggested_colors"],
};

interface RandomPromptResult {
  title: string;
  drawing_prompt: string;
  suggested_colors: string[];
}

interface MetadataResult {
  title: string;
  suggested_colors: string[];
}

async function getRandomPrompt(): Promise<RandomPromptResult> {
  const systemPrompt = `You are a children's colouring book author, your job is to come up with ideas/scenes as prompts for another ai to generate the colouring book image. You will not be producing the drawing yourself, just the prompt. It is on a 4x6 inch page so it cannot be too detailed or have too much going on. Just a simple prompt like "A smiling unicorn on a cloud" will do. But you have to be random with it, every time. You have to be very imaginative and random. Please come up with 1 random one now. Seed: ${Math.floor(Math.random() * 1000000)}`;
  const apiKey = process.env.GEMINI_API_KEY || process.env.NANOBANANA_API_KEY;

  if (!apiKey) {
    return {
      title: "Random Surprise",
      drawing_prompt: "a cute robot playing with a butterfly",
      suggested_colors: ["silver", "blue", "orange", "yellow", "green"],
    };
  }

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: systemPrompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
            responseJsonSchema: GENERATION_CONFIG_SCHEMA_RANDOM,
          },
        }),
      },
    );

    const data = (await response.json()) as Record<string, unknown>;
    const candidates = data.candidates as
      | Array<Record<string, unknown>>
      | undefined;
    const content = candidates?.[0]?.content as
      | Record<string, unknown>
      | undefined;
    const parts = content?.parts as Array<Record<string, unknown>> | undefined;
    const textValue = parts?.[0]?.text;
    if (typeof textValue !== "string") {
      throw new Error("Missing text in response");
    }
    const result = JSON.parse(textValue) as RandomPromptResult;
    return result;
  } catch {
    return {
      title: "Random Surprise",
      drawing_prompt: "a happy dinosaur eating ice cream",
      suggested_colors: ["green", "pink", "brown", "white", "red"],
    };
  }
}

async function getMetadataForPrompt(prompt: string): Promise<MetadataResult> {
  const systemPrompt = `You are a children's colouring book editor. The user has provided a prompt for a coloring page: "${prompt}". Please generate a short, catchy title for this page and list 5 suggested colors that would be appropriate for coloring it. The colors should be simple names suitable for children (e.g. Red, Blue, Forest Green).`;
  const apiKey = process.env.GEMINI_API_KEY || process.env.NANOBANANA_API_KEY;

  if (!apiKey) {
    return {
      title: "Coloring Page",
      suggested_colors: ["red", "blue", "green", "yellow", "orange"],
    };
  }

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: systemPrompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
            responseJsonSchema: GENERATION_CONFIG_SCHEMA_METADATA,
          },
        }),
      },
    );

    const data = (await response.json()) as Record<string, unknown>;
    const candidates = data.candidates as
      | Array<Record<string, unknown>>
      | undefined;
    const content = candidates?.[0]?.content as
      | Record<string, unknown>
      | undefined;
    const parts = content?.parts as Array<Record<string, unknown>> | undefined;
    const textValue = parts?.[0]?.text;
    if (typeof textValue !== "string") {
      throw new Error("Missing text in response");
    }
    const result = JSON.parse(textValue) as MetadataResult;
    return result;
  } catch {
    return {
      title: "Coloring Page",
      suggested_colors: ["red", "blue", "green", "yellow", "purple"],
    };
  }
}

export async function generateColoringPage(
  userPrompt?: string,
): Promise<ColoringPageData> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.NANOBANANA_API_KEY;
  let title = "";
  let basePrompt = userPrompt?.trim() || "";
  let suggestedColors: string[] = [];

  if (!basePrompt) {
    const autogen = await getRandomPrompt();
    title = autogen.title;
    basePrompt = autogen.drawing_prompt;
    suggestedColors = autogen.suggested_colors;
  } else {
    const metadata = await getMetadataForPrompt(basePrompt);
    title = metadata.title;
    suggestedColors = metadata.suggested_colors;
  }

  const styleDirectives = [
    "Generate a coloring page image.",
    "Style: Strict black and white line art suitable for children.",
    "Content: High contrast, thick distinct outlines, white background.",
    "Constraints: NO grayscale, NO shading, NO colors, NO complex cross-hatching.",
    "This is for a children's colouring-in book, so it has to be simple, playful, and easy to colour with at most 4 colours. No hyperrealism or intricate details.",
    "Subject:",
  ];

  const finalPrompt = `${styleDirectives.join(" ")} ${basePrompt}`;
  const model = "gemini-3-pro-image-preview";
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
  let imageUrl = "https://placehold.co/512x512/png?text=Mock+Coloring+Page";

  if (apiKey) {
    try {
      const payload = {
        contents: [{ parts: [{ text: finalPrompt }] }],
        generationConfig: {
          responseModalities: ["IMAGE"],
          imageConfig: { aspectRatio: "4:5" },
        },
      };

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(
          `Gemini API Error: ${response.status} ${response.statusText} - ${errText}`,
        );
      }

      const data = (await response.json()) as Record<string, unknown>;
      const candidates = data.candidates as
        | Array<Record<string, unknown>>
        | undefined;
      const content = candidates?.[0]?.content as
        | Record<string, unknown>
        | undefined;
      const parts = content?.parts as
        | Array<Record<string, unknown>>
        | undefined;
      const inlineData = parts?.[0]?.inlineData as
        | Record<string, unknown>
        | undefined;

      if (inlineData?.data) {
        const mime = (inlineData.mimeType as string) || "image/jpeg";
        const base64 = inlineData.data as string;
        imageUrl = `data:${mime};base64,${base64}`;
      }
    } catch (error) {
      console.error("Failed to generate image via Gemini API:", error);
    }
  }

  return {
    title: title || "Coloring Page",
    imageUrl,
    description: basePrompt,
    suggestedColors,
  };
}
