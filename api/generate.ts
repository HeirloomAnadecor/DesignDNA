import { GoogleGenAI } from "@google/genai";

export default async function handler(req: any, res: any) {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({
        error: "Prompt is required"
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "GEMINI_API_KEY missing"
      });
    }

    const ai = new GoogleGenAI({
      apiKey
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt
    });

    return res.status(200).json({
      text: response.text
    });
  } catch (error: any) {
    return res.status(500).json({
      error: error.message || "Generation failed"
    });
  }
}