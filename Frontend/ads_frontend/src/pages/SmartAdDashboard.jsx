import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Zap, Brain, Shield, Eye, Search, PenTool, Package, Send, BarChart2, Users, Globe, ChevronRight, Star, TrendingUp, ArrowRight, Target, Layers, Code2, Sparkles, Activity, Award, ExternalLink, Mail } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { logout } from "../utils/auth";
import api from "../api/axios";
import SARAM_PHOTO   from "../assets/Saram.jpeg";
import SAMAVIA_PHOTO from "../assets/Samavia.jpeg";
import ROOSHY_PHOTO  from "../assets/Rooshy.jpeg";

// ─── DATA ───────────────────────────────────────────────────────────────────
const performanceData = [
  { month: "Jan", campaigns: 42,  compliance: 88 },
  { month: "Feb", campaigns: 67,  compliance: 91 },
  { month: "Mar", campaigns: 89,  compliance: 94 },
  { month: "Apr", campaigns: 112, compliance: 96 },
  { month: "May", campaigns: 145, compliance: 97 },
  { month: "Jun", campaigns: 178, compliance: 98 },
];
const platformData = [
  { name: "Meta Ads",   value: 42, color: "#7c3aed" },
  { name: "Google Ads", value: 35, color: "#4f46e5" },
  { name: "LinkedIn",   value: 23, color: "#06b6d4" },
];
const roiData = [
  { month: "Jan", roi: 120 },
  { month: "Feb", roi: 185 },
  { month: "Mar", roi: 240 },
  { month: "Apr", roi: 310 },
  { month: "May", roi: 410 },
  { month: "Jun", roi: 520 },
];

// ─── HOOKS ──────────────────────────────────────────────────────────────────
function useCountUp(target, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    const num = parseInt(String(target).replace(/[^0-9]/g, "")) || 0;
    const step = num / (duration / 16);
    let cur = 0;
    const timer = setInterval(() => {
      cur = Math.min(cur + step, num);
      setCount(Math.floor(cur));
      if (cur >= num) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [start, target, duration]);
  return count;
}

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

// ─── SIDEBAR ────────────────────────────────────────────────────────────────
function Sidebar({ user, onLogout }) {
  const location = useLocation();
  const isMeta   = location.pathname.startsWith("/dashboard/meta");
  const isGoogle = location.pathname.startsWith("/dashboard/google");
  const isHome   = location.pathname === "/dashboard" || location.pathname === "/dashboard/home";

  return (
    <div className="w-72 bg-[#0a0a0f] border-r border-[#1e1e2d] text-[#e8e8ec] min-h-screen flex flex-col relative overflow-hidden flex-shrink-0">
      <div className="absolute inset-0 bg-gradient-to-b from-[#C9BEFF]/5 via-transparent to-transparent pointer-events-none" />

      {/* Brand */}
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

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-2 relative z-10 overflow-y-auto">

        {/* Home */}
        <Link to="/dashboard"
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
            isHome
              ? "bg-[#C9BEFF]/10 text-[#C9BEFF] border border-[#C9BEFF]/30 shadow-[0_0_20px_rgba(201,190,255,0.1)]"
              : "text-[#a0a0a8] hover:bg-[#1e1e2d] hover:text-white border border-transparent"
          }`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          <span className="font-medium">Dashboard</span>
        </Link>

        {/* META */}
        <div className="pt-4">
          <div className="px-4 mb-2 text-xs font-semibold text-[#4a4a60] uppercase tracking-wider flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#C9BEFF]" />
            Meta Platforms
          </div>
          <Link to="/dashboard/meta"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 mb-1 ${
              isMeta && location.pathname === "/dashboard/meta"
                ? "bg-[#C9BEFF]/10 text-[#C9BEFF] border border-[#C9BEFF]/30 shadow-[0_0_20px_rgba(201,190,255,0.1)]"
                : "text-[#a0a0a8] hover:bg-[#1e1e2d] hover:text-white border border-transparent"
            }`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
            <span className="font-medium">Meta Ads</span>
            {isMeta && <svg className="w-4 h-4 ml-auto text-[#C9BEFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>}
          </Link>
          <div className={`overflow-hidden transition-all duration-300 ${isMeta ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}>
            <div className="ml-4 pl-4 border-l-2 border-[#2a2a3c] space-y-1 mt-1">
              <Link to="/dashboard/meta" className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm transition-all duration-200 ${location.pathname === "/dashboard/meta" ? "bg-[#C9BEFF]/10 text-[#C9BEFF] border border-[#C9BEFF]/20" : "text-[#6b6b80] hover:text-[#e8e8ec] hover:bg-[#1e1e2d]/50"}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" /></svg>
                Create Campaign
              </Link>
              <Link to="/dashboard/meta/campaigns" className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm transition-all duration-200 ${location.pathname.includes("/meta/campaigns") ? "bg-[#C9BEFF]/10 text-[#C9BEFF] border border-[#C9BEFF]/20" : "text-[#6b6b80] hover:text-[#e8e8ec] hover:bg-[#1e1e2d]/50"}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                My Campaigns
              </Link>
            </div>
          </div>
        </div>

        {/* GOOGLE */}
        <div className="pt-4">
          <div className="px-4 mb-2 text-xs font-semibold text-[#4a4a60] uppercase tracking-wider flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#a89fe8]" />
            Google Network
          </div>
          <Link to="/dashboard/google"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 mb-1 ${
              isGoogle && location.pathname === "/dashboard/google"
                ? "bg-[#a89fe8]/10 text-[#a89fe8] border border-[#a89fe8]/30 shadow-[0_0_20px_rgba(168,159,232,0.1)]"
                : "text-[#a0a0a8] hover:bg-[#1e1e2d] hover:text-white border border-transparent"
            }`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">Google Ads</span>
            {isGoogle && <svg className="w-4 h-4 ml-auto text-[#a89fe8]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>}
          </Link>
          <div className={`overflow-hidden transition-all duration-300 ${isGoogle ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}>
            <div className="ml-4 pl-4 border-l-2 border-[#2a2a3c] space-y-1 mt-1">
              <Link to="/dashboard/google" className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm transition-all duration-200 ${location.pathname === "/dashboard/google" ? "bg-[#a89fe8]/10 text-[#a89fe8] border border-[#a89fe8]/20" : "text-[#6b6b80] hover:text-[#e8e8ec] hover:bg-[#1e1e2d]/50"}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" /></svg>
                Create Campaign
              </Link>
              <Link to="/dashboard/google/campaigns" className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm transition-all duration-200 ${location.pathname.includes("/google/campaigns") ? "bg-[#a89fe8]/10 text-[#a89fe8] border border-[#a89fe8]/20" : "text-[#6b6b80] hover:text-[#e8e8ec] hover:bg-[#1e1e2d]/50"}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                My Campaigns
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Footer with logout */}
      <div className="p-4 border-t border-[#1e1e2d] relative z-10 space-y-3">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#12121a] border border-[#2a2a3c]">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C9BEFF] to-[#8B7FD4] flex items-center justify-center text-[#0a0a0f] font-bold text-sm">
            {user?.email?.[0]?.toUpperCase() || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.email || "User"}</p>
            <p className="text-xs text-[#6b6b80]">Pro Plan</p>
          </div>
          <div className="w-2 h-2 bg-green-400 rounded-full shadow-[0_0_8px_rgba(74,222,128,0.5)]" />
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[#a0a0a8] hover:bg-red-500/10 hover:text-red-400 border border-transparent hover:border-red-500/20 transition-all duration-300">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}

// ─── SMALL COMPONENTS ────────────────────────────────────────────────────────
function GlowBg({ color = "#7c3aed", size = "w-96 h-96", pos = "top-1/4 left-1/4", delay = "0s" }) {
  return (
    <div className={`absolute ${pos} ${size} rounded-full blur-3xl opacity-10 pointer-events-none`}
      style={{ background: `radial-gradient(${color},transparent)`, animation: `glow 5s ease-in-out infinite`, animationDelay: delay }} />
  );
}

function StatCard({ icon: Icon, label, value, suffix = "", color, inView }) {
  const raw = parseInt(String(value).replace(/[^0-9]/g, "")) || 0;
  const count = useCountUp(raw, 2000, inView);
  const prefix = String(value).startsWith("$") ? "$" : "";
  const postfix = String(value).endsWith("+") ? "+" : suffix;
  return (
    <div className="relative group rounded-2xl p-6 border border-white/10 overflow-hidden transition-all duration-500 hover:border-purple-500/40 hover:scale-[1.02]"
      style={{ background: "rgba(255,255,255,0.03)", backdropFilter: "blur(12px)" }}>
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
        style={{ background: `radial-gradient(circle at 50% 0%, ${color}22, transparent 70%)` }} />
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}22`, border: `1px solid ${color}44` }}>
          <Icon size={18} style={{ color }} />
        </div>
        <span className="text-sm text-gray-400 font-medium">{label}</span>
      </div>
      <div className="text-3xl font-bold text-white">{prefix}{count}{postfix}</div>
    </div>
  );
}

function AgentCard({ icon: Icon, name, desc, color }) {
  return (
    <div className="relative group p-5 rounded-2xl border border-white/10 hover:border-purple-500/40 transition-all duration-500 cursor-default"
      style={{ background: "rgba(255,255,255,0.03)", backdropFilter: "blur(10px)" }}>
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-2xl"
        style={{ background: `radial-gradient(circle at 0% 100%, ${color}15, transparent 60%)` }} />
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 duration-300"
          style={{ background: `${color}22`, border: `1px solid ${color}55` }}>
          <Icon size={20} style={{ color }} />
        </div>
        <div>
          <h4 className="text-white font-semibold mb-1">{name}</h4>
          <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc, badge, color }) {
  return (
    <div className="group relative rounded-2xl p-6 border border-white/10 overflow-hidden hover:border-purple-400/40 transition-all duration-500 hover:-translate-y-1"
      style={{ background: "rgba(255,255,255,0.03)", backdropFilter: "blur(12px)" }}>
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `radial-gradient(circle at 50% 0%, ${color}18, transparent 65%)` }} />
      {badge && (
        <span className="inline-block mb-4 px-3 py-1 rounded-full text-xs font-semibold"
          style={{ background: `${color}22`, color, border: `1px solid ${color}44` }}>{badge}</span>
      )}
      <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-300"
        style={{ background: `${color}22`, border: `1px solid ${color}55` }}>
        <Icon size={22} style={{ color }} />
      </div>
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

function TeamCard({ photo, name, role, bio, reg }) {
  return (
    <div className="group relative rounded-3xl p-6 border border-white/10 overflow-hidden hover:border-purple-500/40 transition-all duration-500 hover:-translate-y-2"
      style={{ background: "rgba(255,255,255,0.03)", backdropFilter: "blur(16px)" }}>
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
        style={{ background: "radial-gradient(circle at 50% 0%, rgba(124,58,237,0.12), transparent 70%)" }} />
      <div className="relative z-10">
        <div className="relative mx-auto mb-5 w-28 h-28">
          <img src={photo} alt={name} className="w-28 h-28 rounded-full object-cover object-top relative z-10"
            style={{ border: "2px solid rgba(124,58,237,0.4)" }} />
        </div>
        <div className="text-center mb-4">
          <h3 className="text-xl font-bold text-white">{name}</h3>
          <p className="text-purple-400 text-sm font-medium mt-1">{role}</p>
          <p className="text-gray-500 text-xs mt-1">{reg}</p>
        </div>
        <p className="text-gray-400 text-sm leading-relaxed text-center mb-5">{bio}</p>
        <div className="flex justify-center gap-3">
          {[ExternalLink, ExternalLink, Mail].map((Icon, i) => (
            <button key={i} className="w-9 h-9 rounded-xl flex items-center justify-center border border-white/10 hover:border-purple-500/50 hover:bg-purple-500/10 transition-all duration-300">
              <Icon size={15} className="text-gray-400" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function TechBadge({ name, icon }) {
  return (
    <div className="flex items-center gap-3 px-5 py-3 rounded-2xl border border-white/10 hover:border-purple-500/40 transition-all duration-300 cursor-default hover:scale-105"
      style={{ background: "rgba(255,255,255,0.03)" }}>
      <span className="text-xl">{icon}</span>
      <span className="text-white font-medium text-sm">{name}</span>
    </div>
  );
}

function WorkflowStep({ step, icon: Icon, title, desc, color, isLast }) {
  return (
    <div className="flex gap-5">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 relative z-10"
          style={{ background: `${color}22`, border: `1.5px solid ${color}66` }}>
          <Icon size={18} style={{ color }} />
        </div>
        {!isLast && <div className="w-px flex-1 mt-2 mb-2 opacity-20" style={{ background: color }} />}
      </div>
      <div className="pb-8">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: `${color}22`, color }}>STEP {step}</span>
        </div>
        <h4 className="text-white font-bold text-base mb-1">{title}</h4>
        <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="rounded-xl px-4 py-3 border border-white/10" style={{ background: "rgba(10,10,20,0.95)", backdropFilter: "blur(12px)" }}>
        <p className="text-gray-400 text-xs mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} className="font-semibold text-sm" style={{ color: p.color || p.stroke }}>{p.name}: {p.value}</p>
        ))}
      </div>
    );
  }
  return null;
};

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function SmartAdDashboard() {
  const [heroVisible, setHeroVisible] = useState(false);
  const [user, setUser] = useState(null);
  const [statsRef, statsInView] = useInView();
  const [analyticsRef, analyticsInView] = useInView();
  const navigate = useNavigate();

  useEffect(() => { setTimeout(() => setHeroVisible(true), 100); }, []);

  useEffect(() => {
    api.get("/user/me")
      .then(res => setUser(res.data))
      .catch(() => {});
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const agents = [
    { icon: Brain,   name: "Planner Agent",        desc: "Orchestrates the entire workflow — managing data flow and agent coordination from input to publication.",      color: "#7c3aed" },
    { icon: Eye,     name: "Vision Agent",          desc: "Analyzes product images using Computer Vision to extract features, themes and emotional cues.",               color: "#4f46e5" },
    { icon: Search,  name: "Keyword Agent",         desc: "Uses NLP with TF-IDF and BERT to generate and rank contextually optimized keywords for search performance.",  color: "#06b6d4" },
    { icon: PenTool, name: "Ad Writer Agent",       desc: "Crafts compelling ad copy — headlines and descriptions — personalized for each target platform.",             color: "#8b5cf6" },
    { icon: Star,    name: "Critic Agent",          desc: "Refines ad messaging for tone, clarity, and emotional appeal before the compliance stage.",                  color: "#a78bfa" },
    { icon: Shield,  name: "Compliance Agent",      desc: "Validates ads against Google and Meta policies in real-time to eliminate costly rejections.",                 color: "#10b981" },
    { icon: Package, name: "Packager Agent",        desc: "Bundles images, keywords, and copy into platform-specific ad payloads ready for deployment.",                color: "#f59e0b" },
    { icon: Send,    name: "Auto-Publishing Agent", desc: "Publishes fully compliant campaigns to Google, Meta and LinkedIn via authenticated API integrations.",       color: "#ef4444" },
  ];

  const features = [
    { icon: Zap,       title: "End-to-End Automation",     desc: "Complete ad lifecycle from product image to live campaign with zero manual intervention required.",      badge: "Core",     color: "#7c3aed" },
    { icon: Shield,    title: "Real-Time Compliance",       desc: "Proactive policy validation ensures near-zero ad rejection rates across all major platforms.",           badge: "USP",      color: "#10b981" },
    { icon: Brain,     title: "Multi-Agent AI Pipeline",    desc: "8 specialized AI agents using NLP and Computer Vision for intelligent, automated ad creation.",         badge: "AI",       color: "#4f46e5" },
    { icon: Globe,     title: "Multi-Platform Publishing",  desc: "Deploy campaigns to Google Ads, Meta and LinkedIn simultaneously from a single unified dashboard.",      badge: "Reach",    color: "#06b6d4" },
    { icon: BarChart2, title: "Analytics Dashboard",        desc: "Real-time metrics, campaign insights, ROI tracking and actionable performance intelligence.",           badge: "Insights", color: "#f59e0b" },
    { icon: Layers,    title: "Scalable MERN Architecture", desc: "Modular MERN stack with clean API design supports everything from SMEs to enterprise marketing teams.",  badge: "Scale",    color: "#8b5cf6" },
  ];

  const techStack = [
    { name: "React.js",        icon: "⚛️"  },
    { name: "Node.js",         icon: "🟢"  },
    { name: "MongoDB",         icon: "🍃"  },
    { name: "Python",          icon: "🐍"  },
    { name: "Hugging Face",    icon: "🤗"  },
    { name: "Express.js",      icon: "🚀"  },
    { name: "Google Ads API",  icon: "📊"  },
    { name: "Meta API",        icon: "📘"  },
    { name: "BERT / TF-IDF",   icon: "🧠"  },
    { name: "Computer Vision", icon: "👁️" },
    { name: "GitHub",          icon: "🐙"  },
    { name: "REST APIs",       icon: "🔌"  },
  ];

  const workflowSteps = [
    { step:1, icon:Eye,     title:"Product Upload & Vision Analysis", desc:"Marketers upload product images. The Vision Agent uses CV to extract features, themes and emotional cues.",                          color:"#7c3aed" },
    { step:2, icon:Search,  title:"Intelligent Keyword Generation",   desc:"The Keyword Agent leverages BERT and TF-IDF to generate contextually ranked, platform-optimized keywords.",                         color:"#4f46e5" },
    { step:3, icon:PenTool, title:"AI-Powered Ad Copywriting",        desc:"The Ad Writer Agent crafts compelling headlines, descriptions and CTAs tailored to the audience and platform.",                      color:"#06b6d4" },
    { step:4, icon:Star,    title:"Quality Critique & Refinement",    desc:"The Critic Agent reviews tone, emotional appeal and clarity — refining the copy for maximum engagement.",                            color:"#8b5cf6" },
    { step:5, icon:Shield,  title:"Real-Time Compliance Validation",  desc:"The Compliance Agent validates every element against Google and Meta policies, blocking non-compliant content before it ships.",      color:"#10b981" },
    { step:6, icon:Send,    title:"Multi-Platform Auto-Publishing",   desc:"The Packager and Auto-Publishing Agents format and deploy the approved campaign across all target platforms simultaneously.",          color:"#f59e0b", isLast:true },
  ];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#050510]">
      <Sidebar user={user} onLogout={handleLogout} />

      {/* Main scrollable content */}
      <div className="flex-1 overflow-y-auto text-white" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
        <style>{`
          @keyframes float   { 0%,100%{transform:translateY(0)}  50%{transform:translateY(-18px)} }
          @keyframes glow    { 0%,100%{opacity:0.3} 50%{opacity:0.7} }
          .gradient-text {
            background: linear-gradient(135deg,#c4b5fd,#7c3aed,#4f46e5,#06b6d4);
            -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
          }
          ::-webkit-scrollbar { width:5px }
          ::-webkit-scrollbar-track { background:#050510 }
          ::-webkit-scrollbar-thumb { background:#7c3aed55; border-radius:3px }
        `}</style>

        {/* HERO */}
        <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <GlowBg color="#7c3aed" size="w-[500px] h-[500px]" pos="top-1/3 left-1/4"    delay="0s" />
            <GlowBg color="#4f46e5" size="w-[400px] h-[400px]" pos="bottom-1/3 right-1/4" delay="2s" />
            <GlowBg color="#06b6d4" size="w-[300px] h-[300px]" pos="top-1/4 right-1/3"   delay="1s" />
          </div>
          <div className="relative z-10 max-w-5xl mx-auto text-center">
            <div className={`transition-all duration-1000 ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
              <div className="inline-flex items-center gap-2 mb-6 px-5 py-2.5 rounded-full text-sm"
                style={{ background:"rgba(124,58,237,0.15)", border:"1px solid rgba(124,58,237,0.35)", color:"#c4b5fd" }}>
                <Sparkles size={14} />
                Final Year Project · BSAI · The University of Faisalabad
              </div>
              <h1 className="text-6xl md:text-8xl font-black mb-6 leading-none tracking-tight">
                <span className="gradient-text">SMART-AD</span><br />
                <span className="text-white">SUITE</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-4 leading-relaxed">
                End-to-End AI-Powered Digital Advertising Automation
              </p>
              <p className="text-base text-gray-500 max-w-2xl mx-auto mb-10">
                A multi-agent AI system that automates the complete ad lifecycle — from image analysis and keyword generation to compliance validation and multi-platform publishing.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 mb-14">
                <Link to="/dashboard/meta"
                  className="flex items-center gap-2 px-7 py-3.5 rounded-2xl font-semibold text-white transition-all duration-300 hover:scale-105"
                  style={{ background:"linear-gradient(135deg,#7c3aed,#4f46e5)", boxShadow:"0 8px 32px rgba(124,58,237,0.4)" }}>
                  <Zap size={16} /> Get Started
                </Link>
                <button className="flex items-center gap-2 px-7 py-3.5 rounded-2xl font-semibold border transition-all duration-300 hover:scale-105 hover:border-purple-400"
                  style={{ border:"1px solid rgba(255,255,255,0.15)", color:"#e2e8f0", background:"rgba(255,255,255,0.03)" }}>
                  View Workflow <ChevronRight size={16} />
                </button>
              </div>
            </div>
            <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto transition-all duration-1000 delay-300 ${heroVisible?"opacity-100 translate-y-0":"opacity-0 translate-y-8"}`}>
              {[
                {label:"AI Agents", value:"8",    icon:"🤖"},
                {label:"Platforms", value:"3",    icon:"🌐"},
                {label:"Compliance",value:"98%",  icon:"✅"},
                {label:"Automation",value:"100%", icon:"⚡"},
              ].map((s,i) => (
                <div key={i} className="rounded-2xl p-4 text-center border border-white/10 hover:border-purple-500/30 transition-all duration-300"
                  style={{ background:"rgba(255,255,255,0.03)", backdropFilter:"blur(12px)" }}>
                  <div className="text-2xl mb-1">{s.icon}</div>
                  <div className="text-2xl font-bold text-white">{s.value}</div>
                  <div className="text-xs text-gray-500">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PROBLEM */}
        <section id="problem" className="py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-xs font-bold tracking-widest text-purple-400 uppercase mb-3 block">The Challenge</span>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Why Digital Advertising <span className="gradient-text">Is Broken</span></h2>
              <p className="text-gray-400 max-w-2xl mx-auto">The modern advertising ecosystem is fragmented, manual, and error-prone.</p>
            </div>
            <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
              <StatCard icon={TrendingUp} label="Time on Manual Tasks"          value="73" suffix="%" color="#ef4444" inView={statsInView} />
              <StatCard icon={Activity}   label="Industry Ad Rejection Rate"    value="34" suffix="%" color="#f59e0b" inView={statsInView} />
              <StatCard icon={Users}      label="SMEs Needing Automation"       value="5"  suffix="M+" color="#7c3aed" inView={statsInView} />
              <StatCard icon={Target}     label="Annual Waste from Inefficiency" value="2" suffix="B+" color="#06b6d4" inView={statsInView} />
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { title:"Fragmented Workflows",   desc:"Marketers juggle 5+ disconnected tools for keyword research, content creation, compliance checking, and publishing.",  icon:"🔗" },
                { title:"High Human Error Rate",  desc:"Manual keyword assignments, typos, and wrong targeting waste ad budgets and directly damage campaign performance.",      icon:"⚠️" },
                { title:"Policy Rejection Chaos", desc:"No real-time cross-platform compliance means ads are frequently rejected post-submission, delaying campaigns.",          icon:"🚫" },
              ].map((p,i) => (
                <div key={i} className="rounded-2xl p-6 border border-white/10 hover:border-red-500/20 transition-all duration-300"
                  style={{ background:"rgba(255,255,255,0.03)" }}>
                  <div className="text-3xl mb-4">{p.icon}</div>
                  <h3 className="text-white font-bold text-lg mb-2">{p.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SOLUTION */}
        <section id="solution" className="py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-xs font-bold tracking-widest text-purple-400 uppercase mb-3 block">The Solution</span>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Meet the <span className="gradient-text">AI Agent Pipeline</span></h2>
              <p className="text-gray-400 max-w-2xl mx-auto">8 specialized intelligent agents work in orchestrated harmony.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {agents.map((a,i) => <AgentCard key={i} {...a} />)}
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" className="py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-xs font-bold tracking-widest text-purple-400 uppercase mb-3 block">Capabilities</span>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Built for <span className="gradient-text">Modern Marketing</span></h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((f,i) => <FeatureCard key={i} {...f} />)}
            </div>
          </div>
        </section>

        {/* ANALYTICS */}
        <section id="analytics" className="py-24 px-6" ref={analyticsRef}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-xs font-bold tracking-widest text-purple-400 uppercase mb-3 block">Performance Intelligence</span>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Smart <span className="gradient-text">Analytics Dashboard</span></h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {[
                { label:"Campaigns Launched",  value:"178",  change:"+23%",  color:"#7c3aed" },
                { label:"Compliance Rate",      value:"98%",  change:"+4.2%", color:"#10b981" },
                { label:"Avg Engagement Boost", value:"8.9x", change:"+34%",  color:"#06b6d4" },
              ].map((s,i) => (
                <div key={i} className="rounded-2xl p-6 border border-white/10 hover:border-purple-500/30 transition-all"
                  style={{ background:"rgba(255,255,255,0.03)", backdropFilter:"blur(12px)" }}>
                  <div className="text-sm text-gray-400 mb-3">{s.label}</div>
                  <div className="text-4xl font-black text-white mb-2">{s.value}</div>
                  <div className="text-sm font-semibold" style={{ color:s.color }}>↑ {s.change} vs baseline</div>
                </div>
              ))}
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2 rounded-2xl p-6 border border-white/10" style={{ background:"rgba(255,255,255,0.03)", backdropFilter:"blur(12px)" }}>
                <h3 className="text-white font-bold mb-1">Campaign Growth & Compliance Rate</h3>
                <p className="text-gray-500 text-xs mb-6">6-month performance metrics</p>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={performanceData}>
                    <defs>
                      <linearGradient id="campGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#7c3aed" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="compGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)"/>
                    <XAxis dataKey="month" tick={{ fill:"#6b7280", fontSize:11 }} axisLine={false} tickLine={false}/>
                    <YAxis tick={{ fill:"#6b7280", fontSize:11 }} axisLine={false} tickLine={false}/>
                    <Tooltip content={<CustomTooltip />}/>
                    <Area type="monotone" dataKey="campaigns"  name="Campaigns"   stroke="#7c3aed" fill="url(#campGrad)" strokeWidth={2}/>
                    <Area type="monotone" dataKey="compliance" name="Compliance%" stroke="#10b981" fill="url(#compGrad)" strokeWidth={2}/>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="rounded-2xl p-6 border border-white/10" style={{ background:"rgba(255,255,255,0.03)", backdropFilter:"blur(12px)" }}>
                <h3 className="text-white font-bold mb-1">Platform Distribution</h3>
                <p className="text-gray-500 text-xs mb-4">Ad deployment split</p>
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie data={platformData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={4} dataKey="value">
                      {platformData.map((e,i) => <Cell key={i} fill={e.color}/>)}
                    </Pie>
                    <Tooltip content={<CustomTooltip />}/>
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 mt-2">
                  {platformData.map((p,i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background:p.color }}/>
                        <span className="text-gray-400 text-xs">{p.name}</span>
                      </div>
                      <span className="text-white text-xs font-semibold">{p.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-6 rounded-2xl p-6 border border-white/10" style={{ background:"rgba(255,255,255,0.03)", backdropFilter:"blur(12px)" }}>
              <h3 className="text-white font-bold mb-1">Return on Investment (ROI) Growth</h3>
              <p className="text-gray-500 text-xs mb-6">Projected ROI improvement with Smart-AD Suite automation</p>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={roiData} barSize={32}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)"/>
                  <XAxis dataKey="month" tick={{ fill:"#6b7280", fontSize:11 }} axisLine={false} tickLine={false}/>
                  <YAxis tick={{ fill:"#6b7280", fontSize:11 }} axisLine={false} tickLine={false}/>
                  <Tooltip content={<CustomTooltip />}/>
                  <Bar dataKey="roi" name="ROI %" radius={[6,6,0,0]} fill="#7c3aed"/>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* WORKFLOW */}
        <section className="py-24 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-xs font-bold tracking-widest text-purple-400 uppercase mb-3 block">How It Works</span>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">System <span className="gradient-text">Workflow</span></h2>
              <p className="text-gray-400 max-w-2xl mx-auto">From product image to live campaign — a fully automated 6-step pipeline.</p>
            </div>
            <div className="max-w-2xl mx-auto">
              {workflowSteps.map((s,i) => <WorkflowStep key={i} {...s} />)}
            </div>
          </div>
        </section>

        {/* TEAM */}
        <section id="team" className="py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-xs font-bold tracking-widest text-purple-400 uppercase mb-3 block">The Builders</span>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Meet the <span className="gradient-text">Team</span></h2>
              <p className="text-gray-400">BSAI · Class of 2026 · The University of Faisalabad</p>
              <p className="text-gray-500 text-sm mt-1">Supervised by <span className="text-purple-400 font-medium">Mr. Samraiz Zahid</span></p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <TeamCard photo={SAMAVIA_PHOTO} name="Samavia Irfan"     role="AI Engineer"          reg="BSAI-FA22-032" bio="Specializes in NLP and ad content generation — leading the Keyword Agent and Ad Writer Agent development." />
              <TeamCard photo={SARAM_PHOTO}   name="Muhammad Saram"    role="Full Stack Developer" reg="BSAI-FA22-029" bio="Architected the MERN stack backend, agent orchestration layer and the multi-platform publishing integrations." />
              <TeamCard photo={ROOSHY_PHOTO}  name="Aroosha Chaudhary" role="Computer Vision Lead" reg="BSAI-FA22-019" bio="Developed the Vision Agent using Computer Vision and the Compliance Agent for real-time policy validation." />
            </div>
          </div>
        </section>

        {/* TECH STACK */}
        <section className="py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-xs font-bold tracking-widest text-purple-400 uppercase mb-3 block">Built With</span>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Technology <span className="gradient-text">Stack</span></h2>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              {techStack.map((t,i) => <TechBadge key={i} {...t} />)}
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <section className="py-16 px-6 border-t border-white/5">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 mb-6 px-5 py-2.5 rounded-full text-sm text-purple-300"
              style={{ background:"rgba(124,58,237,0.12)", border:"1px solid rgba(124,58,237,0.3)" }}>
              <Award size={14} /> Enterprise-Grade AI Advertising Automation
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              The Future of Advertising <span className="gradient-text">Is Autonomous</span>
            </h2>
            <div className="flex flex-wrap justify-center gap-4 mt-8 mb-10">
              <Link to="/dashboard/meta"
                className="flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-white transition-all duration-300 hover:scale-105"
                style={{ background:"linear-gradient(135deg,#7c3aed,#4f46e5)", boxShadow:"0 8px 40px rgba(124,58,237,0.4)" }}>
                <Zap size={18} /> Start a Campaign
              </Link>
              <button className="flex items-center gap-2 px-8 py-4 rounded-2xl font-bold border transition-all duration-300 hover:scale-105 hover:border-purple-400"
                style={{ border:"1px solid rgba(255,255,255,0.15)", color:"#e2e8f0", background:"rgba(255,255,255,0.03)" }}>
                <Code2 size={18} /> GitHub Repository <ArrowRight size={16} />
              </button>
            </div>
            <p className="text-gray-500 text-sm">Final Year Project · Department of Computer Science · The University of Faisalabad</p>
            <p className="text-gray-600 text-xs mt-2">© 2025–2026 Muhammad Saram · Samavia Irfan · Aroosha Chaudhary · All rights reserved.</p>
          </div>
        </section>
      </div>
    </div>
  );
}
