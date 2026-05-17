import { useState } from "react";
import api from "../api/axios";

const REQUIRED_FIELDS = [
  "developer_token",
  "client_id",
  "client_secret",
  "refresh_token",
  "customer_id",
  "campaign_name",
  "budget_micros",
  "landing_url",
  "target_region",
  "start_time",
  "end_time"
];

export default function GoogleAds() {
  const [form, setForm] = useState({
    developer_token: "",
    client_id: "",
    client_secret: "",
    refresh_token: "",
    customer_id: "",
    login_customer_id: "",
    campaign_name: "",
    budget_micros: "",
    landing_url: "",
    target_region: "",
    start_time: "",
    end_time: "",
    file: null,
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const validateForm = () => {
    const missing = REQUIRED_FIELDS.filter(
      (field) => !form[field] || form[field] === ""
    );

    if (missing.length > 0) {
      return {
        status: "failed",
        error: `Missing required fields: ${missing.join(", ")}`
      };
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    const validationError = validateForm();
    if (validationError) {
      setResult(validationError);
      setLoading(false);
      return;
    }

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value !== "" && value !== null) {
        formData.append(key, value);
      }
    });

    try {
      const res = await api.post("/google/publish-google-ads", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(res.data);
    } catch (err) {
      setResult({
        status: "failed",
        error:
          err.response?.data?.detail ||
          err.response?.data?.error ||
          "Google Ads API error (Invalid token or permission denied)",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-[#e8e8ec]">
      <h2 className="text-2xl font-bold mb-6 text-white tracking-tight">
        Create Google Ads Campaign
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-2 gap-5 mb-8"
      >
        {/* API Credentials Section */}
        <div className="col-span-2 mb-2">
          <p className="text-sm font-medium text-[#6b6b80] uppercase tracking-wider mb-4 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
            API Credentials
          </p>
        </div>

        <input
          name="developer_token"
          placeholder="Developer Token"
          onChange={handleChange}
          className="p-3.5 bg-[#0a0a0f]/50 border border-[#2a2a3c] rounded-xl text-white placeholder-[#4a4a60] focus:outline-none focus:ring-2 focus:ring-[#C9BEFF]/40 focus:border-[#C9BEFF]/60 transition-all duration-300"
        />
        <input
          name="client_id"
          placeholder="Client ID"
          onChange={handleChange}
          className="p-3.5 bg-[#0a0a0f]/50 border border-[#2a2a3c] rounded-xl text-white placeholder-[#4a4a60] focus:outline-none focus:ring-2 focus:ring-[#C9BEFF]/40 focus:border-[#C9BEFF]/60 transition-all duration-300"
        />
        <input
          name="client_secret"
          placeholder="Client Secret"
          onChange={handleChange}
          className="p-3.5 bg-[#0a0a0f]/50 border border-[#2a2a3c] rounded-xl text-white placeholder-[#4a4a60] focus:outline-none focus:ring-2 focus:ring-[#C9BEFF]/40 focus:border-[#C9BEFF]/60 transition-all duration-300"
        />
        <input
          name="refresh_token"
          placeholder="Refresh Token"
          onChange={handleChange}
          className="p-3.5 bg-[#0a0a0f]/50 border border-[#2a2a3c] rounded-xl text-white placeholder-[#4a4a60] focus:outline-none focus:ring-2 focus:ring-[#C9BEFF]/40 focus:border-[#C9BEFF]/60 transition-all duration-300"
        />

        {/* Account Info Section */}
        <div className="col-span-2 mt-4 mb-2">
          <p className="text-sm font-medium text-[#6b6b80] uppercase tracking-wider mb-4 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Account Information
          </p>
        </div>

        <input
          name="customer_id"
          placeholder="Customer ID"
          onChange={handleChange}
          className="p-3.5 bg-[#0a0a0f]/50 border border-[#2a2a3c] rounded-xl text-white placeholder-[#4a4a60] focus:outline-none focus:ring-2 focus:ring-[#C9BEFF]/40 focus:border-[#C9BEFF]/60 transition-all duration-300"
        />
        <input
          name="login_customer_id"
          placeholder="Login Customer ID (Optional)"
          onChange={handleChange}
          className="p-3.5 bg-[#0a0a0f]/50 border border-[#2a2a3c] rounded-xl text-white placeholder-[#4a4a60] focus:outline-none focus:ring-2 focus:ring-[#C9BEFF]/40 focus:border-[#C9BEFF]/60 transition-all duration-300"
        />

        {/* Campaign Details Section */}
        <div className="col-span-2 mt-4 mb-2">
          <p className="text-sm font-medium text-[#6b6b80] uppercase tracking-wider mb-4 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
            Campaign Details
          </p>
        </div>

        <input
          name="campaign_name"
          placeholder="Campaign Name"
          onChange={handleChange}
          className="p-3.5 bg-[#0a0a0f]/50 border border-[#2a2a3c] rounded-xl text-white placeholder-[#4a4a60] focus:outline-none focus:ring-2 focus:ring-[#C9BEFF]/40 focus:border-[#C9BEFF]/60 transition-all duration-300"
        />
        <input
          name="budget_micros"
          type="number"
          placeholder="Budget (micros)"
          onChange={handleChange}
          className="p-3.5 bg-[#0a0a0f]/50 border border-[#2a2a3c] rounded-xl text-white placeholder-[#4a4a60] focus:outline-none focus:ring-2 focus:ring-[#C9BEFF]/40 focus:border-[#C9BEFF]/60 transition-all duration-300"
        />

        <input
          name="landing_url"
          placeholder="Landing URL"
          onChange={handleChange}
          className="col-span-2 p-3.5 bg-[#0a0a0f]/50 border border-[#2a2a3c] rounded-xl text-white placeholder-[#4a4a60] focus:outline-none focus:ring-2 focus:ring-[#C9BEFF]/40 focus:border-[#C9BEFF]/60 transition-all duration-300"
        />
        <input
          name="target_region"
          placeholder="Target Region (US, PK)"
          onChange={handleChange}
          className="col-span-2 p-3.5 bg-[#0a0a0f]/50 border border-[#2a2a3c] rounded-xl text-white placeholder-[#4a4a60] focus:outline-none focus:ring-2 focus:ring-[#C9BEFF]/40 focus:border-[#C9BEFF]/60 transition-all duration-300"
        />

        {/* Start Date */}
        <div>
          <label className="block text-sm font-medium text-[#6b6b80] mb-2">
            Start Date
          </label>
          <input
            name="start_time"
            type="date"
            onChange={handleChange}
            className="p-3.5 bg-[#0a0a0f]/50 border border-[#2a2a3c] rounded-xl w-full text-white focus:outline-none focus:ring-2 focus:ring-[#C9BEFF]/40 focus:border-[#C9BEFF]/60 transition-all duration-300"
          />
        </div>

        {/* End Date */}
        <div>
          <label className="block text-sm font-medium text-[#6b6b80] mb-2">
            End Date
          </label>
          <input
            name="end_time"
            type="date"
            onChange={handleChange}
            className="p-3.5 bg-[#0a0a0f]/50 border border-[#2a2a3c] rounded-xl w-full text-white focus:outline-none focus:ring-2 focus:ring-[#C9BEFF]/40 focus:border-[#C9BEFF]/60 transition-all duration-300"
          />
        </div>

        {/* File Upload */}
        <div className="col-span-2 mt-2">
          <label className="block text-sm font-medium text-[#6b6b80] mb-2">
            Campaign Image
          </label>
          <input
            name="file"
            type="file"
            onChange={handleChange}
            className="p-3.5 bg-[#0a0a0f]/50 border border-[#2a2a3c] rounded-xl w-full text-[#6b6b80] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#2a2a3c] file:text-[#C9BEFF] hover:file:bg-[#3a3a4c] transition-all duration-300"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="col-span-2 bg-gradient-to-r from-[#C9BEFF] to-[#a89fe8] hover:from-[#b8acfe] hover:to-[#978de0] text-[#0a0a0f] font-bold py-4 rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(201,190,255,0.3)] hover:shadow-[0_0_30px_rgba(201,190,255,0.5)] hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0 disabled:cursor-not-allowed mt-4"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-[#0a0a0f]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Publishing...
            </span>
          ) : (
            "Publish Google Ad"
          )}
        </button>
      </form>

      {/* RESULT */}
      {result && (
        <div className="bg-[#12121a]/80 backdrop-blur-md border border-[#1e1e2d] shadow-[0_0_40px_rgba(201,190,255,0.05)] p-6 rounded-2xl">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            Result:
            <span
              className={`px-3 py-1 rounded-full text-sm font-bold ${
                result.status === "success"
                  ? "bg-green-500/20 text-green-400 border border-green-500/30"
                  : "bg-red-500/20 text-red-400 border border-red-500/30"
              }`}
            >
              {result.status === "success" ? "SUCCESS ✓" : "FAILED ✗"}
            </span>
          </h3>

          {/* ERROR MESSAGE */}
          {result.status === "failed" && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl mb-4">
              <p className="text-red-400 flex items-center gap-2 mb-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-semibold">Google Ads Error</span>
              </p>

              {result.google_publish_result?.errors?.length > 0 ? (
                <ul className="list-disc list-inside text-sm text-red-300 space-y-1 ml-1">
                  {result.google_publish_result.errors.map((e, i) => (
                    <li key={i}>{e.message}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-red-300 text-sm">Unknown error occurred while publishing the ad.</p>
              )}
            </div>
          )}

          {/* PREVIEW */}
          {result.ads_preview && (
            <div className="space-y-4">
              <div className="p-4 bg-[#0a0a0f]/60 border border-[#2a2a3c] rounded-xl">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-4 h-4 text-[#C9BEFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span className="text-xs font-medium text-[#C9BEFF] uppercase tracking-wider">Ad Preview</span>
                </div>
                <p className="text-white font-medium mb-1">
                  <span className="text-[#6b6b80]">Headline:</span> {result.ads_preview.headline}
                </p>
                <p className="text-[#a0a0a8] text-sm">
                  <span className="text-[#6b6b80]">Description:</span> {result.ads_preview.description}
                </p>
              </div>

              {result.ads_preview.all_headlines?.length > 0 && (
                <div className="p-4 bg-[#0a0a0f]/40 border border-[#2a2a3c] rounded-xl">
                  <p className="text-xs font-medium text-[#6b6b80] uppercase tracking-wider mb-3">All Headlines</p>
                  <ul className="space-y-2">
                    {result.ads_preview.all_headlines.map((h, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-[#e8e8ec]">
                        <span className="w-1.5 h-1.5 bg-[#C9BEFF] rounded-full"></span>
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {result.ads_preview.all_descriptions?.length > 0 && (
                <div className="p-4 bg-[#0a0a0f]/40 border border-[#2a2a3c] rounded-xl">
                  <p className="text-xs font-medium text-[#6b6b80] uppercase tracking-wider mb-3">All Descriptions</p>
                  <ul className="space-y-2">
                    {result.ads_preview.all_descriptions.map((d, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-[#a0a0a8]">
                        <span className="w-1.5 h-1.5 bg-[#6b6b80] rounded-full"></span>
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* TIME */}
          {(result.start_time || result.end_time) && (
            <div className="mt-6 pt-4 border-t border-[#2a2a3c] flex gap-6 text-sm">
              {result.start_time && (
                <p className="text-[#6b6b80] flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Start: <span className="text-[#C9BEFF]">{result.start_time}</span></span>
                </p>
              )}
              {result.end_time && (
                <p className="text-[#6b6b80] flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>End: <span className="text-[#C9BEFF]">{result.end_time}</span></span>
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}