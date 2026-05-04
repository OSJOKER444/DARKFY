import { useState, useRef, useEffect } from "react";
import { Send, Bot, User as UserIcon, MessageSquarePlus, MessageSquare, Trash2, Menu, X } from "lucide-react";
import { getGeminiClient } from "../lib/gemini";
import ReactMarkdown from "react-markdown";
import { auth, db } from "../firebase";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { collection, doc, query, where, orderBy, onSnapshot, serverTimestamp, setDoc, deleteDoc } from "firebase/firestore";
import { cn } from "../lib/utils";
import { BackgroundGradientAnimation } from "../components/ui/background-gradient-animation";

export default function DarkfyAI() {
  const [messages, setMessages] = useState<{ role: "user" | "model", text: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatSession, setChatSession] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [chats, setChats] = useState<{id: string, title: string, createdAt: any}[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const [user, setUser] = useState<FirebaseUser | null>(auth.currentUser);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const userName = user?.displayName?.split(" ")[0] || "Usuário";

  const systemInstruction = `Você é o Darkfy AI, assistente de marketing digital especializado em infoprodutores e criadores de conteúdo, integrado à plataforma Darkfy.
Seu papel é ser um consultor completo: você não apenas responde — você explica o raciocínio por trás de cada estratégia, educa o usuário enquanto resolve o problema dele e o deixa mais capaz a cada conversa.

PERSONALIDADE E TOM

Consultivo e didático: explique o "por quê" de cada recomendação, não só o "o quê"
Acessível: use linguagem clara, sem jargões desnecessários — se usar um termo técnico, explique ele
Próximo e humano: trate o usuário pelo nome, mostre que entende a realidade de quem vende conhecimento online
Nunca use prefácios vazios como "ótima pergunta!" ou "com certeza!". Vá direto ao conteúdo
Quando o assunto for complexo, divida em partes e conduza o usuário passo a passo

O QUE VOCÊ FAZ
Você é especialista em tudo que envolve a jornada do infoprodutor:

- Estruturar e explicar funis de vendas (perpétuo, lançamento, semente, interno)
- Criar e ensinar copy persuasiva para páginas, anúncios, e-mails e VSL
- Montar estratégias de lançamento do zero (PLO, lançamento semente, co-produção)
- Criar esteiras de produto e explicar a lógica de cada oferta
- Planejar e organizar conteúdo para redes sociais com foco em autoridade e venda
- Explicar métricas, diagnosticar problemas de conversão e propor soluções
- Escrever sequências de e-mail, scripts de stories e roteiros de aula gratuita
- Orientar sobre posicionamento, nicho e avatar do cliente

COMO RESPONDER

Se o pedido for vago, faça uma única pergunta para entender o contexto antes de responder
Se o pedido for claro, entregue a resposta completa e estruturada, com explicações de cada parte
Use formatação clara: títulos em negrito, listas numeradas ou com bullets quando ajudar na leitura
Sempre que entregar uma estratégia ou estrutura, explique a lógica por trás dela — o usuário precisa entender, não só copiar
Ao final de toda resposta, sugira um próximo passo concreto que o usuário pode tomar
Se identificar um erro ou ponto de atenção no que o usuário compartilhou, aponte com clareza e gentileza antes de dar a solução
Nunca invente dados, cases ou números. Se não tiver certeza, diga isso

CONTEXTO DO USUÁRIO
Nome: ${userName}
Plano: Premium/Pro (Darkfy)
Ferramentas ativas na conta: Todas as 10+ ferramentas de criação de conteúdo, scripts e promtps do Darkfy.

Você está aqui para transformar o usuário em um infoprodutor mais capaz. Cada resposta deve deixá-lo não só com o problema resolvido, mas com mais clareza sobre o próprio negócio.
`;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load chat history list
  useEffect(() => {
    if (!user) return;
    
    const q = query(
      collection(db, "chats"),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      let chatsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as {id: string, title: string, createdAt: any, updatedAt: any}[];
      
      chatsData.sort((a, b) => {
        const timeA = a.updatedAt?.toMillis() || a.createdAt?.toMillis() || 0;
        const timeB = b.updatedAt?.toMillis() || b.createdAt?.toMillis() || 0;
        return timeB - timeA;
      });
      
      setChats(chatsData);
    });

    return () => unsubscribe();
  }, [user]);

  // Initialize or load chat
  useEffect(() => {
    if (!currentChatId) {
      setMessages([
        { role: "model", text: "Olá! Eu sou o Darkfy AI, seu consultor de marketing digital. Como posso ajudar com seu negócio digital hoje?" }
      ]);
      try {
        const ai = getGeminiClient();
        const chat = ai.chats.create({
          model: "gemini-2.5-flash",
          config: { systemInstruction }
        });
        setChatSession(chat);
      } catch (error) {
        console.error("Erro ao inicializar chat:", error);
      }
      return;
    }

    if (!user) return;

    const messagesQuery = query(
      collection(db, "chats", currentChatId, "messages"),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      let msgs = snapshot.docs.map(doc => doc.data() as {role: "user" | "model", text: string, createdAt: any});
      
      msgs.sort((a, b) => {
        const timeA = a.createdAt?.toMillis() || 0;
        const timeB = b.createdAt?.toMillis() || 0;
        return timeA - timeB;
      });
      
      if (msgs.length === 0) {
        setMessages([{ role: "model", text: "Olá! Eu sou o Darkfy AI, seu consultor de marketing digital. Como posso ajudar com seu negócio digital hoje?" }]);
      } else {
        setMessages(msgs);
      }
      
      try {
        const ai = getGeminiClient();
        const history = msgs.map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        }));
        const chat = ai.chats.create({
          model: "gemini-2.5-flash",
          config: { systemInstruction },
          history
        });
        setChatSession(chat);
      } catch (error) {
         console.error("Erro ao carregar chat:", error);
      }
    });

    return () => unsubscribe();
  }, [currentChatId, user]);

  const generateTitle = async (message: string) => {
    try {
      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: `Baseado nesta primeira mensagem do usuário, gere um título curto de até 4 palavras para a pesquisa/conversa (sem usar aspas, apenas o texto limpo): "${message}"`
      });
      return response.text?.trim().replace(/"/g, "") || "Nova Conversa";
    } catch (e) {
      return "Nova Conversa";
    }
  };

  const handleSend = async () => {
    if (!input.trim() || !chatSession || !user) return;
    
    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: userMessage }]);
    setLoading(true);

    let chatId = currentChatId;
    
    // If it's a new conversation, create the chat document first
    if (!chatId) {
      chatId = doc(collection(db, "chats")).id;
      setCurrentChatId(chatId);
      
      const title = await generateTitle(userMessage);
      
      await setDoc(doc(db, "chats", chatId), {
        userId: user.uid,
        title: title,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } else {
      await setDoc(doc(db, "chats", chatId), {
        updatedAt: serverTimestamp()
      }, { merge: true });
    }

    // Save user message
    const userMessageRef = doc(collection(db, "chats", chatId, "messages"));
    await setDoc(userMessageRef, {
      userId: user.uid,
      role: "user",
      text: userMessage,
      createdAt: serverTimestamp()
    });

    try {
      const response = await chatSession.sendMessage({ message: userMessage });
      const modelText = response.text || "";
      
      // Save model message
      const modelMessageRef = doc(collection(db, "chats", chatId, "messages"));
      await setDoc(modelMessageRef, {
        userId: user.uid,
        role: "model",
        text: modelText,
        createdAt: serverTimestamp()
      });
      
    } catch (error: any) {
      console.error(error);
      const errorMsg = `Erro: ${error.message || "Ocorreu um erro ao gerar a resposta."}`;
      setMessages(prev => [...prev, { role: "model", text: errorMsg }]);
      
      const modelMessageRef = doc(collection(db, "chats", chatId, "messages"));
      await setDoc(modelMessageRef, {
        userId: user.uid,
        role: "model",
        text: errorMsg,
        createdAt: serverTimestamp()
      });
      
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const deleteChat = async (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    if (!window.confirm("Deseja realmente excluir esta conversa?")) return;
    
    try {
       await deleteDoc(doc(db, "chats", chatId));
       if (currentChatId === chatId) {
         setCurrentChatId(null);
       }
    } catch(err) {
       console.error("Erro ao excluir", err);
    }
  };

  return (
    <div className="flex h-[calc(100vh-6rem)] w-full gap-4 relative">
      {/* Mobile sidebar toggle */}
      <button 
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden absolute top-4 left-4 z-50 p-2 bg-[#1A1A1A] text-white rounded-lg border border-[#2A2A2A] shadow-lg"
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <div 
        className={cn(
          "absolute md:relative z-40 md:z-0 h-full w-64 bg-[#0A0A0A]/95 backdrop-blur-xl border border-[#2A2A2A] rounded-2xl flex flex-col pt-16 md:pt-4 transition-transform duration-300 shadow-2xl md:shadow-none",
          sidebarOpen ? "translate-x-0" : "-translate-x-[120%] md:translate-x-0"
        )}
      >
        <div className="p-4">
          <button 
            onClick={() => {
              setCurrentChatId(null);
              setSidebarOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 bg-[#7B2EFF] hover:bg-[#6821E3] text-white rounded-xl transition-all shadow-[0_0_15px_rgba(123,46,255,0.3)] hover:shadow-[0_0_20px_rgba(123,46,255,0.5)] font-medium"
          >
            <MessageSquarePlus className="w-5 h-5" />
            Nova conversa
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 space-y-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2 mt-2">Salvos</h3>
          {chats.map(chat => (
            <div 
              key={chat.id}
              onClick={() => {
                setCurrentChatId(chat.id);
                setSidebarOpen(false);
              }}
              className={cn(
                "w-full flex items-center justify-between px-3 py-3 rounded-lg text-sm text-left transition-all cursor-pointer group",
                currentChatId === chat.id 
                  ? "bg-[#2A2A2A] text-white" 
                  : "text-gray-400 hover:bg-[#1A1A1A] hover:text-white"
              )}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <MessageSquare className="w-4 h-4 shrink-0" />
                <span className="truncate">{chat.title || "Nova Conversa"}</span>
              </div>
              <button 
                onClick={(e) => deleteChat(e, chat.id)}
                className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 text-gray-500 transition-all shrink-0"
                title="Excluir"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          {chats.length === 0 && (
            <p className="text-sm text-gray-500 px-2 text-center mt-4">Nenhuma conversa salva.</p>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <BackgroundGradientAnimation
        gradientBackgroundStart="rgb(10, 10, 10)"
        gradientBackgroundEnd="rgb(20, 5, 40)"
        firstColor="123, 46, 255"
        secondColor="76, 29, 149"
        thirdColor="168, 85, 247"
        fourthColor="50, 10, 100"
        fifthColor="20, 5, 50"
        pointerColor="123, 46, 255"
        className="absolute inset-0 z-10 flex flex-col items-center justify-center p-4 md:p-8 pt-16 md:pt-8"
        containerClassName="flex-1 h-full w-full rounded-2xl relative overflow-hidden"
      >
        <div className="w-full max-w-4xl h-full flex flex-col space-y-4 relative z-20">
          <div className="text-center md:text-left">
            <h1 className="text-2xl md:text-4xl font-display font-bold tracking-tight text-white drop-shadow-lg">
              Darkfy AI
            </h1>
            <p className="text-sm md:text-base text-gray-300 mt-1 font-medium drop-shadow">
              Seu consultor especialista em marketing digital, lançamentos e infoprodutos.
            </p>
          </div>

          <div className="flex-1 overflow-hidden relative rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-white/20">
              {messages.map((msg, i) => (
                <div key={i} className={cn("flex gap-4 max-w-[90%] md:max-w-[85%]", msg.role === "user" ? "ml-auto" : "")}>
                  {msg.role === "model" && (
                    <div className="w-8 h-8 shrink-0 rounded-full bg-[#7B2EFF]/30 border border-[#7B2EFF]/50 flex items-center justify-center shadow-[0_0_15px_rgba(123,46,255,0.4)]">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                  )}
                  
                  <div 
                    className={cn(
                      "px-4 py-3 md:px-5 md:py-4 rounded-2xl text-sm md:text-[15px] leading-relaxed shadow-lg backdrop-blur-md",
                      msg.role === "user" 
                        ? "bg-gradient-to-br from-[#7B2EFF] to-[#4C1D95] text-white rounded-tr-sm border border-[#7B2EFF]/30" 
                        : "bg-black/40 text-gray-100 border border-white/10 rounded-tl-sm markdown-body font-normal"
                    )}
                  >
                    {msg.role === "model" ? (
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                    ) : (
                      msg.text
                    )}
                  </div>

                  {msg.role === "user" && (
                    <div className="w-8 h-8 shrink-0 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shadow-md">
                      <UserIcon className="w-5 h-5 text-white/80" />
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex gap-4 max-w-[85%]">
                  <div className="w-8 h-8 shrink-0 rounded-full bg-[#7B2EFF]/30 border border-[#7B2EFF]/50 flex items-center justify-center shadow-[0_0_15px_rgba(123,46,255,0.4)]">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="px-5 py-4 rounded-2xl bg-black/40 border border-white/10 rounded-tl-sm flex items-center gap-2 shadow-lg backdrop-blur-md">
                    <div className="w-2 h-2 bg-[#7B2EFF] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-[#7B2EFF] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-[#7B2EFF] rounded-full animate-bounce"></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/10 bg-black/40 backdrop-blur-md">
              <div className="relative flex items-end gap-3 group">
                <textarea
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-4 pr-14 py-3 md:py-4 text-white placeholder-gray-400 focus:outline-none focus:border-[#7B2EFF]/50 focus:bg-white/10 hover:border-white/20 transition-all shadow-inner min-h-[50px] md:min-h-[60px] max-h-[150px] resize-none overflow-y-auto text-sm md:text-base"
                  placeholder="Pergunte à IA..."
                  rows={1}
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    e.target.style.height = 'auto';
                    e.target.style.height = e.target.scrollHeight + 'px';
                  }}
                  onKeyDown={handleKeyDown}
                />
                <button
                  className="absolute right-2 bottom-1.5 md:bottom-2 p-2.5 md:p-3 bg-gradient-to-r from-[#7B2EFF] to-[#A855F7] hover:from-[#6821E3] hover:to-[#9333EA] text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(123,46,255,0.4)] hover:shadow-[0_0_25px_rgba(123,46,255,0.6)]"
                  onClick={handleSend}
                  disabled={!input.trim() || loading || !chatSession}
                >
                  <Send className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </div>
              <p className="text-[10px] md:text-xs text-gray-400/80 text-center mt-2 font-medium">
                Darkfy AI pode cometer erros.
              </p>
            </div>
          </div>
        </div>
      </BackgroundGradientAnimation>
    </div>
  );
}
