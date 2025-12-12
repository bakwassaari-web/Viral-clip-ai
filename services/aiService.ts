import { GoogleGenAI, Type } from "@google/genai";
import { AIModel, Clip } from "../types";

export const generateViralClips = async (
  transcript: string,
  apiKey: string,
  model: AIModel,
  context: string
): Promise<Clip[]> => {
  
  const systemPrompt = `You are a world-class viral video editor specializing in the [${context}] niche. 
  Analyze the provided transcript and identify exactly 10 distinct, high-potential viral clips that have the highest potential to go viral on TikTok, Shorts, or Reels.
  
  Crucial Instructions:
  - Ensure even the 9th and 10th clips are high quality; do not add filler.
  - Do not repeat segments or overlap timeframes significantly.
  - Cover different topics found in the text (e.g., Money, Relationships, Future, Controversy, Humor) to provide variety.
  
  For each clip, provide:
  1. A catchy, clickbait-style title.
  2. The start and end timestamps (e.g., "00:15", "01:30").
  3. A viral score from 1-10 based on emotional hook, retention, and shareability.
  4. A detailed reasoning explaining why this specific segment will hook viewers.

  Return ONLY valid JSON.`;

  // Dynamic check for model type
  if (model.includes('gemini')) {
    return generateWithGemini(transcript, apiKey, model, systemPrompt);
  } else if (model.includes('claude')) {
    return generateWithClaude(transcript, apiKey, model, systemPrompt);
  }
  
  throw new Error("Invalid model selected");
};

async function generateWithGemini(
  transcript: string, 
  apiKey: string,
  modelName: string, 
  systemPrompt: string
): Promise<Clip[]> {
  try {
    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContent({
      model: modelName,
      contents: `Transcript: ${transcript}`,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              start: { type: Type.STRING },
              end: { type: Type.STRING },
              score: { type: Type.NUMBER },
              reasoning: { type: Type.STRING },
            },
            required: ["title", "start", "end", "score", "reasoning"]
          }
        }
      }
    });

    if (!response.text) {
      throw new Error("Gemini returned an empty response.");
    }

    const data = JSON.parse(response.text);
    return data as Clip[];

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(`Gemini Error: ${error.message || "Unknown error"}`);
  }
}

async function generateWithClaude(
  transcript: string, 
  apiKey: string,
  modelName: string, 
  systemPrompt: string
): Promise<Clip[]> {
  // NOTE: This uses a direct client-side fetch to Anthropic.
  
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
        // 'dangerously-allow-browser': 'true' // Sometimes required for client-side testing tools
      },
      body: JSON.stringify({
        model: modelName,
        max_tokens: 4000, // Increased max_tokens to accommodate 10 clips
        system: systemPrompt,
        messages: [
          { role: "user", content: `Here is the transcript to analyze:\n\n${transcript}\n\nReturn the JSON array of clips.` }
        ]
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      if (response.status === 401) throw new Error("Invalid Anthropic API Key.");
      if (errData.error?.message?.includes("CORS")) {
        throw new Error("CORS Error: Anthropic does not allow browser requests. Please use a proxy or backend.");
      }
      throw new Error(`Anthropic Error: ${errData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    
    // Parse the content string from Claude which might include text before/after JSON
    const contentText = data.content[0]?.text;
    if (!contentText) throw new Error("Claude returned empty content.");

    // Simple extraction of JSON array if Claude adds extra text
    const jsonMatch = contentText.match(/\[[\s\S]*\]/);
    const jsonStr = jsonMatch ? jsonMatch[0] : contentText;

    return JSON.parse(jsonStr) as Clip[];

  } catch (error: any) {
    console.error("Claude API Error:", error);
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
      throw new Error("Network Error: Likely a CORS issue accessing Anthropic directly from browser. Use a CORS extension for testing.");
    }
    throw error;
  }
}