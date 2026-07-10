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
  Save,
  Check,
} from "lucide-react";
import { motion } from "motion/react";
import { updateMetric } from "@/src/lib/metrics";
import { getGeminiClient } from "@/src/lib/gemini";
import { db, auth } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function ProfileCreator() {
  const [niche, setNiche] = useState("");
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const generateProfile = async () => {
    if (!niche) return;
    setLoading(true);

    try {
      const ai = getGeminiClient();
      const prompt = `Crie uma estrutura completa de perfil "dark" (sem aparecer) para o TikTok e Instagram no nicho de: ${niche}.
      
      Retorne APENAS um JSON válido neste formato (todas as chaves são obrigatórias):
      {
        "name": "Nome do Perfil (criativo e chamativo)",
        "profilePicture": "Sugestão detalhada do que deve ser a foto de perfil/logo (ex: Logo minimalista em neon roxo com fundo escuro exibindo um ícone de...)",
        "visualIdentity": "Paleta de cores principal, fontes recomendadas e estilo visual geral",
        "bio": "Bio otimizada para conversão com CTA",
        "positioning": "Posicionamento de marca e tom de voz",
        "strategy": "Estratégia principal de crescimento e monetização (ex: vender infoproduto, parcerias, views)",
        "style": "Estilo de roteiro, edição e formato do conteúdo (ex: voz sintética calma, cortes rápidos, takes de fundo de natureza)",
        "ideas": ["Ideia de primeiro vídeo para viralizar", "Ideia de segundo vídeo para reter", "Ideia de terceiro vídeo para vender"]
      }`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const text = response.text || "{}";
      const cleanedText = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      const data = JSON.parse(cleanedText);
      setProfile(data);
      setSaved(false);
      updateMetric("darkfy_metric_profiles", 1);
    } catch (error: any) {
      console.error(error);
      alert(`Erro ao gerar perfil: ${error.message || "Verifique o console para mais detalhes."}`);
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    if (!profile) return;
    if (!auth.currentUser) {
      alert("Você precisa estar logado para salvar.");
      return;
    }

    setSaving(true);
    try {
      await addDoc(collection(db, "profiles"), {
        userId: auth.currentUser.uid,
        niche: niche,
        name: profile.name,
        profilePicture: profile.profilePicture,
        visualIdentity: profile.visualIdentity,
        bio: profile.bio,
        positioning: profile.positioning,
        strategy: profile.strategy,
        style: profile.style,
        ideas: profile.ideas || [],
        createdAt: serverTimestamp()
      });
      setSaved(true);
    } catch (error) {
      console.error("Erro ao salvar perfil:", error);
      alert("Erro ao salvar perfil.");
    } finally {
      setSaving(false);
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
          <div className="space-y-6">
            <Card className="bg-[#141414] border-[#2A2A2A]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#7B2EFF]">
                  <UserCircle className="w-5 h-5" />
                  Identidade Base
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
                <div>
                  <span className="text-sm text-gray-400 block mb-1">
                    Tom de Voz e Posicionamento
                  </span>
                  <p className="text-sm">{profile.positioning}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#141414] border-[#2A2A2A]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-pink-500">
                  <Sparkles className="w-5 h-5" />
                  Visual
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <span className="text-sm text-gray-400 block mb-1">
                    Foto de Perfil / Logo
                  </span>
                  <p className="text-sm bg-[#0A0A0A] p-3 rounded-md border border-[#2A2A2A]">{profile.profilePicture}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-400 block mb-1">
                    Identidade Visual (Cores)
                  </span>
                  <p className="text-sm">{profile.visualIdentity}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-[#141414] border-[#2A2A2A]">
              <CardHeader>
                <div className="flex items-center justify-between w-full">
                  <CardTitle className="flex items-center gap-2 text-orange-500">
                    <Crosshair className="w-5 h-5" />
                    Estratégia e Conteúdo
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <span className="text-sm text-gray-400 block mb-1">
                    Plano de Crescimento/Monetização
                  </span>
                  <p className="bg-[#0A0A0A] p-3 rounded-md border border-[#2A2A2A] text-sm text-yellow-500/90 font-medium">
                    {profile.strategy}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-400 block mb-1">
                    Formato e Estilo de Edição
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
          </div>
        </motion.div>
      )}

      {profile && (
        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 0.3 }}
           className="flex justify-end mt-4"
        >
          <Button
            variant="outline"
            className="gap-2 border-[#2A2A2A] hover:bg-[#2A2A2A]"
            onClick={saveProfile}
            disabled={saving || saved}
          >
            {saved ? (
              <>
                <Check className="w-4 h-4 text-green-500" /> Salvo nos seus perfis
              </>
            ) : saving ? (
              "Salvando..."
            ) : (
              <>
                <Save className="w-4 h-4" /> Salvar Perfil
              </>
            )}
          </Button>
        </motion.div>
      )}
    </div>
  );
}
