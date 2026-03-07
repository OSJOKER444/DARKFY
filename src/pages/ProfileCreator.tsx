import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import {
  Sparkles,
  UserCircle,
  AlignLeft,
  Crosshair,
  Video,
} from "lucide-react";
import { GoogleGenAI } from "@google/genai";
import { motion } from "motion/react";
import { updateMetric } from "@/src/lib/metrics";

export default function ProfileCreator() {
  const [niche, setNiche] = useState("");
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);

  const generateProfile = async () => {
    if (!niche) return;
    setLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `Crie uma estrutura de perfil "dark" (sem aparecer) para o TikTok no nicho de: ${niche}.
      
      Retorne APENAS um JSON válido neste formato:
      {
        "name": "Nome do Perfil",
        "bio": "Bio otimizada com CTA",
        "positioning": "Posicionamento da marca",
        "style": "Estilo visual e de conteúdo",
        "ideas": ["Ideia 1", "Ideia 2", "Ideia 3"]
      }`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const data = JSON.parse(response.text || "{}");
      setProfile(data);
      updateMetric("darkfy_metric_profiles", 1);
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
          Criador de Perfil Dark
        </h1>
        <p className="text-gray-400 mt-1">
          Gere a identidade completa do seu novo perfil.
        </p>
      </div>

      <Card className="bg-[#141414] border-[#2A2A2A]">
        <CardContent className="pt-6 flex gap-4">
          <Input
            placeholder="Digite o nicho (Ex: Produtividade)"
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
            className="flex-1"
          />
          <Button
            variant="neon"
            onClick={generateProfile}
            disabled={loading}
            className="gap-2"
          >
            <Sparkles className="w-4 h-4" />
            {loading ? "GERANDO..." : "CRIAR PERFIL"}
          </Button>
        </CardContent>
      </Card>

      {profile && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid gap-6 md:grid-cols-2"
        >
          <Card className="bg-[#141414] border-[#2A2A2A]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#7B2EFF]">
                <UserCircle className="w-5 h-5" />
                Identidade
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <span className="text-sm text-gray-400 block mb-1">
                  Nome do Perfil
                </span>
                <p className="font-medium text-lg">{profile.name}</p>
              </div>
              <div>
                <span className="text-sm text-gray-400 block mb-1 flex items-center gap-1">
                  <AlignLeft className="w-4 h-4" /> Bio Otimizada
                </span>
                <p className="bg-[#0A0A0A] p-3 rounded-md border border-[#2A2A2A] text-sm whitespace-pre-wrap">
                  {profile.bio}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#141414] border-[#2A2A2A]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#7B2EFF]">
                <Crosshair className="w-5 h-5" />
                Estratégia
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <span className="text-sm text-gray-400 block mb-1">
                  Posicionamento
                </span>
                <p className="text-sm">{profile.positioning}</p>
              </div>
              <div>
                <span className="text-sm text-gray-400 block mb-1">
                  Estilo de Conteúdo
                </span>
                <p className="text-sm">{profile.style}</p>
              </div>
              <div>
                <span className="text-sm text-gray-400 block mb-2 flex items-center gap-1">
                  <Video className="w-4 h-4" /> Primeiros Vídeos
                </span>
                <ul className="space-y-2">
                  {profile.ideas.map((idea: string, i: number) => (
                    <li
                      key={i}
                      className="text-sm bg-[#0A0A0A] p-2 rounded border border-[#2A2A2A]"
                    >
                      {idea}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
