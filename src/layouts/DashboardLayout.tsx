import { Outlet, Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Workflow,
  TrendingUp,
  UserCircle,
  Video,
  FileText,
  Calendar,
  DollarSign,
  Settings,
  Image as ImageIcon,
  LogOut,
} from "lucide-react";
import { cn } from "@/src/lib/utils";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Workflow, label: "Planejador Estratégico", path: "/planner" },
  { icon: TrendingUp, label: "Nichos Virais", path: "/niches" },
  { icon: UserCircle, label: "Criador de Perfil Dark", path: "/profile" },
  { icon: Video, label: "Máquina de Conteúdo", path: "/content" },
  { icon: FileText, label: "Gerador de Roteiros", path: "/scripts" },
  { icon: ImageIcon, label: "Gerador de Imagens", path: "/images" },
  { icon: Calendar, label: "Calendário de Conteúdo", path: "/calendar" },
  { icon: DollarSign, label: "Simulador de Monetização", path: "/simulator" },
  { icon: Settings, label: "Configurações", path: "/settings" },
];

export default function DashboardLayout() {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-[#0A0A0A] text-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-[#2A2A2A] bg-[#0A0A0A] flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-[#2A2A2A]">
          <div className="flex items-center gap-2 text-[#7B2EFF]">
            <div className="w-8 h-8 rounded bg-[#141414] border border-[#2A2A2A] flex items-center justify-center">
              <span className="font-display font-bold text-lg">D</span>
            </div>
            <span className="font-display font-bold text-xl tracking-wider">
              DARKFY
            </span>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                  isActive
                    ? "bg-[#141414] text-[#7B2EFF] border border-[#2A2A2A]"
                    : "text-gray-400 hover:text-white hover:bg-[#141414] border border-transparent",
                )}
              >
                <Icon
                  className={cn(
                    "w-5 h-5 transition-colors",
                    isActive
                      ? "text-[#7B2EFF]"
                      : "text-gray-500 group-hover:text-gray-300",
                  )}
                />
                <span className="font-medium text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#2A2A2A]">
          <div className="flex items-center justify-between px-3 py-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#141414] border border-[#2A2A2A] flex items-center justify-center overflow-hidden">
                <UserCircle className="w-5 h-5 text-gray-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">Hacker User</span>
                <span className="text-xs text-gray-500">Pro Plan</span>
              </div>
            </div>
            <button 
              onClick={() => {
                localStorage.removeItem("darkfy_auth");
                window.location.href = "/login";
              }}
              className="text-gray-500 hover:text-red-500 transition-colors"
              title="Sair"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-[#0A0A0A]">
        <div className="p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
