import { useState } from "react";
import { login, forgotPassword } from "../api/auth";
import { saveToken } from "../utils/auth";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password });
      saveToken(res.data.access_token);
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.detail || "Login failed");
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      alert("Please enter your email to reset password");
      return;
    }
    try {
      const res = await forgotPassword(email);
      setMsg(res.data.msg);
    } catch (err) {
      setMsg(err.response?.data?.detail || "Error sending reset email");
    }
  };

  return (
    <div className="fixed inset-0 w-screen h-screen flex items-center justify-center bg-[#0a0a0f] overflow-hidden">
      {/* Velvet gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] via-[#0a0a0f] to-[#16213e] opacity-80"></div>
      
      {/* Floating particles */}
      <div className="absolute top-20 left-20 w-2 h-2 bg-[#C9BEFF]/30 rounded-full animate-pulse"></div>
      <div className="absolute top-40 right-32 w-1 h-1 bg-[#C9BEFF]/40 rounded-full animate-pulse delay-700"></div>
      <div className="absolute bottom-32 left-40 w-1.5 h-1.5 bg-[#C9BEFF]/20 rounded-full animate-pulse delay-1000"></div>
      
      <div className="bg-[#12121a]/90 backdrop-blur-md rounded-3xl border border-[#1e1e2d] p-12 w-[420px] relative z-10 shadow-[0_0_60px_rgba(201,190,255,0.1)]">
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-gradient-to-tr from-[#C9BEFF] via-[#a89fe8] to-[#8B7FD4] rounded-2xl flex items-center justify-center mb-5 shadow-[0_0_30px_rgba(201,190,255,0.3)] rotate-3 hover:rotate-0 transition-transform duration-500">
            <svg className="w-8 h-8 text-[#0a0a0f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-widest uppercase mb-2">SMART-AD SUITE</h2>
          <h3 className="text-xl font-semibold text-[#C9BEFF] tracking-tight">Welcome Back</h3>
          <p className="text-[#6b6b80] text-sm mt-2">Enter your credentials to continue</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col space-y-5">
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4a4a60]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
            </div>
            <input
              type="email"
              placeholder="Email address"
              className="w-full pl-12 pr-5 py-4 rounded-xl border border-[#2a2a3c] bg-[#0a0a0f]/50 focus:bg-[#12121a] focus:outline-none focus:ring-2 focus:ring-[#C9BEFF]/40 focus:border-[#C9BEFF]/60 transition-all duration-300 text-white placeholder-[#4a4a60]"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4a4a60]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <input
              type="password"
              placeholder="Password"
              className="w-full pl-12 pr-5 py-4 rounded-xl border border-[#2a2a3c] bg-[#0a0a0f]/50 focus:bg-[#12121a] focus:outline-none focus:ring-2 focus:ring-[#C9BEFF]/40 focus:border-[#C9BEFF]/60 transition-all duration-300 text-white placeholder-[#4a4a60]"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#C9BEFF] to-[#a89fe8] hover:from-[#b8acfe] hover:to-[#978de0] text-[#0a0a0f] font-bold py-4 rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(201,190,255,0.3)] hover:shadow-[0_0_30px_rgba(201,190,255,0.5)] hover:-translate-y-1 mt-2"
          >
            Sign In
          </button>
        </form>

        <div className="flex justify-center mt-4">
          <button 
            onClick={handleForgotPassword}
            className="text-sm text-[#4a4a60] hover:text-[#C9BEFF] transition-colors duration-200 underline-offset-4 hover:underline"
          >
            Forgot your password?
          </button>
        </div>

        {msg && (
          <div className="mt-5 p-4 bg-[#C9BEFF]/10 border border-[#C9BEFF]/30 rounded-xl">
            <p className="text-sm text-[#C9BEFF] text-center font-medium">{msg}</p>
          </div>
        )}

        <div className="mt-8 text-center">
          <p className="text-sm text-[#4a4a60]">
            New here?{" "}
            <Link className="text-[#C9BEFF] hover:text-[#d4ccff] font-semibold transition-colors" to="/signup">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}