import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { BookOpen } from "lucide-react";
import { motion } from "motion/react";

export default function HowItWorks() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold tracking-tight">
          Como Funciona
        </h1>
        <p className="text-gray-400 mt-1">
          Aprenda a dominar a ferramenta e descubra estratégias para monetizar seus canais dark.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="bg-[#141414] border-[#2A2A2A] overflow-hidden">
          <CardHeader className="pb-4 border-b border-[#2A2A2A] bg-[#0A0A0A]">
            <CardTitle className="text-xl flex items-center gap-2 text-[#7B2EFF]">
              <BookOpen className="w-6 h-6" />
              Aula Completa: Como usar a ferramenta e vender
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="aspect-video w-full">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/CuskouyTp2A"
                title="Aula Darkfy"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
            <div className="p-6 bg-[#141414]">
              <h3 className="text-lg font-medium text-white mb-2">Sobre esta aula</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Neste vídeo, você vai aprender o passo a passo completo de como utilizar todas as funcionalidades da plataforma para criar conteúdos virais. Além disso, revelamos as melhores estratégias para você vender e monetizar seus canais dark de forma eficiente e escalável.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
