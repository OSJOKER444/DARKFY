import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Image as ImageIcon, Copy, Check, Palette, Type, Layout } from "lucide-react";
import { motion } from "motion/react";
import { getGeminiClient } from "@/src/lib/gemini";

export default function ThumbnailPrompt() {
  const [theme, setTheme] = useState("");
  const [style, setStyle] = useState("");
  const [tool, setTool] = useState("");
  const [centralElement, setCentralElement] = useState("");
  const [colors, setColors] = useState("");
  const [context, setContext] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    mainPrompt: string,
    altPrompt: string,
    textOverlay: string,
    composition: string,
    emotion: string,
    visualFocus: string,
    contrastIdea: string
  } | null>(null);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const generatePrompt = async () => {
    if (!theme) return;
    setLoading(true);
    setResult(null);

    try {
      const ai = getGeminiClient();
      const prompt = `Você é um diretor de arte especialista em Thumbnails virais para YouTube.

O usuário quer gerar prompts para IA (Midjourney, DALL-E, etc) para criar uma thumbnail com as seguintes características:
Tema: ${theme}
Estilo: ${style || "Não especificado (sugira um de alta conversão)"}
Ferramenta: ${tool || "Midjourney"}
Elemento Central: ${centralElement || "Não especificado"}
Cores: ${colors || "Não especificadas"}
Contexto: ${context || "Nenhum"}

Sua tarefa é gerar prompts detalhados e dicas de composição focados em CTR (Click-Through Rate).
Linguagem: português BR, direto, sem formalidade.

Retorne APENAS um JSON válido com a seguinte estrutura exata:
{
  "mainPrompt": "PROMPT PRINCIPAL (em inglês, otimizado para a ferramenta escolhida).",
  "altPrompt": "PROMPT ALTERNATIVO (em inglês, com uma abordagem visual diferente).",
  "textOverlay": "TEXTO PARA SOBREPOR (curto, máximo 3-4 palavras, complementar à imagem).",
  "composition": "DICAS DE COMPOSIÇÃO (onde colocar o texto, regra dos terços, iluminação).",
  "emotion": "EMOÇÃO PRINCIPAL da thumbnail (medo, curiosidade, surpresa, etc.).",
  "visualFocus": "FOCO VISUAL (1 elemento dominante) — evitar poluição.",
  "contrastIdea": "IDEIA DE CONTRASTE (ex: antes/depois, certo/errado, expectativa/realidade)."
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
      console.error("Erro ao gerar prompt:", error);
      alert("Erro ao gerar prompt. Verifique o console para mais detalhes.");
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
          <ImageIcon className="w-8 h-8 text-pink-500" />
          Thumbnail IA (Gerador de Prompt)
        </h1>
        <p className="text-gray-400 mt-1">
          Crie prompts perfeitos para gerar thumbnails de alto CTR usando inteligência artificial.
        </p>
      </div>

      <Card className="bg-[#141414] border-[#2A2A2A]">
        <CardContent className="pt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-300">Tema do Vídeo *</label>
              <Input
                placeholder="Ex: Como investir em 2024, Mistério de Atlântida..."
                className="bg-[#0A0A0A] border-[#2A2A2A] text-white focus-visible:ring-[#7B2EFF]"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
              />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-300">Estilo Visual</label>
              <Input
                placeholder="Ex: Realista, 3D Pixar, Cyberpunk, Minimalista..."
                className="bg-[#0A0A0A] border-[#2A2A2A] text-white focus-visible:ring-[#7B2EFF]"
                value={style}
                onChange={(e) => setStyle(e.target.value)}
              />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-300">Ferramenta de IA</label>
              <Input
                placeholder="Ex: Midjourney, DALL-E 3, Leonardo AI..."
                className="bg-[#0A0A0A] border-[#2A2A2A] text-white focus-visible:ring-[#7B2EFF]"
                value={tool}
                onChange={(e) => setTool(e.target.value)}
              />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-300">Elemento Central</label>
              <Input
                placeholder="Ex: Rosto assustado, Gráfico subindo, Objeto brilhante..."
                className="bg-[#0A0A0A] border-[#2A2A2A] text-white focus-visible:ring-[#7B2EFF]"
                value={centralElement}
                onChange={(e) => setCentralElement(e.target.value)}
              />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-300">Cores Principais</label>
              <Input
                placeholder="Ex: Neon, Tons escuros, Vermelho e Amarelo..."
                className="bg-[#0A0A0A] border-[#2A2A2A] text-white focus-visible:ring-[#7B2EFF]"
                value={colors}
                onChange={(e) => setColors(e.target.value)}
              />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-300">Contexto Adicional</label>
              <Input
                placeholder="Ex: O vídeo é sobre uma fraude milionária..."
                className="bg-[#0A0A0A] border-[#2A2A2A] text-white focus-visible:ring-[#7B2EFF]"
                value={context}
                onChange={(e) => setContext(e.target.value)}
              />
            </div>
          </div>

          <Button
            variant="neon"
            className="w-full gap-2 py-6 text-lg"
            onClick={generatePrompt}
            disabled={loading || !theme}
          >
            <ImageIcon className="w-5 h-5" />
            {loading ? "GERANDO PROMPTS..." : "GERAR PROMPTS PARA THUMBNAIL"}
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
          {renderSection("Prompts (Copie e cole na IA)", <ImageIcon className="w-5 h-5" />, `PRINCIPAL:\n${result.mainPrompt}\n\nALTERNATIVO:\n${result.altPrompt}`, "prompts", "text-pink-500")}
          {renderSection("Texto & Emoção", <Type className="w-5 h-5" />, `TEXTO NA TELA:\n${result.textOverlay}\n\nEMOÇÃO:\n${result.emotion}`, "text", "text-blue-500")}
          {renderSection("Composição & Foco", <Layout className="w-5 h-5" />, `COMPOSIÇÃO:\n${result.composition}\n\nFOCO VISUAL:\n${result.visualFocus}`, "composition", "text-yellow-500")}
          {renderSection("Estratégia de Contraste", <Palette className="w-5 h-5" />, result.contrastIdea, "contrast", "text-[#7B2EFF]")}
        </motion.div>
      )}
    </div>
  );
}
