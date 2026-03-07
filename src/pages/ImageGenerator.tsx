import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  Card,
  CardContent,
} from "@/src/components/ui/card";
import { Sparkles, Download } from "lucide-react";
import { motion } from "motion/react";
import { getGeminiClient } from "@/src/lib/gemini";

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState("9:16");
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const generateImage = async () => {
    if (!prompt) return;
    setLoading(true);
    setImageUrl(null);
    setErrorMsg(null);

    try {
      const ai = getGeminiClient();

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: {
          parts: [
            {
              text: prompt,
            },
          ],
        },
        config: {
          imageConfig: {
            aspectRatio: aspectRatio,
          },
        },
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          const base64EncodeString: string = part.inlineData.data;
          setImageUrl(`data:image/png;base64,${base64EncodeString}`);
          break;
        }
      }
    } catch (error: any) {
      console.error(error);
      setErrorMsg(error.message || "Erro ao gerar imagem.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold tracking-tight">
          Gerador de Imagens
        </h1>
        <p className="text-gray-400 mt-1">
          Crie assets visuais para seus vídeos dark em diversos formatos.
        </p>
      </div>

      <Card className="bg-[#141414] border-[#2A2A2A]">
        <CardContent className="pt-6 flex flex-col md:flex-row gap-4">
          <Input
            placeholder="Descreva a imagem detalhadamente (Ex: Um hacker com capuz em uma sala escura com neon roxo, estilo cyberpunk)"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="flex-1"
          />
          <select
            className="flex h-10 w-full md:w-48 rounded-md border border-[#2A2A2A] bg-[#0A0A0A] px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#7B2EFF]"
            value={aspectRatio}
            onChange={(e) => setAspectRatio(e.target.value)}
          >
            <option value="9:16">9:16 (TikTok/Reels)</option>
            <option value="1:1">1:1 (Quadrado)</option>
            <option value="16:9">16:9 (YouTube)</option>
          </select>
          <Button
            variant="neon"
            onClick={generateImage}
            disabled={loading}
            className="gap-2 shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            {loading ? "GERANDO..." : "CRIAR IMAGEM"}
          </Button>
        </CardContent>
      </Card>

      {errorMsg && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
          {errorMsg}
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="w-12 h-12 border-4 border-[#2A2A2A] border-t-[#7B2EFF] rounded-full animate-spin"></div>
          <p className="text-gray-400 animate-pulse">Sintetizando pixels...</p>
        </div>
      )}

      {imageUrl && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center"
        >
          <Card className="bg-[#141414] border-[#2A2A2A] p-2 inline-block relative group">
            <img
              src={imageUrl}
              alt="Generated asset"
              className="rounded-lg max-h-[600px] object-contain"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
              <a
                href={imageUrl}
                download="darkfy-asset.png"
                className="bg-[#7B2EFF] text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-[#6b28e0] transition-colors"
              >
                <Download className="w-4 h-4" />
                Baixar Imagem
              </a>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
