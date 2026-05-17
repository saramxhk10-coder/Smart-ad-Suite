// import { useEffect, useState } from "react";
// import api from "../api/axios";

// export default function GoogleCampaigns() {
//   const [campaigns, setCampaigns] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     api
//       .get("/google/my-google-campaigns")
//       .then((res) => {
//         setCampaigns(res.data.campaigns || []);
//       })
//       .catch((err) => {
//         setError(err.response?.data?.detail || "Failed to load campaigns");
//       })
//       .finally(() => setLoading(false));
//   }, []);

//   if (loading) return <p className="text-gray-600">Loading campaigns...</p>;
//   if (error) return <p className="text-red-500">{error}</p>;

//   if (campaigns.length === 0) {
//     return (
//       <div className="bg-white p-6 rounded shadow text-center text-gray-600">
//         No Google campaigns created yet.
//       </div>
//     );
//   }

//   return (
//     <div>
//       <h2 className="text-xl font-bold mb-6 text-black">
//         My Google Campaigns
//       </h2>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {campaigns.map((c, idx) => (
//           <div
//             key={idx}
//             className="bg-white rounded-xl shadow p-5 border hover:shadow-lg transition"
//           >
//             {/* Header */}
//             <div className="flex justify-between items-center mb-3">
//               <h3 className="font-bold text-lg text-black">
//                 {c.campaign_name}
//               </h3>

//               <span
//                 className={`px-3 py-1 rounded-full text-sm font-semibold ${
//                   c.status === "success"
//                     ? "bg-green-100 text-green-600"
//                     : "bg-red-100 text-red-600"
//                 }`}
//               >
//                 {c.status?.toUpperCase()}
//               </span>
//             </div>

//             {/* Ad Preview */}
//             {c.preview && (
//               <div className="bg-gray-50 p-3 rounded mb-3 text-black">
//                 <p className="text-sm">
//                   <strong>Headline:</strong> {c.preview.headline}
//                 </p>
//                 <p className="text-sm">
//                   <strong>Description:</strong> {c.preview.description}
//                 </p>
//               </div>
//             )}

//             {/* Budget */}
//             <p className="text-sm text-gray-600">
//               <strong>Budget (micros):</strong> {c.budget_micros}
//             </p>

//             {/* Created */}
//             <p className="text-xs text-gray-400 mt-3">
//               Created: {new Date(c.created_at).toLocaleString()}
//             </p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }




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
export default function GoogleCampaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/google/my-google-campaigns")
      .then((res) => {
        setCampaigns(res.data.campaigns || []);
      })
      .catch((err) => {
        setError(err.response?.data?.detail || "Failed to load campaigns");
      })
      .finally(() => setLoading(false));
  }, []);

  /* =========================
     States
  ========================= */
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="w-10 h-10 border-2 border-[#C9BEFF]/30 border-t-[#C9BEFF] rounded-full animate-spin mb-4"></div>
        <p className="text-[#6b6b80] text-sm animate-pulse">Loading campaigns...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-500/10 border border-red-500/30 rounded-2xl">
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
      <div className="flex flex-col items-center justify-center h-96 bg-[#12121a]/40 border border-[#2a2a3c] rounded-2xl">
        <div className="w-16 h-16 bg-[#2a2a3c] rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-[#6b6b80]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <p className="text-[#6b6b80] text-lg font-medium">No Google campaigns created yet</p>
        <p className="text-[#4a4a60] text-sm mt-2">Create your first campaign to get started</p>
      </div>
    );
  }

  /* =========================
     Render
  ========================= */
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight mb-1">
            My Google Campaigns
          </h2>
          <p className="text-[#6b6b80] text-sm">
            Manage and track your Google advertising campaigns
          </p>
        </div>
        <div className="px-4 py-2 bg-[#2a2a3c] rounded-lg border border-[#3a3a4c]">
          <span className="text-[#C9BEFF] font-medium text-sm">
            {campaigns.length} {campaigns.length === 1 ? 'Campaign' : 'Campaigns'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {campaigns.map((c, idx) => {
          const isFailed = c.status === "failed" || c.status === "error";

          return (
            <div
              key={idx}
              className="group bg-[#12121a]/80 backdrop-blur-sm rounded-2xl p-6 border border-[#1e1e2d] hover:border-[#C9BEFF]/30 transition-all duration-300 hover:shadow-[0_0_40px_rgba(201,190,255,0.08)] hover:-translate-y-1"
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg text-white truncate group-hover:text-[#C9BEFF] transition-colors duration-300">
                    {c.campaign_name}
                  </h3>
                  <p className="text-sm text-[#6b6b80] mt-1 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Google Ads
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

              {/* PRIMARY PREVIEW */}
              {c.preview && (
                <div className="p-4 bg-[#0a0a0f]/60 rounded-xl mb-4 border border-[#2a2a3c] group-hover:border-[#3a3a4c] transition-colors duration-300">
                  <div className="flex items-center gap-2 mb-3">
                    <svg className="w-4 h-4 text-[#C9BEFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span className="text-xs font-medium text-[#C9BEFF] uppercase tracking-wider">Primary Preview</span>
                  </div>
                  <p className="text-sm text-white font-medium mb-1">
                    {c.preview.headline}
                  </p>
                  <p className="text-sm text-[#a0a0a8] leading-relaxed">
                    {c.preview.description}
                  </p>
                </div>
              )}

              {/* ALL HEADLINES */}
              {c.preview?.all_headlines?.length > 0 && (
                <div className="mb-4 p-4 bg-[#0a0a0f]/40 rounded-xl border border-[#2a2a3c]/50">
                  <p className="text-xs font-medium text-[#6b6b80] uppercase tracking-wider mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                    All Headlines
                  </p>
                  <ul className="space-y-2">
                    {c.preview.all_headlines.map((h, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-[#e8e8ec]">
                        <span className="w-1.5 h-1.5 bg-[#C9BEFF] rounded-full"></span>
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* ALL DESCRIPTIONS */}
              {c.preview?.all_descriptions?.length > 0 && (
                <div className="mb-4 p-4 bg-[#0a0a0f]/40 rounded-xl border border-[#2a2a3c]/50">
                  <p className="text-xs font-medium text-[#6b6b80] uppercase tracking-wider mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h7" />
                    </svg>
                    All Descriptions
                  </p>
                  <ul className="space-y-2">
                    {c.preview.all_descriptions.map((d, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-[#a0a0a8]">
                        <span className="w-1.5 h-1.5 bg-[#6b6b80] rounded-full"></span>
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

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