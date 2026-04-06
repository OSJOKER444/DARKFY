import { useState, useEffect } from "react";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { FileText, Copy, Check, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { db, auth } from "../firebase";
import { collection, query, where, onSnapshot, deleteDoc, doc, orderBy } from "firebase/firestore";

export default function MyScripts() {
  const [savedScripts, setSavedScripts] = useState<any[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "scripts"),
      where("userId", "==", auth.currentUser.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const scriptsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSavedScripts(scriptsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching scripts:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const copyToClipboard = (script: any, index: number) => {
    const text = `HOOK\n${script.hook}\n\nDESENVOLVIMENTO\n${script.development}\n\nCTA\n${script.cta}`;
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const deleteScript = async (id: string) => {
    try {
      await deleteDoc(doc(db, "scripts", id));
    } catch (error) {
      console.error("Error deleting script:", error);
      alert("Erro ao excluir roteiro.");
    }
  };

  if (loading) {
    return <div className="text-gray-400">Carregando roteiros...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold tracking-tight">
          Meus Roteiros
        </h1>
        <p className="text-gray-400 mt-1">
          Gerencie seus roteiros salvos.
        </p>
      </div>

      {savedScripts.length === 0 ? (
        <Card className="bg-[#141414] border-[#2A2A2A]">
          <CardContent className="pt-6 text-center text-gray-400">
            Você ainda não salvou nenhum roteiro.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {savedScripts.map((script, i) => (
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
                    onClick={() => copyToClipboard(script, i)}
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
                    onClick={() => deleteScript(script.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2 text-[#7B2EFF]">
                    <FileText className="w-5 h-5" />
                    {script.niche ? `${script.niche} - ${script.theme}` : `Roteiro Salvo ${i + 1}`}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 flex-1">
                  <div>
                    <span className="text-xs font-bold text-yellow-500 uppercase tracking-wider mb-1 block">
                      Hook
                    </span>
                    <p className="text-sm bg-[#0A0A0A] p-2 rounded border border-[#2A2A2A] font-medium">
                      "{script.hook}"
                    </p>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-blue-500 uppercase tracking-wider mb-1 block">
                      Desenvolvimento
                    </span>
                    <p className="text-sm bg-[#0A0A0A] p-2 rounded border border-[#2A2A2A] text-gray-300">
                      {script.development}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-green-500 uppercase tracking-wider mb-1 block">
                      CTA
                    </span>
                    <p className="text-sm bg-[#0A0A0A] p-2 rounded border border-[#2A2A2A] font-medium">
                      "{script.cta}"
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
