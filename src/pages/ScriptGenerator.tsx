import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Sparkles, FileText, Copy, Check } from "lucide-react";
import { motion } from "motion/react";
import { getGeminiClient } from "@/src/lib/gemini";

export default function ScriptGenerator() {
  const [niche, setNiche] = useState("");
  const [theme, setTheme] = useState("");
  const [duration, setDuration] = useState("30s");
  const [loading, setLoading] = useState(false);
  const [scripts, setScripts] = useState<any[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const generateScripts = async () => {
    if (!niche || !theme || !duration) return;
    setLoading(true);

    try {
      const ai = getGeminiClient();
      const prompt = `Gere 3 roteiros virais para TikTok "dark" (sem aparecer).
      Nicho: ${niche}
      Tema: ${theme}
      Duração: ${duration}
      
      O roteiro DEVE seguir ESTRITAMENTE esta estrutura:
      HOOK (Frase inicial extremamente chamativa para prender atenção nos primeiros segundos. Use gatilhos como curiosidade, segredo, erro comum, descoberta, mistério)
      DESENVOLVIMENTO (Explicar o conteúdo rapidamente. Frases curtas, ritmo rápido, linguagem simples, manter curiosidade até o final)
      CTA (Finalizar incentivando uma ação: seguir, salvar, comentar, link na bio)
      
      Retorne APENAS um JSON válido neste formato:
      [
        {
          "hook": "Texto do hook",
          "development": "Texto do desenvolvimento",
          "cta": "Texto do CTA"
        }
      ]`;

      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const data = JSON.parse(response.text || "[]");
      setScripts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (script: any, index: number) => {
    const text = `HOOK\n${script.hook}\n\nDESENVOLVIMENTO\n${script.development}\n\nCTA\n${script.cta}`;
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold tracking-tight">
          Gerador de Roteiros Virais
        </h1>
        <p className="text-gray-400 mt-1">
          Crie roteiros otimizados para retenção máxima no TikTok.
        </p>
      </div>

      <Card className="bg-[#141414] border-[#2A2A2A]">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Nicho</label>
              <Input
                placeholder="Ex: Curiosidades"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Tema do Vídeo</label>
              <Input
                placeholder="Ex: Mistérios do Oceano"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Duração</label>
              <select
                className="flex h-10 w-full rounded-md border border-[#2A2A2A] bg-[#0A0A0A] px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#7B2EFF]"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              >
                <option value="15s">15 Segundos</option>
                <option value="30s">30 Segundos</option>
                <option value="60s">60 Segundos</option>
              </select>
            </div>
          </div>
          <Button
            variant="neon"
            className="w-full mt-6 gap-2"
            onClick={generateScripts}
            disabled={loading}
          >
            <Sparkles className="w-4 h-4" />
            {loading ? "ESCREVENDO ROTEIROS..." : "GERAR 3 ROTEIROS VIRAIS"}
          </Button>
        </CardContent>
      </Card>

      {scripts.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {scripts.map((script, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="bg-[#141414] border-[#2A2A2A] h-full flex flex-col relative group">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => copyToClipboard(script, i)}
                >
                  {copiedIndex === i ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2 text-[#7B2EFF]">
                    <FileText className="w-5 h-5" />
                    Roteiro {i + 1}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 flex-1">
                  <div>
                    <span className="text-xs font-bold text-yellow-500 uppercase tracking-wider mb-1 block">
                      Hook
                    </span>
                    <p className="text-sm bg-[#0A0A0A] p-2 rounded border border-[#2A2A2A] font-medium">
                      "{script.hook}"
                    </p>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-blue-500 uppercase tracking-wider mb-1 block">
                      Desenvolvimento
                    </span>
                    <p className="text-sm bg-[#0A0A0A] p-2 rounded border border-[#2A2A2A] text-gray-300">
                      {script.development}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-green-500 uppercase tracking-wider mb-1 block">
                      CTA
                    </span>
                    <p className="text-sm bg-[#0A0A0A] p-2 rounded border border-[#2A2A2A] font-medium">
                      "{script.cta}"
                    </p>
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
