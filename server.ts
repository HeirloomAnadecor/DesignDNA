import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parsing middleware
  app.use(express.json());

// API Route for generating DNA report
  app.post("/api/generate-dna", async (req, res) => {
    try {
      const { prompt } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
      }

      // Lazy load @google/genai SDK
      const { GoogleGenAI } = await import("@google/genai");

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "GEMINI_API_KEY is not defined in the environment secrets." });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      // Try multiple models and apply retry backoff to maximize resilience against high demand spikes
      const modelsToTry = [
        "gemini-3.5-flash",
        "gemini-flash-latest",
        "gemini-3.1-flash-lite"
      ];

      let lastError: any = null;
      let textResult: string | undefined = undefined;

      for (const model of modelsToTry) {
        for (let attempt = 1; attempt <= 2; attempt++) {
          try {
            console.log(`[API] Attempting generation with model: ${model} (attempt ${attempt}/2)`);
            const response = await ai.models.generateContent({
              model: model,
              contents: prompt,
            });

            if (response && response.text) {
              textResult = response.text;
              console.log(`[API] Successfully generated report using model: ${model}`);
              break;
            }
          } catch (err: any) {
            lastError = err;
            console.warn(`[API] Error using model ${model} (attempt ${attempt}/2):`, err.message || err);
            
            // If we have another attempt left for this model, wait 1s
            if (attempt < 2) {
              await new Promise(resolve => setTimeout(resolve, 1000));
            }
          }
        }
        
        // If we successfully got a result, stop trying other models
        if (textResult !== undefined) {
          break;
        }
      }

      if (textResult === undefined) {
        throw lastError || new Error("Failed to generate content after trying all available models and retrying.");
      }

      res.json({ text: textResult });
    } catch (error: any) {
      console.error("Error generating DesignDNA report:", error);
      res.status(500).json({ error: error.message || "Failed to generate report via Gemini API" });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
