import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Calendar as CalendarIcon, Sparkles, Plus } from "lucide-react";
import { format, addDays, startOfWeek } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function Calendar() {
  const [posts, setPosts] = useState<Record<string, string[]>>({
    "2026-03-06": ["Vídeo: 3 Segredos do TikTok", "Vídeo: Nichos Virais"],
    "2026-03-07": ["Vídeo: Como monetizar rápido"],
  });

  const generateCalendar = () => {
    // Mock generation
    const newPosts: Record<string, string[]> = {};
    const start = new Date();
    for (let i = 0; i < 30; i++) {
      const date = format(addDays(start, i), "yyyy-MM-dd");
      newPosts[date] = [`Vídeo Dark #${i + 1}`];
    }
    setPosts(newPosts);
  };

  const today = new Date();
  const startDate = startOfWeek(today, { weekStartsOn: 0 });

  const days = Array.from({ length: 14 }).map((_, i) => {
    const date = addDays(startDate, i);
    return {
      date,
      dateStr: format(date, "yyyy-MM-dd"),
      dayName: format(date, "EEEE", { locale: ptBR }),
      dayNumber: format(date, "d"),
    };
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight">
            Calendário de Conteúdo
          </h1>
          <p className="text-gray-400 mt-1">Organize suas postagens mensais.</p>
        </div>
        <Button variant="neon" onClick={generateCalendar} className="gap-2">
          <Sparkles className="w-4 h-4" />
          GERAR CALENDÁRIO AUTOMÁTICO
        </Button>
      </div>

      <Card className="bg-[#141414] border-[#2A2A2A]">
        <CardContent className="p-0">
          <div className="grid grid-cols-7 border-b border-[#2A2A2A]">
            {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day) => (
              <div
                key={day}
                className="p-4 text-center text-sm font-medium text-gray-400 border-r border-[#2A2A2A] last:border-0"
              >
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {days.map((day, i) => {
              const dayPosts = posts[day.dateStr] || [];
              const isToday = day.dateStr === format(today, "yyyy-MM-dd");

              return (
                <div
                  key={day.dateStr}
                  className={`min-h-[120px] p-2 border-r border-b border-[#2A2A2A] ${isToday ? "bg-[#7B2EFF]/10" : ""}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-sm font-medium w-6 h-6 flex items-center justify-center rounded-full ${isToday ? "bg-[#7B2EFF] text-white" : "text-gray-400"}`}
                    >
                      {day.dayNumber}
                    </span>
                    <button className="text-gray-500 hover:text-white transition-colors">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-1">
                    {dayPosts.map((post, j) => (
                      <div
                        key={j}
                        className="text-xs bg-[#0A0A0A] border border-[#2A2A2A] p-1.5 rounded truncate text-gray-300 cursor-pointer hover:border-[#7B2EFF]"
                      >
                        {post}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
