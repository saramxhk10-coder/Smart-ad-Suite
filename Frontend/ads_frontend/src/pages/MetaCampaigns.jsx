import { useEffect, useState } from "react";
import api from "../api/axios";

/* =========================
   Keyword UI Component
========================= */
const KeywordSection = ({ title, keywords, highlight = false }) => {
  if (!keywords || keywords.length === 0) return null;

  return (
    <div className="mb-3">
      <p className="text-sm font-medium text-[#6b6b80] mb-2">{title}</p>
      <div className="flex flex-wrap gap-2">
        {keywords.map((kw, idx) => (
          <span
            key={idx}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 hover:scale-105 ${
              highlight
                ? "bg-[#C9BEFF]/20 text-[#C9BEFF] border-[#C9BEFF]/40 shadow-[0_0_10px_rgba(201,190,255,0.1)]"
                : "bg-[#2a2a3c]/50 text-[#a0a0a8] border-[#3a3a4c] hover:border-[#6b6b80]"
            }`}
          >
            {kw}
          </span>
        ))}
      </div>
    </div>
  );
};

/* =========================
   Main Component
========================= */
export default function MetaCampaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/meta/my-meta-campaigns")
      .then((res) => {
        setCampaigns(res.data.campaigns || []);
      })
      .catch((err) => {
        setError(err.response?.data?.detail || "Failed to load campaigns");
      })
      .finally(() => setLoading(false));
  }, []);

  const normalizeAdsPreview = (ads_preview) => {
    if (!ads_preview) return null;

    if (typeof ads_preview === "string") {
      try {
        return JSON.parse(ads_preview);
      } catch {
        return null;
      }
    }

    return ads_preview;
  };

  /* =========================
     States
  ========================= */
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-48 sm:h-64">
        <div className="w-10 h-10 border-2 border-[#C9BEFF]/30 border-t-[#C9BEFF] rounded-full animate-spin mb-4"></div>
        <p className="text-[#6b6b80] text-sm animate-pulse">Loading campaigns...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6 bg-red-500/10 border border-red-500/30 rounded-2xl">
        <div className="flex items-center gap-3 text-red-400">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="font-medium">{error}</p>
        </div>
      </div>
    );
  }

  if (campaigns.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 sm:h-96 bg-[#12121a]/40 border border-[#2a2a3c] rounded-2xl">
        <div className="w-16 h-16 bg-[#2a2a3c] rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-[#6b6b80]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <p className="text-[#6b6b80] text-lg font-medium">No Meta campaigns created yet</p>
        <p className="text-[#4a4a60] text-sm mt-2">Create your first campaign to get started</p>
      </div>
    );
  }

  /* =========================
     Render
  ========================= */
  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-1">
            My Meta Campaigns
          </h2>
          <p className="text-[#6b6b80] text-sm">
            Manage and track your advertising campaigns
          </p>
        </div>
        <div className="px-4 py-2 bg-[#2a2a3c] rounded-lg border border-[#3a3a4c]">
          <span className="text-[#C9BEFF] font-medium text-sm">
            {campaigns.length} {campaigns.length === 1 ? 'Campaign' : 'Campaigns'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4 sm:gap-6">
        {campaigns.map((c, idx) => {
          const adsPreview = normalizeAdsPreview(c.ads_preview);
          const isFailed = c.meta_publish_result?.status === "failed";

          return (
            <div
              key={idx}
              className="group bg-[#12121a]/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-[#1e1e2d] hover:border-[#C9BEFF]/30 transition-all duration-300 hover:shadow-[0_0_40px_rgba(201,190,255,0.08)] hover:-translate-y-1"
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-base sm:text-lg text-white truncate group-hover:text-[#C9BEFF] transition-colors duration-300">
                    {c.campaign_name}
                  </h3>
                  <p className="text-sm text-[#6b6b80] mt-1 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    {c.page_name}
                  </p>
                </div>

                <span
                  className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shrink-0 ${
                    isFailed
                      ? "bg-red-500/15 text-red-400 border border-red-500/30"
                      : "bg-green-500/15 text-green-400 border border-green-500/30"
                  }`}
                >
                  {isFailed ? (
                    <>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      FAILED
                    </>
                  ) : (
                    <>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      SUCCESS
                    </>
                  )}
                </span>
              </div>

              {/* Ad Preview */}
              {adsPreview?.headline && adsPreview?.description && (
                <div className="p-3 sm:p-4 bg-[#0a0a0f]/60 rounded-xl mb-4 border border-[#2a2a3c] group-hover:border-[#3a3a4c] transition-colors duration-300">
                  <div className="flex items-center gap-2 mb-3">
                    <svg className="w-4 h-4 text-[#C9BEFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span className="text-xs font-medium text-[#C9BEFF] uppercase tracking-wider">Ad Preview</span>
                  </div>
                  <p className="text-sm text-white font-medium mb-1">
                    {adsPreview.headline}
                  </p>
                  <p className="text-sm text-[#a0a0a8] leading-relaxed">
                    {adsPreview.description}
                  </p>
                </div>
              )}

              {/* Keywords */}
              {c.keywords && (
                <div className="mb-4 p-3 sm:p-4 bg-[#0a0a0f]/40 rounded-xl border border-[#2a2a3c]/50">
                  <KeywordSection
                    title="Primary Keyword"
                    keywords={c.keywords.primary}
                    highlight
                  />
                  <KeywordSection
                    title="Secondary Keywords"
                    keywords={c.keywords.secondary}
                  />
                  <KeywordSection
                    title="Long-tail Keywords"
                    keywords={c.keywords.long_tail}
                  />
                </div>
              )}

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
                {/* Compliance */}
                <div className="p-3 bg-[#0a0a0f]/40 rounded-xl border border-[#2a2a3c]">
                  <p className="text-xs text-[#6b6b80] uppercase tracking-wider mb-1">Compliance</p>
                  <div className="flex items-center gap-2">
                    {c.compliance?.compliance_pass ? (
                      <>
                        <div className="w-2 h-2 bg-green-400 rounded-full shadow-[0_0_8px_rgba(74,222,128,0.5)]"></div>
                        <span className="font-bold text-green-400">PASS</span>
                      </>
                    ) : (
                      <>
                        <div className="w-2 h-2 bg-red-400 rounded-full shadow-[0_0_8px_rgba(248,113,113,0.5)]"></div>
                        <span className="font-bold text-red-400">FAIL</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Quality Score */}
                <div className="p-3 bg-[#0a0a0f]/40 rounded-xl border border-[#2a2a3c]">
                  <p className="text-xs text-[#6b6b80] uppercase tracking-wider mb-1">Quality Score</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-[#C9BEFF]">
                      {c.quality?.quality_score ?? "—"}
                    </span>
                    <span className="text-xs text-[#6b6b80]">/ 100</span>
                  </div>
                  {/* Mini progress bar */}
                  {c.quality?.quality_score && (
                    <div className="mt-2 h-1.5 bg-[#2a2a3c] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-[#C9BEFF] to-[#a89fe8] rounded-full transition-all duration-1000"
                        style={{ width: `${c.quality.quality_score}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-[#2a2a3c]">
                <div className="flex items-center gap-2 text-[#4a4a60]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-xs">
                    {new Date(c.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
                <span className="text-xs text-[#4a4a60]">
                  {new Date(c.created_at).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}