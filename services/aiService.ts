
import { GoogleGenAI, Type } from "@google/genai";
import { AIModel, Clip } from "../types";

/**
 * Generates viral clips using the provided transcript and configuration.
 * @param transcript - Long-form text content.
 * @param apiKey - User-provided Gemini API key.
 * @param model - Selected Gemini model ID.
 * @param context - Niche specific context.
 * @param youtubeUrl - Optional video source.
 */
export const generateViralClips = async (
  transcript: string,
  apiKey: string,
  model: AIModel,
  context: string = "General",
  youtubeUrl?: string
): Promise<Clip[]> => {
  
  const systemPrompt = `You are a world-class viral video editor specializing in the [${context}] niche. 
  Analyze the provided transcript and identify exactly 10 distinct, high-potential viral clips for TikTok/Shorts/Reels.
  
  Instructions:
  - Extract exactly 10 clips.
  - No filler, high retention focus.
  - Return JSON format only.`;

  // Explicitly utilizing the passed apiKey
  return generateWithGemini(transcript, apiKey, model, systemPrompt, youtubeUrl);
};

async function generateWithGemini(
  transcript: string, 
  apiKey: string,
  modelName: string, 
  systemPrompt: string,
  youtubeUrl?: string
): Promise<Clip[]> {
  try {
    // Robust Initialization: Prioritize user key, fallback to environment key if available
    const activeKey = apiKey || (process as any).env.API_KEY;
    
    if (!activeKey) {
      throw new Error("Initialization Error: An API Key must be set in the sidebar config.");
    }

    const ai = new GoogleGenAI({ apiKey: activeKey });
    
    const contentText = youtubeUrl 
      ? `Source: ${youtubeUrl}\n\nTranscript: ${transcript}`
      : `Transcript: ${transcript}`;

    // Following SDK coding guidelines: using ai.models.generateContent directly
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
      throw new Error("Gemini returned an empty response. Check transcript length.");
    }

    return JSON.parse(response.text.trim()) as Clip[];

  } catch (error: any) {
    console.error("Engine failure:", error);
    
    if (error.message?.includes("API_KEY_INVALID")) {
      throw new Error("Invalid API Key. Please verify your credentials in the Sidebar.");
    }
    
    throw new Error(`Generation Error: ${error.message || "Unknown error"}`);
  }
}
