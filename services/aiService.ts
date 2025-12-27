
import { GoogleGenAI, Type } from "@google/genai";
import { AIModel, Clip } from "../types";

export const generateViralClips = async (
  transcript: string,
  model: AIModel,
  context: string,
  youtubeUrl?: string
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

  if (model.startsWith('gemini')) {
    return generateWithGemini(transcript, model, systemPrompt, youtubeUrl);
  }
  
  throw new Error("Invalid model selected. Please use a Gemini model.");
};

async function generateWithGemini(
  transcript: string, 
  modelName: string, 
  systemPrompt: string,
  youtubeUrl?: string
): Promise<Clip[]> {
  try {
    // Create fresh instance to ensure we use the most up-to-date API key
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const contentText = youtubeUrl 
      ? `YouTube Source: ${youtubeUrl}\n\nTranscript: ${transcript}`
      : `Transcript: ${transcript}`;

    const response = await ai.models.generateContent({
      model: modelName,
      contents: contentText,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: "A catchy, clickbait-style title" },
              start: { type: Type.STRING, description: "Start timestamp (e.g., 00:15)" },
              end: { type: Type.STRING, description: "End timestamp (e.g., 01:30)" },
              score: { type: Type.NUMBER, description: "Viral score from 1-10" },
              reasoning: { type: Type.STRING, description: "Reasoning for viral potential" },
            },
            required: ["title", "start", "end", "score", "reasoning"],
            propertyOrdering: ["title", "start", "end", "score", "reasoning"]
          }
        }
      }
    });

    if (!response.text) {
      throw new Error("Gemini returned an empty response.");
    }

    const jsonStr = response.text.trim();
    const data = JSON.parse(jsonStr);
    return data as Clip[];

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    
    // Automatic retry/key-reset if the entity is not found (stale key)
    if (error.message?.includes("Requested entity was not found")) {
      if (typeof (window as any).aistudio?.openSelectKey === 'function') {
        await (window as any).aistudio.openSelectKey();
        throw new Error("API session expired. Please retry with the updated key.");
      }
    }
    
    throw new Error(`Gemini Error: ${error.message || "Unknown error"}`);
  }
}
