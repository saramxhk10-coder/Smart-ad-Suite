import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";
import { getToken, logout } from "../utils/auth";
import api from "../api/axios";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!getToken()) return navigate("/login");

    api.get("/user/me")
      .then(res => setUser(res.data))
      .catch(() => {
        logout();
        navigate("/login");
      });
  }, []);

  if (!user) return (
    <div className="fixed inset-0 w-screen h-screen flex items-center justify-center bg-[#0a0a0f]">
      <div className="flex flex-col items-center">
        <div className="w-8 h-8 border-2 border-[#C9BEFF]/30 border-t-[#C9BEFF] rounded-full animate-spin mb-4" />
        <p className="text-[#6b6b80] text-sm">Loading...</p>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0a0a0f]">
      {/* Sidebar — hidden on mobile until toggled, icon-only on tablet, full on desktop */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col h-full w-full min-w-0 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e]/30 via-transparent to-[#16213e]/20 pointer-events-none" />

        <div className="relative z-10 flex flex-col h-full overflow-auto">

          {/* Header */}
          <div className="flex items-center gap-3 m-3 sm:m-4 lg:m-6 bg-[#12121a]/80 backdrop-blur-md rounded-2xl border border-[#1e1e2d] p-3 sm:p-4 lg:p-6 shadow-[0_0_40px_rgba(201,190,255,0.05)] shrink-0">

            {/* Hamburger — visible below lg */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-[#a0a0a8] hover:bg-[#1e1e2d] hover:text-white transition-colors shrink-0"
              aria-label="Open sidebar"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Title + email */}
            <div className="flex-1 min-w-0">
              <h1 className="text-base sm:text-lg lg:text-2xl font-bold text-white tracking-widest uppercase truncate">
                SMART-AD SUITE
              </h1>
              <p className="text-[#6b6b80] text-xs sm:text-sm truncate">
                Welcome,{" "}
                <span className="text-[#C9BEFF] font-medium">{user.email}</span>
              </p>
            </div>

            {/* Logout */}
            <button
              onClick={() => { logout(); navigate("/login"); }}
              className="px-3 sm:px-5 lg:px-6 py-2 sm:py-2.5 lg:py-3 bg-[#2a2a3c] hover:bg-[#3a3a4c] text-[#C9BEFF] font-medium rounded-xl transition-all duration-300 border border-[#3a3a4c] hover:border-[#C9BEFF]/50 hover:shadow-[0_0_20px_rgba(201,190,255,0.2)] flex items-center gap-2 shrink-0 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              {/* Hide label on very small screens */}
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>

          {/* Page content */}
          <div className="flex-1 mx-3 sm:mx-4 lg:mx-6 mb-3 sm:mb-4 lg:mb-6 bg-[#12121a]/60 backdrop-blur-sm rounded-2xl border border-[#1e1e2d] p-3 sm:p-4 lg:p-6 overflow-auto min-h-0">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}