import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Sparkles, Target, TrendingUp, DollarSign, Play } from "lucide-react";
import { motion } from "motion/react";
import { updateMetric } from "@/src/lib/metrics";
import { getGeminiClient } from "@/src/lib/gemini";

export default function Niches() {
  const [category, setCategory] = useState("");
  const [language, setLanguage] = useState("");
  const [audience, setAudience] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const generateNiches = async () => {
    if (!category || !language || !audience) return;
    setLoading(true);

    try {
      const ai = getGeminiClient();
      const prompt = `Gere 3 ideias de nichos virais para TikTok "dark" (sem aparecer).
      Categoria: ${category}
      Idioma: ${language}
      Público: ${audience}
      
      Retorne APENAS um JSON válido neste formato:
      [
        {
          "niche": "Nome do Nicho",
          "competition": "Alta/Média/Baixa",
          "monetization": "Alta/Média/Baixa",
          "examples": ["Exemplo de vídeo 1", "Exemplo de vídeo 2"]
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
      setResults(data);
      updateMetric("darkfy_metric_niches", data.length);
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
          Nichos Virais
        </h1>
        <p className="text-gray-400 mt-1">
          Encontre oceanos azuis para seus perfis.
        </p>
      </div>

      <Card className="bg-[#141414] border-[#2A2A2A]">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Categoria</label>
              <Input
                placeholder="Ex: Finanças, Saúde, Curiosidades"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Idioma</label>
              <Input
                placeholder="Ex: Português, Inglês"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Público</label>
              <Input
                placeholder="Ex: Jovens, Empreendedores"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
              />
            </div>
          </div>
          <Button
            variant="neon"
            className="w-full mt-6 gap-2"
            onClick={generateNiches}
            disabled={loading}
          >
            <Sparkles className="w-4 h-4" />
            {loading ? "ANALISANDO DADOS..." : "DESCOBRIR NICHOS"}
          </Button>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <div className="grid gap-6 md:grid-cols-3">
          {results.map((niche, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="bg-[#141414] border-[#2A2A2A] h-full">
                <CardHeader>
                  <CardTitle className="text-xl text-[#7B2EFF] flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    {niche.niche}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400 flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" /> Concorrência
                    </span>
                    <span className="font-medium">{niche.competition}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400 flex items-center gap-1">
                      <DollarSign className="w-4 h-4" /> Monetização
                    </span>
                    <span className="font-medium text-green-400">
                      {niche.monetization}
                    </span>
                  </div>
                  <div className="pt-4 border-t border-[#2A2A2A]">
                    <span className="text-sm text-gray-400 block mb-2">
                      Exemplos de Vídeos:
                    </span>
                    <ul className="space-y-2">
                      {niche.examples.map((ex: string, j: number) => (
                        <li key={j} className="text-sm flex items-start gap-2">
                          <Play className="w-4 h-4 text-[#7B2EFF] shrink-0 mt-0.5" />
                          <span>{ex}</span>
                        </li>
                      ))}
                    </ul>
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
