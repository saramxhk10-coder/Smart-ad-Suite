import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();

  const isMeta = location.pathname.startsWith("/dashboard/meta");
  const isGoogle = location.pathname.startsWith("/dashboard/google");

  return (
    <div className="w-72 bg-[#0a0a0f] border-r border-[#1e1e2d] text-[#e8e8ec] min-h-screen flex flex-col relative overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#C9BEFF]/5 via-transparent to-transparent pointer-events-none"></div>
      
      {/* Logo / Brand */}
      <div className="p-6 border-b border-[#1e1e2d] relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#C9BEFF] to-[#8B7FD4] rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(201,190,255,0.3)]">
            <svg className="w-6 h-6 text-[#0a0a0f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-wider uppercase">SMART-AD</h2>
            <p className="text-xs text-[#6b6b80] tracking-widest">SUITE</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 relative z-10 overflow-y-auto">
        {/* Dashboard Home */}
        <Link
          to="/dashboard"
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
            location.pathname === "/dashboard"
              ? "bg-[#C9BEFF]/10 text-[#C9BEFF] border border-[#C9BEFF]/30 shadow-[0_0_20px_rgba(201,190,255,0.1)]"
              : "text-[#a0a0a8] hover:bg-[#1e1e2d] hover:text-white border border-transparent"
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          <span className="font-medium">Dashboard</span>
        </Link>

        {/* ================= META ADS ================= */}
        <div className="pt-4">
          <div className="px-4 mb-2 text-xs font-semibold text-[#4a4a60] uppercase tracking-wider flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#C9BEFF]"></div>
            Meta Platforms
          </div>
          
          <Link
            to="/dashboard/meta"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 mb-1 group ${
              isMeta && location.pathname === "/dashboard/meta"
                ? "bg-[#C9BEFF]/10 text-[#C9BEFF] border border-[#C9BEFF]/30 shadow-[0_0_20px_rgba(201,190,255,0.1)]"
                : "text-[#a0a0a8] hover:bg-[#1e1e2d] hover:text-white border border-transparent"
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
            <span className="font-medium">Meta Ads</span>
            {isMeta && (
              <svg className="w-4 h-4 ml-auto text-[#C9BEFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </Link>

          {/* Meta Submenu */}
          <div className={`overflow-hidden transition-all duration-300 ${isMeta ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="ml-4 pl-4 border-l-2 border-[#2a2a3c] space-y-1 mt-1">
              <Link
                to="/dashboard/meta"
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                  location.pathname === "/dashboard/meta"
                    ? "bg-[#C9BEFF]/10 text-[#C9BEFF] border border-[#C9BEFF]/20"
                    : "text-[#6b6b80] hover:text-[#e8e8ec] hover:bg-[#1e1e2d]/50"
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                </svg>
                Create Campaign
              </Link>

              <Link
                to="/dashboard/meta/campaigns"
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                  location.pathname.includes("/meta/campaigns")
                    ? "bg-[#C9BEFF]/10 text-[#C9BEFF] border border-[#C9BEFF]/20"
                    : "text-[#6b6b80] hover:text-[#e8e8ec] hover:bg-[#1e1e2d]/50"
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                My Campaigns
              </Link>
            </div>
          </div>
        </div>

        {/* ================= GOOGLE ADS ================= */}
        <div className="pt-4">
          <div className="px-4 mb-2 text-xs font-semibold text-[#4a4a60] uppercase tracking-wider flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#a89fe8]"></div>
            Google Network
          </div>
          
          <Link
            to="/dashboard/google"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 mb-1 group ${
              isGoogle && location.pathname === "/dashboard/google"
                ? "bg-[#a89fe8]/10 text-[#a89fe8] border border-[#a89fe8]/30 shadow-[0_0_20px_rgba(168,159,232,0.1)]"
                : "text-[#a0a0a8] hover:bg-[#1e1e2d] hover:text-white border border-transparent"
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">Google Ads</span>
            {isGoogle && (
              <svg className="w-4 h-4 ml-auto text-[#a89fe8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </Link>

          {/* Google Submenu */}
          <div className={`overflow-hidden transition-all duration-300 ${isGoogle ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="ml-4 pl-4 border-l-2 border-[#2a2a3c] space-y-1 mt-1">
              <Link
                to="/dashboard/google"
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                  location.pathname === "/dashboard/google"
                    ? "bg-[#a89fe8]/10 text-[#a89fe8] border border-[#a89fe8]/20"
                    : "text-[#6b6b80] hover:text-[#e8e8ec] hover:bg-[#1e1e2d]/50"
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                </svg>
                Create Campaign
              </Link>

              <Link
                to="/dashboard/google/campaigns"
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                  location.pathname.includes("/google/campaigns")
                    ? "bg-[#a89fe8]/10 text-[#a89fe8] border border-[#a89fe8]/20"
                    : "text-[#6b6b80] hover:text-[#e8e8ec] hover:bg-[#1e1e2d]/50"
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                My Campaigns
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-[#1e1e2d] relative z-10">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#12121a] border border-[#2a2a3c]">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C9BEFF] to-[#8B7FD4] flex items-center justify-center text-[#0a0a0f] font-bold text-sm">
            U
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">User Account</p>
            <p className="text-xs text-[#6b6b80]">Pro Plan</p>
          </div>
          <div className="w-2 h-2 bg-green-400 rounded-full shadow-[0_0_8px_rgba(74,222,128,0.5)]"></div>
        </div>
      </div>
    </div>
  );
}