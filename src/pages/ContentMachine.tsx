import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Sparkles, Video, ListVideo, Zap } from "lucide-react";
import { GoogleGenAI } from "@google/genai";
import { motion } from "motion/react";
import { updateMetric } from "@/src/lib/metrics";

export default function ContentMachine() {
  const [niche, setNiche] = useState("");
  const [theme, setTheme] = useState("");
  const [contentType, setContentType] = useState("");
  const [loading, setLoading] = useState(false);
  const [ideas, setIdeas] = useState<any[]>([]);

  const generateIdeas = async () => {
    if (!niche || !theme || !contentType) return;
    setLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `Gere 5 ideias de vídeos virais para TikTok "dark" (sem aparecer).
      Nicho: ${niche}
      Tema: ${theme}
      Tipo de conteúdo: ${contentType}
      
      Retorne APENAS um JSON válido neste formato:
      [
        {
          "title": "Título do vídeo",
          "hook": "Sugestão de Hook chamativo",
          "format": "Formato do vídeo (ex: Tela dividida, Imagens + Voz IA)"
        }
      ]`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const data = JSON.parse(response.text || "[]");
      setIdeas(data);
      updateMetric("darkfy_metric_ideas", data.length);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold tracking-tight">
          Máquina de Conteúdo
        </h1>
        <p className="text-gray-400 mt-1">
          Gere dezenas de ideias de vídeos virais em segundos.
        </p>
      </div>

      <Card className="bg-[#141414] border-[#2A2A2A]">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Nicho</label>
              <Input
                placeholder="Ex: Finanças"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Tema</label>
              <Input
                placeholder="Ex: Investimentos para iniciantes"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Tipo de Conteúdo</label>
              <Input
                placeholder="Ex: Curiosidades, Tutorial, Erros"
                value={contentType}
                onChange={(e) => setContentType(e.target.value)}
              />
            </div>
          </div>
          <Button
            variant="neon"
            className="w-full mt-6 gap-2"
            onClick={generateIdeas}
            disabled={loading}
          >
            <Sparkles className="w-4 h-4" />
            {loading ? "GERANDO IDEIAS..." : "GERAR 30 IDEIAS VIRAIS"}
          </Button>
        </CardContent>
      </Card>

      {ideas.length > 0 && (
        <div className="grid gap-4">
          {ideas.map((idea, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="bg-[#141414] border-[#2A2A2A] hover:border-[#7B2EFF] transition-colors">
                <CardContent className="p-4 flex items-start gap-4">
                  <div className="w-10 h-10 rounded bg-[#0A0A0A] border border-[#2A2A2A] flex items-center justify-center shrink-0">
                    <Video className="w-5 h-5 text-[#7B2EFF]" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <h3 className="font-medium text-lg">{idea.title}</h3>
                    <div className="flex flex-col gap-2 text-sm text-gray-400">
                      <div className="flex items-start gap-2">
                        <Zap className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
                        <span>
                          <strong className="text-white">Hook:</strong>{" "}
                          {idea.hook}
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <ListVideo className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                        <span>
                          <strong className="text-white">Formato:</strong>{" "}
                          {idea.format}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
