import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import AdminUsers from "./pages/AdminUsers";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import MetaAds from "./pages/MetaAds";
import MetaCampaigns from "./pages/MetaCampaigns";
import GoogleAds from "./pages/GoogleAds";
import GoogleCampaigns from "./pages/GoogleCampaigns";
import SmartAdDashboard from "./pages/SmartAdDashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login"  element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Home — SmartAdDashboard has its own sidebar & logout built in */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <SmartAdDashboard />
            </ProtectedRoute>
          }
        />

        {/* Sub-pages — wrapped in Dashboard (sidebar + topbar) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          <Route path="meta"             element={<MetaAds />} />
          <Route path="meta/campaigns"   element={<MetaCampaigns />} />
          <Route path="google"           element={<GoogleAds />} />
          <Route path="google/campaigns" element={<GoogleCampaigns />} />
        </Route>

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminUsers />
            </AdminRoute>
          }
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}