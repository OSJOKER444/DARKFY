import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { DollarSign, Eye, MousePointerClick, ShoppingCart } from "lucide-react";
import { motion } from "motion/react";
import { setMetric } from "@/src/lib/metrics";

export default function Simulator() {
  const [views, setViews] = useState(10000);
  const [ctr, setCtr] = useState(1.5);
  const [price, setPrice] = useState(47.9);
  const [conversionRate, setConversionRate] = useState(1.0);

  const [results, setResults] = useState({
    clicks: 0,
    sales: 0,
    revenue: 0,
  });

  useEffect(() => {
    const clicks = Math.floor(views * (ctr / 100));
    const sales = Math.floor(clicks * (conversionRate / 100));
    const revenue = sales * price;

    setResults({ clicks, sales, revenue });
    setMetric("darkfy_metric_revenue", revenue);
  }, [views, ctr, price, conversionRate]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold tracking-tight">
          Simulador de Monetização
        </h1>
        <p className="text-gray-400 mt-1">
          Calcule seus ganhos estimados com base nas métricas do TikTok.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card className="bg-[#141414] border-[#2A2A2A]">
          <CardHeader>
            <CardTitle>Métricas do Funil</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm text-gray-400 flex items-center gap-2">
                  <Eye className="w-4 h-4" /> Visualizações Médias por Vídeo
                </label>
                <span className="text-sm font-medium">
                  {views.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="1000"
                max="1000000"
                step="1000"
                value={views}
                onChange={(e) => setViews(Number(e.target.value))}
                className="w-full accent-[#7B2EFF]"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm text-gray-400 flex items-center gap-2">
                  <MousePointerClick className="w-4 h-4" /> Taxa de Clique (CTR)
                  no Link da Bio
                </label>
                <span className="text-sm font-medium">{ctr}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="10"
                step="0.1"
                value={ctr}
                onChange={(e) => setCtr(Number(e.target.value))}
                className="w-full accent-[#7B2EFF]"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm text-gray-400 flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4" /> Taxa de Conversão da
                  Página
                </label>
                <span className="text-sm font-medium">{conversionRate}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="10"
                step="0.1"
                value={conversionRate}
                onChange={(e) => setConversionRate(Number(e.target.value))}
                className="w-full accent-[#7B2EFF]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-400">
                Preço do Produto (Ticket Médio)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500">
                  R$
                </span>
                <Input
                  type="number"
                  className="pl-8"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card className="bg-[#141414] border-[#2A2A2A]">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <MousePointerClick className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Cliques no Link</p>
                  <p className="text-2xl font-bold">
                    {results.clicks.toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-[#141414] border-[#2A2A2A]">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Vendas Estimadas</p>
                  <p className="text-2xl font-bold">
                    {results.sales.toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-[#141414] border-[#7B2EFF] glow-neon relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#7B2EFF] rounded-full mix-blend-screen filter blur-[64px] opacity-30" />
              <CardContent className="p-6 flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 rounded-full bg-[#7B2EFF]/20 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-[#7B2EFF]" />
                </div>
                <div>
                  <p className="text-sm text-gray-300">
                    Faturamento Estimado (por vídeo)
                  </p>
                  <p className="text-4xl font-display font-bold text-white">
                    R${" "}
                    {results.revenue.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
