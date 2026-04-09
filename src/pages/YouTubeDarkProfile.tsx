import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Youtube, Copy, Check, UserCircle, Lightbulb, Target } from "lucide-react";
import { motion } from "motion/react";
import { getGeminiClient } from "@/src/lib/gemini";

export default function YouTubeDarkProfile() {
  const [niche, setNiche] = useState("");
  const [subNiche, setSubNiche] = useState("");
  const [tone, setTone] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    channelNames: string,
    description: string,
    persona: string,
    positioning: string,
    videoIdeas: string,
    keywords: string,
    strategy: string,
    thumbnailStyle: string,
    retentionType: string
  } | null>(null);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const generateProfile = async () => {
    if (!niche || !targetAudience) return;
    setLoading(true);
    setResult(null);

    try {
      const ai = getGeminiClient();
      const prompt = `Você é um estrategista especialista em canais DARK (sem aparecer) no YouTube.

O usuário quer criar um pacote completo para um novo canal anônimo do YouTube com as seguintes características:
Nicho: ${niche}
Sub-nicho: ${subNiche || "Não especificado"}
Tom: ${tone || "Não especificado"}
Público-alvo: ${targetAudience}

Sua tarefa é gerar um pacote de criação de canal focado em RETENÇÃO, CURIOSIDADE e AÇÃO.
Linguagem: português BR, direto, sem formalidade.
O nome não pode parecer genérico ou robótico. A persona precisa parecer real. Títulos precisam gerar clique sem parecer golpe.

Retorne APENAS um JSON válido com a seguinte estrutura exata:
{
  "channelNames": "3 opções criativas e memoráveis de NOME DO CANAL.",
  "description": "DESCRIÇÃO DO CANAL — 2 a 3 frases que posicionam o canal.",
  "persona": "PERSONA — nome fictício + estilo de voz + comportamento.",
  "positioning": "POSICIONAMENTO — o diferencial real do canal.",
  "videoIdeas": "5 IDEIAS DE VÍDEOS — com títulos otimizados para clique.",
  "keywords": "PALAVRAS-CHAVE — principais termos para SEO.",
  "strategy": "ESTRATÉGIA DE CONTEÚDO INICIAL (7 dias) — o que postar primeiro e por quê.",
  "thumbnailStyle": "ESTILO DE THUMBNAIL recomendado (ex: emocional, curiosidade, contraste).",
  "retentionType": "TIPO DE RETENÇÃO (história, lista, revelação, etc.)."
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });

      const text = response.text || "{}";
      const cleanedText = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      const data = JSON.parse(cleanedText);
      setResult(data);
    } catch (error) {
      console.error("Erro ao gerar perfil:", error);
      alert("Erro ao gerar perfil. Verifique o console para mais detalhes.");
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

  const renderSection = (title: string, icon: React.ReactNode, content: string, sectionKey: string, colorClass: string) => (
    <Card className="bg-[#141414] border-[#2A2A2A] flex flex-col">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className={`text-lg flex items-center gap-2 ${colorClass}`}>
          {icon}
          {title}
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => copyToClipboard(content, sectionKey)}
        >
          {copiedSection === sectionKey ? (
            <Check className="w-4 h-4 text-green-500" />
          ) : (
            <Copy className="w-4 h-4 text-gray-400" />
          )}
        </Button>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="bg-[#0A0A0A] p-4 rounded-lg border border-[#2A2A2A] h-full">
          <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
            {content}
          </p>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-display font-bold tracking-tight flex items-center gap-3">
          <Youtube className="w-8 h-8 text-red-500" />
          Criador de Perfil Dark YouTube
        </h1>
        <p className="text-gray-400 mt-1">
          Gere um pacote completo para lançar um canal anônimo de sucesso no YouTube.
        </p>
      </div>

      <Card className="bg-[#141414] border-[#2A2A2A]">
        <CardContent className="pt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-300">Nicho *</label>
              <Input
                placeholder="Ex: Mistérios, Finanças, True Crime..."
                className="bg-[#0A0A0A] border-[#2A2A2A] text-white focus-visible:ring-[#7B2EFF]"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
              />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-300">Sub-nicho</label>
              <Input
                placeholder="Ex: Mistérios do Oceano, Criptomoedas..."
                className="bg-[#0A0A0A] border-[#2A2A2A] text-white focus-visible:ring-[#7B2EFF]"
                value={subNiche}
                onChange={(e) => setSubNiche(e.target.value)}
              />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-300">Tom</label>
              <Input
                placeholder="Ex: Sombrio, Investigativo, Dinâmico..."
                className="bg-[#0A0A0A] border-[#2A2A2A] text-white focus-visible:ring-[#7B2EFF]"
                value={tone}
                onChange={(e) => setTone(e.target.value)}
              />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-300">Público-alvo *</label>
              <Input
                placeholder="Ex: Jovens adultos curiosos, Investidores iniciantes..."
                className="bg-[#0A0A0A] border-[#2A2A2A] text-white focus-visible:ring-[#7B2EFF]"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
              />
            </div>
          </div>

          <Button
            variant="neon"
            className="w-full gap-2 py-6 text-lg"
            onClick={generateProfile}
            disabled={loading || !niche || !targetAudience}
          >
            <Youtube className="w-5 h-5" />
            {loading ? "CRIANDO CANAL..." : "GERAR PACOTE DO CANAL"}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {renderSection("Nomes & Descrição", <UserCircle className="w-5 h-5" />, `NOMES:\n${result.channelNames}\n\nDESCRIÇÃO:\n${result.description}`, "names", "text-[#7B2EFF]")}
          {renderSection("Persona & Posicionamento", <Target className="w-5 h-5" />, `PERSONA:\n${result.persona}\n\nPOSICIONAMENTO:\n${result.positioning}`, "persona", "text-blue-500")}
          {renderSection("Ideias de Vídeos & SEO", <Lightbulb className="w-5 h-5" />, `VÍDEOS:\n${result.videoIdeas}\n\nPALAVRAS-CHAVE:\n${result.keywords}`, "videos", "text-yellow-500")}
          {renderSection("Estratégia & Retenção", <Youtube className="w-5 h-5" />, `ESTRATÉGIA (7 DIAS):\n${result.strategy}\n\nTHUMBNAIL:\n${result.thumbnailStyle}\n\nRETENÇÃO:\n${result.retentionType}`, "strategy", "text-red-500")}
        </motion.div>
      )}
    </div>
  );
}
