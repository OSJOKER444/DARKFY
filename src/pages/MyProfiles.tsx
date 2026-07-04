import { useState, useEffect } from "react";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { UserCircle, Copy, Check, Trash2, AlignLeft, Sparkles, Crosshair, Video } from "lucide-react";
import { motion } from "motion/react";
import { db, auth } from "../firebase";
import { collection, query, where, onSnapshot, deleteDoc, doc, orderBy } from "firebase/firestore";

export default function MyProfiles() {
  const [savedProfiles, setSavedProfiles] = useState<any[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "profiles"),
      where("userId", "==", auth.currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const profilesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      // Sort on the client side to avoid missing index error
      profilesData.sort((a: any, b: any) => {
        const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
        const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
        return timeB - timeA;
      });
      setSavedProfiles(profilesData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching profiles:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const copyToClipboard = (profile: any, index: number) => {
    let ideasText = "";
    if (profile.ideas && profile.ideas.length > 0) {
      ideasText = "\n\nIDEIAS DE VÍDEO:\n" + profile.ideas.map((i: string) => `- ${i}`).join("\n");
    }

    const text = `NOME: ${profile.name}\nNICHO: ${profile.niche}\n\nBIO:\n${profile.bio}\n\nFOTO DE PERFIL:\n${profile.profilePicture}\n\nIDENTIDADE VISUAL:\n${profile.visualIdentity}\n\nPOSICIONAMENTO:\n${profile.positioning}\n\nESTRATÉGIA:\n${profile.strategy}\n\nESTILO:\n${profile.style}${ideasText}`;
    
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const deleteProfile = async (id: string) => {
    if(!window.confirm("Deseja realmente excluir este perfil?")) return;
    try {
      await deleteDoc(doc(db, "profiles", id));
    } catch (error) {
      console.error("Error deleting profile:", error);
      alert("Erro ao excluir perfil.");
    }
  };

  if (loading) {
    return <div className="text-gray-400">Carregando perfis...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold tracking-tight">
          Perfis Salvos
        </h1>
        <p className="text-gray-400 mt-1">
          Gerencie suas identidades Dark criadas.
        </p>
      </div>

      {savedProfiles.length === 0 ? (
        <Card className="bg-[#141414] border-[#2A2A2A]">
          <CardContent className="pt-6 text-center text-gray-400">
            Você ainda não salvou nenhum perfil.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {savedProfiles.map((profile, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="bg-[#141414] border-[#2A2A2A] h-full flex flex-col relative group">
                <div className="absolute top-2 right-2 flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => copyToClipboard(profile, i)}
                  >
                    {copiedIndex === i ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-400"
                    onClick={() => deleteProfile(profile.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <CardHeader className="pb-2 border-b border-[#2A2A2A]">
                  <CardTitle className="text-lg flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-[#7B2EFF]">
                      <UserCircle className="w-5 h-5" />
                      {profile.name || "Perfil sem nome"}
                    </div>
                    {profile.niche && (
                      <span className="text-xs text-gray-400 font-normal">Nicho: {profile.niche}</span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pt-4 flex-1">
                  
                  {/* Bio */}
                  <div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                      <AlignLeft className="w-3 h-3" /> Bio
                    </span>
                    <p className="text-sm bg-[#0A0A0A] p-3 rounded border border-[#2A2A2A] text-gray-300">
                      {profile.bio}
                    </p>
                  </div>

                  {/* Visual */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <span className="text-xs font-bold text-pink-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Imagem
                      </span>
                      <p className="text-xs bg-[#0A0A0A] p-2 rounded border border-[#2A2A2A] text-gray-400 line-clamp-3">
                        {profile.profilePicture}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-pink-500 uppercase tracking-wider mb-1 block">
                        Cores & Estilo
                      </span>
                      <p className="text-xs bg-[#0A0A0A] p-2 rounded border border-[#2A2A2A] text-gray-400 line-clamp-3">
                        {profile.visualIdentity}
                      </p>
                    </div>
                  </div>

                  {/* Estratégia */}
                  <div>
                    <span className="text-xs font-bold text-yellow-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                      <Crosshair className="w-3 h-3" /> Estratégia Base
                    </span>
                    <p className="text-xs bg-[#0A0A0A] p-2 rounded border border-[#2A2A2A] text-gray-300">
                      {profile.strategy}
                    </p>
                  </div>

                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
