import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Textarea } from "@/src/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Sparkles, Copy, Check, Image as ImageIcon, Video as VideoIcon } from "lucide-react";
import { motion } from "motion/react";
import { getGeminiClient } from "@/src/lib/gemini";
import { cn } from "@/src/lib/utils";

export default function ProfessionalPrompter() {
  const [type, setType] = useState<"image" | "video">("image");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [copied, setCopied] = useState(false);

  const generatePrompt = async () => {
    if (!description.trim()) return;
    setLoading(true);

    try {
      const ai = getGeminiClient();
      const prompt = `Você é um engenheiro de prompts profissional e especialista em IA generativa.
O usuário quer gerar um(a) ${type === "image" ? "imagem" : "vídeo"} com a seguinte descrição: "${description}".

Sua tarefa é criar um prompt em INGLÊS, altamente detalhado, profissional e otimizado para IAs geradoras de ${type === "image" ? "imagem (como Midjourney v6, DALL-E 3)" : "vídeo (como Sora, Runway Gen-2, Veo)"}.

O prompt deve incluir:
- Descrição clara do sujeito/ação principal.
- Detalhes de iluminação (ex: cinematic lighting, golden hour, volumetric lighting).
- Estilo de câmera/lente (ex: 35mm lens, wide angle, drone shot, macro).
- Atmosfera e tom (ex: moody, cyberpunk, ethereal, hyper-realistic).
- Resolução e qualidade (ex: 8k, photorealistic, highly detailed).
${type === "video" ? "- Movimento de câmera (ex: slow pan, tracking shot, zoom in)." : ""}

Retorne APENAS o prompt final em inglês, sem introduções, sem explicações e sem aspas no início ou fim.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: prompt,
      });

      setGeneratedPrompt(response.text || "");
    } catch (error) {
      console.error("Erro ao gerar prompt:", error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!generatedPrompt) return;
    navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-display font-bold tracking-tight">
          Prompter Profissional
        </h1>
        <p className="text-gray-400 mt-1">
          Descreva o que você imagina e a IA criará o prompt perfeito para Midjourney, Sora, Runway, etc.
        </p>
      </div>

      <Card className="bg-[#141414] border-[#2A2A2A]">
        <CardContent className="pt-6 space-y-6">
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-300">O que você deseja gerar?</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setType("image")}
                className={cn(
                  "flex flex-col items-center justify-center p-4 rounded-xl border transition-all",
                  type === "image"
                    ? "border-[#7B2EFF] bg-[#7B2EFF]/10 text-[#7B2EFF]"
                    : "border-[#2A2A2A] bg-[#0A0A0A] text-gray-400 hover:border-gray-600 hover:text-gray-300"
                )}
              >
                <ImageIcon className="w-8 h-8 mb-2" />
                <span className="font-medium">Imagem</span>
              </button>
              <button
                onClick={() => setType("video")}
                className={cn(
                  "flex flex-col items-center justify-center p-4 rounded-xl border transition-all",
                  type === "video"
                    ? "border-[#7B2EFF] bg-[#7B2EFF]/10 text-[#7B2EFF]"
                    : "border-[#2A2A2A] bg-[#0A0A0A] text-gray-400 hover:border-gray-600 hover:text-gray-300"
                )}
              >
                <VideoIcon className="w-8 h-8 mb-2" />
                <span className="font-medium">Vídeo</span>
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-300">
              Descreva sua ideia com suas próprias palavras
            </label>
            <Textarea
              placeholder="Ex: Um gato astronauta flutuando no espaço com a Terra ao fundo, estilo realista e iluminação cinematográfica..."
              className="min-h-[120px] bg-[#0A0A0A] border-[#2A2A2A] text-white resize-none focus-visible:ring-[#7B2EFF]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <Button
            variant="neon"
            className="w-full gap-2 py-6 text-lg"
            onClick={generatePrompt}
            disabled={loading || !description.trim()}
          >
            <Sparkles className="w-5 h-5" />
            {loading ? "CRIANDO PROMPT..." : "GERAR PROMPT PROFISSIONAL"}
          </Button>
        </CardContent>
      </Card>

      {generatedPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="bg-[#141414] border-[#7B2EFF]/50 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-[#7B2EFF]" />
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2 text-[#7B2EFF]">
                <Sparkles className="w-5 h-5" />
                Seu Prompt Profissional
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                className="border-[#2A2A2A] hover:bg-[#2A2A2A] text-white gap-2"
                onClick={copyToClipboard}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-green-500" />
                    Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copiar Prompt
                  </>
                )}
              </Button>
            </CardHeader>
            <CardContent>
              <div className="bg-[#0A0A0A] p-4 rounded-lg border border-[#2A2A2A]">
                <p className="text-gray-300 font-mono text-sm leading-relaxed whitespace-pre-wrap">
                  {generatedPrompt}
                </p>
              </div>
              <p className="text-xs text-gray-500 mt-4 text-center">
                Cole este prompt no {type === "image" ? "Midjourney, DALL-E ou Leonardo AI" : "Sora, Runway, Veo ou Kling AI"} para obter os melhores resultados.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
