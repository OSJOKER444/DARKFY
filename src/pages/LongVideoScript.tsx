import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { FileText, Copy, Check, Youtube, AlignLeft, MousePointerClick } from "lucide-react";
import { motion } from "motion/react";
import { getGeminiClient } from "@/src/lib/gemini";

export default function LongVideoScript() {
  const [theme, setTheme] = useState("");
  const [duration, setDuration] = useState("");
  const [style, setStyle] = useState("");
  const [niche, setNiche] = useState("");
  const [tone, setTone] = useState("");
  const [cta, setCta] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    title: string,
    thumbnailIdea: string,
    description: string,
    hook: string,
    body: string,
    transitions: string,
    conclusion: string
  } | null>(null);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const generateScript = async () => {
    if (!theme || !niche) return;
    setLoading(true);
    setResult(null);

    try {
      const ai = getGeminiClient();
      const prompt = `Você é um roteirista especialista em YouTube focado em retenção extrema.

O usuário quer criar um roteiro para um vídeo LONGO de YouTube com as seguintes características:
Tema: ${theme}
Nicho: ${niche}
Duração estimada: ${duration || "Não especificada"}
Estilo: ${style || "Não especificado"}
Tom: ${tone || "Não especificado"}
CTA (Call to Action): ${cta || "Inscrição/Like padrão"}

Sua tarefa é gerar um roteiro completo focado em RETENÇÃO, CURIOSIDADE e AÇÃO.
Linguagem: português BR, direto, sem formalidade, narração palavra por palavra.
O ritmo deve ser progressivo (não pode cair no meio). Cada bloco deve terminar com uma micro-promessa para manter a pessoa assistindo.

Retorne APENAS um JSON válido com a seguinte estrutura exata:
{
  "title": "TÍTULO DO VÍDEO (otimizado para clique).",
  "thumbnailIdea": "IDEIA DE THUMBNAIL.",
  "description": "DESCRIÇÃO DO VÍDEO (curta + palavras-chave).",
  "hook": "GANCHO (30s) — narração exata para prender a atenção.",
  "body": "DESENVOLVIMENTO em blocos numerados. Narração exata. Termine cada bloco com uma micro-promessa.",
  "transitions": "TRANSIÇÕES sugeridas entre os blocos (efeitos visuais/sonoros).",
  "conclusion": "CONCLUSÃO + CTA final de forma natural."
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
    } catch (error: any) {
      console.error("Erro ao gerar roteiro:", error);
      alert(`Erro ao gerar roteiro: ${error.message || "Verifique o console para mais detalhes."}`);
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

  const renderSection = (title: string, icon: React.ReactNode, content: string, sectionKey: string, colorClass: string, fullWidth: boolean = false) => (
    <Card className={`bg-[#141414] border-[#2A2A2A] flex flex-col ${fullWidth ? 'md:col-span-2' : ''}`}>
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
          <FileText className="w-8 h-8 text-orange-500" />
          Roteiro de Vídeo Longo (YouTube)
        </h1>
        <p className="text-gray-400 mt-1">
          Gere roteiros completos para vídeos longos com foco extremo em retenção.
        </p>
      </div>

      <Card className="bg-[#141414] border-[#2A2A2A]">
        <CardContent className="pt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-300">Nicho *</label>
              <Input
                placeholder="Ex: Tecnologia, Finanças, História..."
                className="bg-[#0A0A0A] border-[#2A2A2A] text-white focus-visible:ring-[#7B2EFF]"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
              />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-300">Tema Central *</label>
              <Input
                placeholder="Ex: A ascensão da IA, Como investir do zero..."
                className="bg-[#0A0A0A] border-[#2A2A2A] text-white focus-visible:ring-[#7B2EFF]"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
              />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-300">Duração Estimada</label>
              <Input
                placeholder="Ex: 8 minutos, 15 minutos..."
                className="bg-[#0A0A0A] border-[#2A2A2A] text-white focus-visible:ring-[#7B2EFF]"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-300">Estilo</label>
              <Input
                placeholder="Ex: Documentário, Tutorial, Ensaio em vídeo..."
                className="bg-[#0A0A0A] border-[#2A2A2A] text-white focus-visible:ring-[#7B2EFF]"
                value={style}
                onChange={(e) => setStyle(e.target.value)}
              />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-300">Tom</label>
              <Input
                placeholder="Ex: Sombrio, Educativo, Humorístico..."
                className="bg-[#0A0A0A] border-[#2A2A2A] text-white focus-visible:ring-[#7B2EFF]"
                value={tone}
                onChange={(e) => setTone(e.target.value)}
              />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-300">Call to Action (CTA)</label>
              <Input
                placeholder="Ex: Vender curso X, Pedir inscrição..."
                className="bg-[#0A0A0A] border-[#2A2A2A] text-white focus-visible:ring-[#7B2EFF]"
                value={cta}
                onChange={(e) => setCta(e.target.value)}
              />
            </div>
          </div>

          <Button
            variant="neon"
            className="w-full gap-2 py-6 text-lg"
            onClick={generateScript}
            disabled={loading || !theme || !niche}
          >
            <FileText className="w-5 h-5" />
            {loading ? "ESCREVENDO ROTEIRO..." : "GERAR ROTEIRO LONGO"}
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
          {renderSection("Metadados (Título, Thumb, Descrição)", <MousePointerClick className="w-5 h-5" />, `TÍTULO:\n${result.title}\n\nTHUMBNAIL:\n${result.thumbnailIdea}\n\nDESCRIÇÃO:\n${result.description}`, "meta", "text-blue-500", true)}
          {renderSection("Gancho (Primeiros 30s)", <Youtube className="w-5 h-5" />, result.hook, "hook", "text-red-500", true)}
          {renderSection("Desenvolvimento (Blocos)", <AlignLeft className="w-5 h-5" />, result.body, "body", "text-yellow-500", true)}
          {renderSection("Transições", <Copy className="w-5 h-5" />, result.transitions, "transitions", "text-gray-400")}
          {renderSection("Conclusão & CTA", <FileText className="w-5 h-5" />, result.conclusion, "conclusion", "text-[#7B2EFF]")}
        </motion.div>
      )}
    </div>
  );
}
