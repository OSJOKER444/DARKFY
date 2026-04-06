import { useState, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, logout } from "../firebase";
import {
  LayoutDashboard,
  Workflow,
  TrendingUp,
  UserCircle,
  Video,
  FileText,
  Calendar,
  Settings,
  LogOut,
  Menu,
  X,
  BookOpen,
  Crown,
  Wand2,
  Scan,
} from "lucide-react";
import { cn } from "@/src/lib/utils";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Workflow, label: "Planejador Estratégico", path: "/planner" },
  { icon: TrendingUp, label: "Nichos Virais", path: "/niches" },
  { icon: UserCircle, label: "Criador de Perfil Dark", path: "/profile" },
  { icon: Video, label: "Máquina de Conteúdo", path: "/content" },
  { icon: FileText, label: "Gerador de Roteiros", path: "/scripts" },
  { icon: FileText, label: "Meus Roteiros", path: "/my-scripts" },
  { icon: Wand2, label: "Prompter Profissional", path: "/prompter" },
  { icon: Scan, label: "Modelagem Dark", path: "/modeling" },
  { icon: Calendar, label: "Calendário de Conteúdo", path: "/calendar" },
  { icon: BookOpen, label: "Como Funciona", path: "/how-it-works" },
  { icon: Settings, label: "Configurações", path: "/settings" },
];

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-[#0A0A0A] text-white overflow-hidden">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-[#2A2A2A] bg-[#0A0A0A] absolute top-0 left-0 right-0 z-20">
        <div className="flex items-center gap-2 text-[#7B2EFF]">
          <div className="w-8 h-8 rounded bg-[#141414] border border-[#2A2A2A] flex items-center justify-center">
            <Crown className="w-5 h-5 text-[#7B2EFF]" />
          </div>
          <span className="font-display font-bold text-xl tracking-wider">
            DARKFY
          </span>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-gray-400 hover:text-white">
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed md:static inset-y-0 left-0 z-40 w-64 border-r border-[#2A2A2A] bg-[#0A0A0A] flex flex-col transform transition-transform duration-300 ease-in-out",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-[#2A2A2A]">
          <div className="flex items-center gap-2 text-[#7B2EFF]">
            <div className="w-8 h-8 rounded bg-[#141414] border border-[#2A2A2A] flex items-center justify-center">
              <Crown className="w-5 h-5 text-[#7B2EFF]" />
            </div>
            <span className="font-display font-bold text-xl tracking-wider">
              DARKFY
            </span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
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
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-[#141414] border border-[#2A2A2A] flex items-center justify-center overflow-hidden shrink-0">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <UserCircle className="w-5 h-5 text-gray-400" />
                )}
              </div>
              <div className="flex flex-col truncate">
                <span className="text-sm font-medium truncate">{user?.displayName || "Usuário"}</span>
                <span className="text-xs text-gray-500 truncate">{user?.email || ""}</span>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="text-gray-500 hover:text-red-500 transition-colors shrink-0 ml-2"
              title="Sair"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-[#0A0A0A] pt-16 md:pt-0">
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
