import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Scan, Link as LinkIcon, Video, User, Copy, Check, Smartphone, Camera, FileText, Hash, LayoutTemplate } from "lucide-react";
import { motion } from "motion/react";
import { getGeminiClient } from "@/src/lib/gemini";
import { cn } from "@/src/lib/utils";
import { Textarea } from "@/src/components/ui/textarea";

export default function DarkModeling() {
  const [platform, setPlatform] = useState<"tiktok" | "instagram">("tiktok");
  const [type, setType] = useState<"video" | "profile">("video");
  const [url, setUrl] = useState("");
  const [context, setContext] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{script: string, caption: string, profileStrategy: string} | null>(null);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const generateModeling = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setResult(null);

    try {
      const ai = getGeminiClient();
      const prompt = `Você é um estrategista especialista em conteúdo viral "dark" (sem aparecer).
O usuário quer modelar um conteúdo de sucesso para criar o seu próprio.
Plataforma de origem: ${platform}
Tipo de conteúdo a ser modelado: ${type}
Link de referência: ${url}
${context ? `Contexto/Transcrição fornecida pelo usuário:\n"${context}"\n` : ""}

Sua tarefa é acessar o link fornecido e analisar profundamente o conteúdo. Se o usuário forneceu uma transcrição ou contexto adicional, use isso como base principal para a sua análise. Entregue a modelagem completa adaptada para um canal DARK (sem mostrar o rosto).

Retorne APENAS um JSON válido com a seguinte estrutura exata:
{
  "script": "O roteiro modelado detalhado (Hook chamativo, Desenvolvimento com retenção, CTA forte) adaptado para um canal dark.",
  "caption": "Uma legenda viral modelada, incluindo chamada para ação e hashtags estratégicas.",
  "profileStrategy": "Como o perfil deve ser estruturado (ideia de foto de perfil, bio otimizada, destaques) para atrair o mesmo público desse conteúdo."
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          tools: [{ googleSearch: {} }, { urlContext: {} }],
          toolConfig: { includeServerSideToolInvocations: true }
        }
      });

      const text = response.text || "{}";
      const cleanedText = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      const data = JSON.parse(cleanedText);
      setResult(data);
    } catch (error: any) {
      console.error("Erro ao gerar modelagem:", error);
      alert(`Erro ao analisar o link: ${error.message || "Verifique se é um link válido e tente novamente."}`);
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
          <Scan className="w-8 h-8 text-[#7B2EFF]" />
          Modelagem Dark
        </h1>
        <p className="text-gray-400 mt-1">
          Cole o link de um vídeo ou perfil viral e a IA fará a engenharia reversa, entregando tudo modelado para o seu canal.
        </p>
      </div>

      <Card className="bg-[#141414] border-[#2A2A2A]">
        <CardContent className="pt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Plataforma */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-300">Plataforma de Origem</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setPlatform("tiktok")}
                  className={cn(
                    "flex items-center justify-center gap-2 p-3 rounded-xl border transition-all",
                    platform === "tiktok"
                      ? "border-[#7B2EFF] bg-[#7B2EFF]/10 text-[#7B2EFF]"
                      : "border-[#2A2A2A] bg-[#0A0A0A] text-gray-400 hover:border-gray-600 hover:text-gray-300"
                  )}
                >
                  <Smartphone className="w-5 h-5" />
                  <span className="font-medium">TikTok</span>
                </button>
                <button
                  onClick={() => setPlatform("instagram")}
                  className={cn(
                    "flex items-center justify-center gap-2 p-3 rounded-xl border transition-all",
                    platform === "instagram"
                      ? "border-[#7B2EFF] bg-[#7B2EFF]/10 text-[#7B2EFF]"
                      : "border-[#2A2A2A] bg-[#0A0A0A] text-gray-400 hover:border-gray-600 hover:text-gray-300"
                  )}
                >
                  <Camera className="w-5 h-5" />
                  <span className="font-medium">Instagram</span>
                </button>
              </div>
            </div>

            {/* Tipo */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-300">O que deseja modelar?</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setType("video")}
                  className={cn(
                    "flex items-center justify-center gap-2 p-3 rounded-xl border transition-all",
                    type === "video"
                      ? "border-[#7B2EFF] bg-[#7B2EFF]/10 text-[#7B2EFF]"
                      : "border-[#2A2A2A] bg-[#0A0A0A] text-gray-400 hover:border-gray-600 hover:text-gray-300"
                  )}
                >
                  <Video className="w-5 h-5" />
                  <span className="font-medium">Vídeo</span>
                </button>
                <button
                  onClick={() => setType("profile")}
                  className={cn(
                    "flex items-center justify-center gap-2 p-3 rounded-xl border transition-all",
                    type === "profile"
                      ? "border-[#7B2EFF] bg-[#7B2EFF]/10 text-[#7B2EFF]"
                      : "border-[#2A2A2A] bg-[#0A0A0A] text-gray-400 hover:border-gray-600 hover:text-gray-300"
                  )}
                >
                  <User className="w-5 h-5" />
                  <span className="font-medium">Perfil</span>
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-300">
              Link do {type === "video" ? "Vídeo" : "Perfil"}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LinkIcon className="h-5 w-5 text-gray-500" />
              </div>
              <Input
                placeholder={`Cole a URL do ${type === "video" ? "vídeo" : "perfil"} aqui...`}
                className="pl-10 bg-[#0A0A0A] border-[#2A2A2A] text-white focus-visible:ring-[#7B2EFF]"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-300">
              Transcrição ou Descrição (Opcional, mas recomendado)
            </label>
            <Textarea
              placeholder="Cole aqui a transcrição do vídeo, a bio do perfil ou detalhes adicionais para ajudar a IA na análise..."
              className="min-h-[100px] bg-[#0A0A0A] border-[#2A2A2A] text-white resize-none focus-visible:ring-[#7B2EFF]"
              value={context}
              onChange={(e) => setContext(e.target.value)}
            />
            <p className="text-xs text-gray-500">
              Plataformas como TikTok e Instagram costumam bloquear acessos automáticos. Colar o texto do vídeo garante 100% de precisão na modelagem.
            </p>
          </div>

          <Button
            variant="neon"
            className="w-full gap-2 py-6 text-lg"
            onClick={generateModeling}
            disabled={loading || !url.trim()}
          >
            <Scan className="w-5 h-5" />
            {loading ? "ANALISANDO E MODELANDO..." : "INICIAR MODELAGEM DARK"}
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
          <Card className="bg-[#141414] border-[#2A2A2A] flex flex-col">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2 text-yellow-500">
                <FileText className="w-5 h-5" />
                Roteiro Modelado
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

          {/* Legenda */}
          <Card className="bg-[#141414] border-[#2A2A2A] flex flex-col">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2 text-blue-500">
                <Hash className="w-5 h-5" />
                Legenda & Hashtags
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

          {/* Perfil */}
          <Card className="bg-[#141414] border-[#2A2A2A] flex flex-col">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2 text-[#7B2EFF]">
                <LayoutTemplate className="w-5 h-5" />
                Estratégia de Perfil
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => copyToClipboard(result.profileStrategy, "profile")}
              >
                {copiedSection === "profile" ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4 text-gray-400" />
                )}
              </Button>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="bg-[#0A0A0A] p-4 rounded-lg border border-[#2A2A2A] h-full">
                <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                  {result.profileStrategy}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
