import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Video, Copy, Check, FileText, Hash, Eye, PlayCircle } from "lucide-react";
import { motion } from "motion/react";
import { getGeminiClient } from "@/src/lib/gemini";

export default function ShortVideoMachine() {
  const [niche, setNiche] = useState("");
  const [theme, setTheme] = useState("");
  const [format, setFormat] = useState("");
  const [style, setStyle] = useState("");
  const [tone, setTone] = useState("");
  const [duration, setDuration] = useState("");
  const [extraInstructions, setExtraInstructions] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{script: string, visualIdea: string, caption: string} | null>(null);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const generateContent = async () => {
    if (!niche || !theme) return;
    setLoading(true);
    setResult(null);

    try {
      const ai = getGeminiClient();
      const prompt = `Você é um estrategista especialista em conteúdo viral "dark" (sem aparecer) para vídeos curtos (Reels/TikTok/Shorts).

O usuário quer criar um roteiro de vídeo curto com as seguintes características:
Nicho: ${niche}
Tema: ${theme}
Formato: ${format || "Não especificado (sugira um ideal)"}
Estilo: ${style || "Não especificado (narração/texto/misto)"}
Tom: ${tone || "Não especificado"}
Duração: ${duration || "Não especificada"}
Instruções extras: ${extraInstructions || "Nenhuma"}

Sua tarefa é gerar um pacote de conteúdo completo focado em RETENÇÃO, CURIOSIDADE e AÇÃO.
Linguagem: português BR, direto, sem formalidade, próxima, real, de quem já viveu o problema — nunca copy de agência.
Evite frases genéricas que servem pra qualquer nicho.
PROIBIDO usar os termos: "método", "renda extra", "incrível", "transformar sua vida", motivação vazia, termos genéricos de marketing, promessa exagerada, conteúdo que parece "mais do mesmo".

O roteiro DEVE conter:
- GANCHO (primeiros 3 segundos — parar o scroll imediatamente)
- DESENVOLVIMENTO (entrega direta, ritmo rápido, sem gordura)
- CTA final (simples, específico e natural)

Regras de formatação do roteiro:
- Se o estilo for "só texto na tela", escreva as caixas de texto exatas que aparecem na tela, uma por vez.
- Se for "com narração", escreva o que a voz fala, palavra por palavra.
- Se for "misto", indique claramente o que é texto na tela e o que é narração.

Retorne APENAS um JSON válido com a seguinte estrutura exata:
{
  "script": "O roteiro completo com Gancho, Desenvolvimento e CTA, seguindo as regras de formatação.",
  "visualIdea": "IDEIA VISUAL do vídeo (o que aparece na tela durante o conteúdo) e RITMO DE CORTES (rápido, médio, acelerado).",
  "caption": "LEGENDA pronta para postar (curta + com leve curiosidade ou tensão) e hashtags."
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });

      const data = JSON.parse(response.text || "{}");
      setResult(data);
    } catch (error) {
      console.error("Erro ao gerar conteúdo:", error);
      alert("Erro ao gerar conteúdo. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, section: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-display font-bold tracking-tight flex items-center gap-3">
          <PlayCircle className="w-8 h-8 text-[#7B2EFF]" />
          Máquina de Conteúdo (Vídeos Curtos)
        </h1>
        <p className="text-gray-400 mt-1">
          Gere roteiros virais para Reels, TikTok e Shorts com alta retenção e conversão.
        </p>
      </div>

      <Card className="bg-[#141414] border-[#2A2A2A]">
        <CardContent className="pt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-300">Nicho *</label>
              <Input
                placeholder="Ex: Finanças, Saúde, Curiosidades..."
                className="bg-[#0A0A0A] border-[#2A2A2A] text-white focus-visible:ring-[#7B2EFF]"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
              />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-300">Tema do Vídeo *</label>
              <Input
                placeholder="Ex: 3 erros ao investir em FIIs"
                className="bg-[#0A0A0A] border-[#2A2A2A] text-white focus-visible:ring-[#7B2EFF]"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
              />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-300">Formato</label>
              <Input
                placeholder="Ex: UGC, POV, Criativo para ADS..."
                className="bg-[#0A0A0A] border-[#2A2A2A] text-white focus-visible:ring-[#7B2EFF]"
                value={format}
                onChange={(e) => setFormat(e.target.value)}
              />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-300">Estilo</label>
              <Input
                placeholder="Ex: Narração, Só Texto, Misto..."
                className="bg-[#0A0A0A] border-[#2A2A2A] text-white focus-visible:ring-[#7B2EFF]"
                value={style}
                onChange={(e) => setStyle(e.target.value)}
              />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-300">Tom</label>
              <Input
                placeholder="Ex: Irônico, Direto, Misterioso..."
                className="bg-[#0A0A0A] border-[#2A2A2A] text-white focus-visible:ring-[#7B2EFF]"
                value={tone}
                onChange={(e) => setTone(e.target.value)}
              />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-300">Duração</label>
              <Input
                placeholder="Ex: 15s, 30s, 60s..."
                className="bg-[#0A0A0A] border-[#2A2A2A] text-white focus-visible:ring-[#7B2EFF]"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-300">Instruções Extras</label>
            <Textarea
              placeholder="Ex: Focar na dor X, usar a curiosidade Y..."
              className="min-h-[80px] bg-[#0A0A0A] border-[#2A2A2A] text-white resize-none focus-visible:ring-[#7B2EFF]"
              value={extraInstructions}
              onChange={(e) => setExtraInstructions(e.target.value)}
            />
          </div>

          <Button
            variant="neon"
            className="w-full gap-2 py-6 text-lg"
            onClick={generateContent}
            disabled={loading || !niche || !theme}
          >
            <PlayCircle className="w-5 h-5" />
            {loading ? "GERANDO CONTEÚDO..." : "GERAR VÍDEO CURTO"}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Roteiro */}
          <Card className="bg-[#141414] border-[#2A2A2A] flex flex-col md:col-span-2">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2 text-yellow-500">
                <FileText className="w-5 h-5" />
                Roteiro do Vídeo
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => copyToClipboard(result.script, "script")}
              >
                {copiedSection === "script" ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4 text-gray-400" />
                )}
              </Button>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="bg-[#0A0A0A] p-4 rounded-lg border border-[#2A2A2A] h-full">
                <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                  {result.script}
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6 flex flex-col">
            {/* Ideia Visual */}
            <Card className="bg-[#141414] border-[#2A2A2A] flex-1 flex flex-col">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2 text-[#7B2EFF]">
                  <Eye className="w-5 h-5" />
                  Visual & Ritmo
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => copyToClipboard(result.visualIdea, "visual")}
                >
                  {copiedSection === "visual" ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-400" />
                  )}
                </Button>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="bg-[#0A0A0A] p-4 rounded-lg border border-[#2A2A2A] h-full">
                  <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                    {result.visualIdea}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Legenda */}
            <Card className="bg-[#141414] border-[#2A2A2A] flex-1 flex flex-col">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2 text-blue-500">
                  <Hash className="w-5 h-5" />
                  Legenda
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => copyToClipboard(result.caption, "caption")}
                >
                  {copiedSection === "caption" ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-400" />
                  )}
                </Button>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="bg-[#0A0A0A] p-4 rounded-lg border border-[#2A2A2A] h-full">
                  <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                    {result.caption}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      )}
    </div>
  );
}
