import { GoogleGenAI } from "@google/genai";

export const getGeminiClient = () => {
  // Tenta pegar a chave injetada pelo Vite ou pelo import.meta.env
  const apiKey = process.env.GEMINI_API_KEY || import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey || apiKey === "undefined") {
    throw new Error(
      "Chave de API do Gemini não encontrada. Para funcionar na Netlify, você precisa ir em 'Site configuration' > 'Environment variables', adicionar a variável GEMINI_API_KEY com a sua chave do Google AI Studio e fazer um novo deploy."
    );
  }

  return new GoogleGenAI({ apiKey });
};
