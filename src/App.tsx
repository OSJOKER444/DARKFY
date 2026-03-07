import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Planner from "./pages/Planner";
import Niches from "./pages/Niches";
import ProfileCreator from "./pages/ProfileCreator";
import ContentMachine from "./pages/ContentMachine";
import ScriptGenerator from "./pages/ScriptGenerator";
import ImageGenerator from "./pages/ImageGenerator";
import Calendar from "./pages/Calendar";
import Simulator from "./pages/Simulator";
import Settings from "./pages/Settings";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuth = localStorage.getItem("darkfy_auth") === "true";
  const location = useLocation();

  if (!isAuth) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="planner" element={<Planner />} />
          <Route path="niches" element={<Niches />} />
          <Route path="profile" element={<ProfileCreator />} />
          <Route path="content" element={<ContentMachine />} />
          <Route path="scripts" element={<ScriptGenerator />} />
          <Route path="images" element={<ImageGenerator />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="simulator" element={<Simulator />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
