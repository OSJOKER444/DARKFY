import { motion } from "motion/react";
import { AudioLines, FileText, ImageIcon, Code, Video, ExternalLink, Wrench } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";

const toolCategories = [
  {
    category: "Narração",
    icon: AudioLines,
    color: "text-purple-500",
    items: [
      { name: "MiniMax", desc: "Tecnologia de áudio avançada e geração de voz realista.", url: "http://minimax.io/" },
      { name: "ElevenLabs", desc: "A principal ferramenta para narrações autênticas e clonagem de voz.", url: "https://elevenlabs.io" }
    ]
  },
  {
    category: "Texto",
    icon: FileText,
    color: "text-blue-500",
    items: [
      { name: "ChatGPT", desc: "Modelo de linguagem líder para criação de roteiros e textos.", url: "https://chatgpt.com" },
      { name: "Claude", desc: "IA avançada e detalhista com excelente capacidade de contexto longo.", url: "https://claude.ai" }
    ]
  },
  {
    category: "Imagem",
    icon: ImageIcon,
    color: "text-pink-500",
    items: [
      { name: "Gemini", desc: "Multimodal do Google, excelente para gerar e analisar imagens.", url: "https://gemini.google.com" },
      { name: "Lovart", desc: "Geração de imagens de alta qualidade.", url: "https://lovart.com" }
    ]
  },
  {
    category: "Aplicativo SaaS",
    icon: Code,
    color: "text-green-500",
    items: [
      { name: "Lovable", desc: "Criação rápida de aplicações e produtos digitais.", url: "https://lovable.dev" },
      { name: "Google AI Studio", desc: "Plataforma focada no desenvolvedor para criar aplicações baseadas no Gemini.", url: "https://aistudio.google.com" }
    ]
  },
  {
    category: "Vídeo",
    icon: Video,
    color: "text-red-500",
    items: [
      { name: "Grok", desc: "Inteligência artificial capaz de analisar e gerar resultados visuais.", url: "https://grok.com" },
      { name: "Flow", desc: "Nova ferramenta do Google para geração e edição de vídeos acelerada.", url: "https://labs.google/flow/about" }
    ]
  }
];

export default function AiTools() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold tracking-tight flex items-center gap-3">
          <Wrench className="w-8 h-8 text-[#7B2EFF]" />
          Ferramentas IA
        </h1>
        <p className="text-gray-400 mt-1">
          Nossa curadoria com as melhores ferramentas do mercado para agilizar seu processo produtivo dark.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {toolCategories.map((cat, index) => (
          <motion.div
            key={cat.category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Card className="bg-[#141414] border-[#2A2A2A] h-full flex flex-col">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <cat.icon className={`w-5 h-5 ${cat.color}`} />
                  {cat.category}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 flex-1">
                {cat.items.map((tool, i) => (
                  <div key={i} className="flex flex-col gap-2 p-3 rounded-lg bg-[#0A0A0A] border border-[#2A2A2A]">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-gray-200">{tool.name}</h3>
                      <a href={tool.url} target="_blank" rel="noopener noreferrer">
                        <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0 text-gray-500 hover:text-white">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </a>
                    </div>
                    <p className="text-xs text-gray-400">{tool.desc}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
