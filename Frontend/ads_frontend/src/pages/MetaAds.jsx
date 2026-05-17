import { useState } from "react";
import api from "../api/axios";

export default function MetaAds() {
  const [form, setForm] = useState({
    account_id: "",
    access_token: "",
    page_id: "",
    page_name: "",
    campaign_name: "",
    budget: "",
    location: "",
    start_time: "",
    end_time: "",
    landing_url: "",
    file: null,
  });

  const [errors, setErrors] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  /* -------------------- Handlers -------------------- */

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  /* -------------------- Validation -------------------- */

  const validateForm = () => {
    const newErrors = {};

    // Required fields
    Object.entries(form).forEach(([key, value]) => {
      if (key !== "file" && !value) {
        newErrors[key] = "This field is required";
      }
    });

    // File validation
    if (!form.file) {
      newErrors.file = "Image file is required";
    }

    // Budget validation
    if (form.budget && Number(form.budget) <= 0) {
      newErrors.budget = "Budget must be greater than 0";
    }

    // Date validation
    if (form.start_time && form.end_time) {
      if (new Date(form.start_time) > new Date(form.end_time)) {
        newErrors.end_time = "End date must be after start date";
      }
    }

    // URL validation
    if (form.landing_url) {
      try {
        new URL(form.landing_url);
      } catch {
        newErrors.landing_url = "Invalid URL format";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* -------------------- Submit -------------------- */

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult(null);

    if (!validateForm()) {
      setResult({
        status: "failed",
        error: "Please fix the highlighted errors",
      });
      return;
    }

    setLoading(true);

    const formData = new FormData();
    Object.keys(form).forEach((key) => formData.append(key, form[key]));

    try {
      const res = await api.post("/meta/publish-meta-ads", formData);
      setResult(res.data);
    } catch (err) {
      setResult({
        status: "failed",
        error: err.response?.data?.error || err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  /* -------------------- UI -------------------- */

  return (
    <div className="text-[#e8e8ec]">
      <h2 className="text-2xl font-bold mb-6 text-white tracking-tight">
        Create Meta Ads Campaign
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-2 gap-5 mb-8"
      >
        {[
          ["account_id", "Account ID"],
          ["access_token", "Access Token"],
          ["page_id", "Page ID"],
          ["page_name", "Page Name"],
          ["campaign_name", "Campaign Name"],
          ["location", "Location"],
          ["landing_url", "https://www.example.com"],
        ].map(([name, label]) => (
          <div key={name}>
            <input
              name={name}
              placeholder={label}
              onChange={handleChange}
              className={`p-3.5 bg-[#0a0a0f]/50 border rounded-xl w-full text-white placeholder-[#4a4a60] focus:outline-none focus:ring-2 focus:ring-[#C9BEFF]/40 focus:border-[#C9BEFF]/60 transition-all duration-300 ${
                errors[name] ? "border-red-500/50 bg-red-500/10" : "border-[#2a2a3c]"
              }`}
            />
            {errors[name] && (
              <p className="text-red-400 text-sm mt-1.5">{errors[name]}</p>
            )}
          </div>
        ))}

        {/* Budget */}
        <div>
          <input
            name="budget"
            type="number"
            placeholder="Budget"
            onChange={handleChange}
            className={`p-3.5 bg-[#0a0a0f]/50 border rounded-xl w-full text-white placeholder-[#4a4a60] focus:outline-none focus:ring-2 focus:ring-[#C9BEFF]/40 focus:border-[#C9BEFF]/60 transition-all duration-300 ${
              errors.budget ? "border-red-500/50 bg-red-500/10" : "border-[#2a2a3c]"
            }`}
          />
          {errors.budget && (
            <p className="text-red-400 text-sm mt-1.5">{errors.budget}</p>
          )}
        </div>

        {/* Start Date */}
        <div>
          <label className="block text-sm font-medium text-[#6b6b80] mb-2">
            Start Date
          </label>
          <input
            name="start_time"
            type="date"
            onChange={handleChange}
            className={`p-3.5 bg-[#0a0a0f]/50 border rounded-xl w-full text-white focus:outline-none focus:ring-2 focus:ring-[#C9BEFF]/40 focus:border-[#C9BEFF]/60 transition-all duration-300 ${
              errors.start_time ? "border-red-500/50 bg-red-500/10" : "border-[#2a2a3c]"
            }`}
          />
          {errors.start_time && (
            <p className="text-red-400 text-sm mt-1.5">{errors.start_time}</p>
          )}
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
            className={`p-3.5 bg-[#0a0a0f]/50 border rounded-xl w-full text-white focus:outline-none focus:ring-2 focus:ring-[#C9BEFF]/40 focus:border-[#C9BEFF]/60 transition-all duration-300 ${
              errors.end_time ? "border-red-500/50 bg-red-500/10" : "border-[#2a2a3c]"
            }`}
          />
          {errors.end_time && (
            <p className="text-red-400 text-sm mt-1.5">{errors.end_time}</p>
          )}
        </div>

        {/* File */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-[#6b6b80] mb-2">
            Campaign Image
          </label>
          <input
            name="file"
            type="file"
            onChange={handleChange}
            className={`p-3.5 bg-[#0a0a0f]/50 border rounded-xl w-full text-[#6b6b80] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#2a2a3c] file:text-[#C9BEFF] hover:file:bg-[#3a3a4c] transition-all duration-300 ${
              errors.file ? "border-red-500/50 bg-red-500/10" : "border-[#2a2a3c]"
            }`}
          />
          {errors.file && (
            <p className="text-red-400 text-sm mt-1.5">{errors.file}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="col-span-2 bg-gradient-to-r from-[#C9BEFF] to-[#a89fe8] hover:from-[#b8acfe] hover:to-[#978de0] text-[#0a0a0f] font-bold py-4 rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(201,190,255,0.3)] hover:shadow-[0_0_30px_rgba(201,190,255,0.5)] hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-[#0a0a0f]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Posting...
            </span>
          ) : (
            "Post Campaign"
          )}
        </button>
      </form>

      {/* -------------------- RESULT -------------------- */}

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

          {result.error && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl mb-4">
              <p className="text-red-400 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {result.error}
              </p>
            </div>
          )}

          {result.ads_preview && (
            <div className="p-4 bg-[#0a0a0f]/50 border border-[#2a2a3c] rounded-xl mb-4">
              <p className="text-[#6b6b80] text-sm mb-1">Ad Preview</p>
              <p className="text-white font-medium mb-2">
                <span className="text-[#C9BEFF]">Headline:</span> {result.ads_preview.headline}
              </p>
              <p className="text-[#a0a0a8] text-sm">
                <span className="text-[#C9BEFF]">Description:</span> {result.ads_preview.description}
              </p>
            </div>
          )}

          {result.compliance && (
            <div className="p-4 bg-[#0a0a0f]/50 border border-[#2a2a3c] rounded-xl mb-4 flex items-center justify-between">
              <span className="text-[#6b6b80] font-medium">Compliance Check</span>
              <span
                className={`px-3 py-1.5 rounded-lg font-bold text-sm flex items-center gap-1.5 ${
                  result.compliance.compliance_pass
                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                    : "bg-red-500/20 text-red-400 border border-red-500/30"
                }`}
              >
                {result.compliance.compliance_pass ? (
                  <>PASS <span className="text-lg">✓</span></>
                ) : (
                  <>FAIL <span className="text-lg">✗</span></>
                )}
              </span>
            </div>
          )}

          {result.quality && (
            <div className="p-4 bg-[#0a0a0f]/50 border border-[#2a2a3c] rounded-xl">
              <p className="text-[#6b6b80] text-sm mb-3 font-medium">Quality Score</p>
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20">
                  <svg className="w-20 h-20 transform -rotate-90">
                    <circle
                      cx="40"
                      cy="40"
                      r="36"
                      stroke="#2a2a3c"
                      strokeWidth="6"
                      fill="none"
                    />
                    <circle
                      cx="40"
                      cy="40"
                      r="36"
                      stroke="#C9BEFF"
                      strokeWidth="6"
                      fill="none"
                      strokeDasharray={`${(result.quality.quality_score / 100) * 226} 226`}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-[#C9BEFF]">
                      {result.quality.quality_score}
                    </span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="h-2 bg-[#2a2a3c] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#C9BEFF] to-[#a89fe8] rounded-full transition-all duration-1000"
                      style={{ width: `${result.quality.quality_score}%` }}
                    ></div>
                  </div>
                  <p className="text-[#6b6b80] text-sm mt-2">out of 100</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}