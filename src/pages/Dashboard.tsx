import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Lightbulb, Users, Target, DollarSign, Activity } from "lucide-react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { motion } from "motion/react";
import { getMetric } from "@/src/lib/metrics";

const data = [
  { name: "Seg", views: 0 },
  { name: "Ter", views: 0 },
  { name: "Qua", views: 0 },
  { name: "Qui", views: 0 },
  { name: "Sex", views: 0 },
  { name: "Sáb", views: 0 },
  { name: "Dom", views: 0 },
];

export default function Dashboard() {
  const [metrics, setMetrics] = useState({
    ideas: 0,
    profiles: 0,
    niches: 0,
    revenue: 0,
  });

  useEffect(() => {
    setMetrics({
      ideas: getMetric("darkfy_metric_ideas"),
      profiles: getMetric("darkfy_metric_profiles"),
      niches: getMetric("darkfy_metric_niches"),
      revenue: getMetric("darkfy_metric_revenue"),
    });
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold tracking-tight">
          Dashboard
        </h1>
        <p className="text-gray-400 mt-1">Visão geral da sua operação dark.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: "Ideias Geradas",
            value: metrics.ideas.toString(),
            icon: Lightbulb,
            color: "text-yellow-500",
          },
          {
            title: "Perfis Planejados",
            value: metrics.profiles.toString(),
            icon: Users,
            color: "text-blue-500",
          },
          {
            title: "Nichos Analisados",
            value: metrics.niches.toString(),
            icon: Target,
            color: "text-green-500",
          },
          {
            title: "Ganhos Estimados",
            value: `R$ ${metrics.revenue.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`,
            icon: DollarSign,
            color: "text-[#7B2EFF]",
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="bg-[#141414] border-[#2A2A2A]">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="bg-[#141414] border-[#2A2A2A]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-[#7B2EFF]" />
            Atividade de Visualizações
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7B2EFF" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#7B2EFF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="name"
                  stroke="#525252"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#525252"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#141414",
                    borderColor: "#2A2A2A",
                    borderRadius: "8px",
                  }}
                  itemStyle={{ color: "#fff" }}
                />
                <Area
                  type="monotone"
                  dataKey="views"
                  stroke="#7B2EFF"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorViews)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
