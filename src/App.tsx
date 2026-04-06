import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "./firebase";
import DashboardLayout from "./layouts/DashboardLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Planner from "./pages/Planner";
import Niches from "./pages/Niches";
import ProfileCreator from "./pages/ProfileCreator";
import ContentMachine from "./pages/ContentMachine";
import ScriptGenerator from "./pages/ScriptGenerator";
import MyScripts from "./pages/MyScripts";
import ProfessionalPrompter from "./pages/ProfessionalPrompter";
import DarkModeling from "./pages/DarkModeling";
import HowItWorks from "./pages/HowItWorks";
import Calendar from "./pages/Calendar";
import Settings from "./pages/Settings";

function ProtectedRoute({ children, user, loading }: { children: React.ReactNode, user: User | null, loading: boolean }) {
  const location = useLocation();

  if (loading) {
    return <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center text-white">Carregando...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
        <Route path="/" element={<ProtectedRoute user={user} loading={loading}><DashboardLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="planner" element={<Planner />} />
          <Route path="niches" element={<Niches />} />
          <Route path="profile" element={<ProfileCreator />} />
          <Route path="content" element={<ContentMachine />} />
          <Route path="scripts" element={<ScriptGenerator />} />
          <Route path="my-scripts" element={<MyScripts />} />
          <Route path="prompter" element={<ProfessionalPrompter />} />
          <Route path="modeling" element={<DarkModeling />} />
          <Route path="how-it-works" element={<HowItWorks />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
