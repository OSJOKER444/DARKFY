import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  const handleAIError = (error: any) => {
    let msg = error.message || "Failed to generate content";
    try {
      const start = msg.indexOf("{");
      const end = msg.lastIndexOf("}") + 1;
      if (start >= 0 && end > start) {
        const jsonStr = msg.substring(start, end);
        const parsed = JSON.parse(jsonStr);
        if (parsed?.error?.message) {
          msg = parsed.error.message;
        }
      }
    } catch (e) {}

    if (msg.toLowerCase().includes("quota") || msg.includes("429")) {
      return "O limite de uso da inteligência artificial foi atingido. Por favor, tente novamente mais tarde.";
    }
    if (msg.toLowerCase().includes("api_key_invalid") || msg.toLowerCase().includes("api key not valid")) {
      return "A chave da API configurada é inválida.";
    }
    return `Ocorreu um erro interno na inteligência artificial: ${msg}`;
  };

  // API route for Gemini
  app.post("/api/gemini", async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY environment variable is required");
      }
      
      const ai = new GoogleGenAI({ apiKey });
      const { model, contents, config } = req.body;
      
      const response = await ai.models.generateContent({
        model: model || "gemini-2.5-flash",
        contents,
        config: config || {},
      });
      
      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: handleAIError(error) });
    }
  });

  // API route for Gemini chat
  app.post("/api/gemini-chat", async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY environment variable is required");
      }
      
      const ai = new GoogleGenAI({ apiKey });
      const { message, history, systemInstruction, model } = req.body;
      
      const chat = ai.chats.create({
        model: model || "gemini-1.5-flash",
        config: systemInstruction ? { systemInstruction } : undefined,
        history: history || []
      });
      
      const response = await chat.sendMessage({ message });
      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini Chat API Error:", error);
      res.status(500).json({ error: handleAIError(error) });
    }
  });

  // Vite middleware for development
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
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
