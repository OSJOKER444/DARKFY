import { useState } from "react";
import { Bot, Loader2, Sparkles, Book, DollarSign, Target, Copy, Check } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card";
import { getGeminiClient } from "../lib/gemini";
import Markdown from "react-markdown";

export default function ProductCreator() {
  const [niche, setNiche] = useState("");
  const [price, setPrice] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!niche || !price) return;
    
    setIsGenerating(true);
    setResult("");

    try {
      const ai = getGeminiClient();
      const prompt = `Você é um especialista em criação de produtos digitais (PLR, E-books) e copywriting.

Preciso que você crie a estrutura de um produto digital (E-book) e um prompt para a criação de uma página de vendas profissional, com base nas seguintes informações:
- Nicho e Sub-nicho: ${niche}
- Preço do Produto: ${price}

A sua resposta DEVE seguir estritamente o formato abaixo, formatado em Markdown:

## 📖 Estrutura do E-book
[Apresente um título cativante para o e-book]
[Apresente uma introdução sobre o que o e-book vai resolver]
[Liste os capítulos do e-book, sendo bem específico e persuasivo]

## 💰 Proposta de Valor
[Explique por que este produto vale ${price} e qual a transformação principal]

## 🛒 Prompt para Página de Vendas
[Escreva um prompt super detalhado que o usuário possa copiar e colar em outra IA ou ferramenta para gerar a copy da página de vendas. O prompt deve instruir a criação de uma headline matadora, VSL/vídeo de vendas (se aplicável), dores do público, benefícios, o que você vai levar, bônus e FAQ.]`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          temperature: 0.7,
        }
      });

      setResult(response.text);
    } catch (error) {
      console.error("Error generating product:", error);
      setResult("Houve um erro ao gerar o produto. Tente novamente mais tarde.");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-[#141414] rounded-xl border border-[#2A2A2A] glow-neon">
          <Book className="w-6 h-6 text-[#7B2EFF]" />
        </div>
        <div>
          <h1 className="text-3xl font-display font-bold tracking-wider text-white">
            Criador de Produtos
          </h1>
          <p className="text-gray-400 mt-1">Crie e-books com IA e prompts para páginas de vendas</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 border-[#2A2A2A] bg-[#0A0A0A]">
          <CardHeader>
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#7B2EFF]" />
              Detalhes do Produto
            </CardTitle>
            <CardDescription className="text-gray-400">
              Preencha os dados abaixo para a IA criar seu produto.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="niche" className="text-gray-300">Nicho e Sub-nicho</Label>
              <div className="relative">
                <Target className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                  id="niche"
                  placeholder="Ex: Emagrecimento, Dieta Low Carb"
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                  className="pl-9 bg-[#141414] border-[#2A2A2A] text-white focus:border-[#7B2EFF] transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price" className="text-gray-300">Preço do Produto</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                  id="price"
                  placeholder="Ex: R$ 47,00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="pl-9 bg-[#141414] border-[#2A2A2A] text-white focus:border-[#7B2EFF] transition-colors"
                />
              </div>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !niche || !price}
              className="w-full bg-[#7B2EFF] hover:bg-[#6A26E0] text-white font-medium"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Criando Produto...
                </>
              ) : (
                <>
                  <Bot className="w-4 h-4 mr-2" />
                  Criar Produto com IA
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card className="col-span-1 lg:col-span-2 border-[#2A2A2A] bg-[#0A0A0A] flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg text-white">Resultado</CardTitle>
            {result && (
              <Button
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
                className="border-[#2A2A2A] hover:bg-[#141414] text-gray-300 h-8"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
                <span className="ml-2">{copied ? "Copiado!" : "Copiar"}</span>
              </Button>
            )}
          </CardHeader>
          <CardContent className="flex-1 min-h-[400px] overflow-hidden">
            {result ? (
              <div className="prose prose-invert max-w-none markdown-body text-gray-300 w-full overflow-x-auto [&>pre]:whitespace-pre-wrap [&>pre]:break-words">
                <Markdown>{result}</Markdown>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4 py-12">
                <div className="w-16 h-16 rounded-full bg-[#141414] border border-[#2A2A2A] flex items-center justify-center">
                  <Bot className="w-8 h-8 opacity-50" />
                </div>
                <p className="text-sm">O produto e o prompt da página de vendas aparecerão aqui.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
