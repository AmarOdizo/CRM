"use client";

import { Card, Button } from "antd";
import {
  UserOutlined,
  TeamOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login() {
  const router = useRouter();
  const [role, setRole] = useState("");

  const handleContinue = () => {
    if (role === "user") {
      router.push("/User");
    } else if (role === "admin") {
      router.push("/Admin");
    }
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center p-6 bg-cover bg-center overflow-hidden"
      style={{
        backgroundImage: "url('/Loginbg.jpg')",
      }}
    >
      {/* Premium Dark Overlay */}
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[3px] z-0"></div>

      <Card
        className="relative z-10 w-full max-w-md border border-white/10 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-700"
        style={{
          background: "rgba(15, 23, 42, 0.55)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderRadius: "28px",
        }}
        styles={{
          body: {
            padding: "40px 32px",
            background: "transparent",
          },
        }}
      >
        {/* Glowing Decorative Element */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-sky-500/25 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Header with Logo */}
        <div className="text-center mb-8 relative z-10">
          <div className="mb-4 inline-block p-2 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md shadow-inner">
            <img src="/Logo.png" alt="Logo" className="h-16 w-auto object-contain" />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight leading-tight">
            Client & Project
          </h1>
          <h2 className="text-base font-bold text-sky-400 mt-0.5 tracking-wide uppercase text-[11px]">
            Management System
          </h2>
          <p className="text-slate-400 text-xs mt-2">Select your account type to sign in</p>
        </div>

        {/* Selection Cards */}
        <div className="space-y-4 relative z-10">
          {/* User Card */}
          <div
            onClick={() => setRole("user")}
            className={`group cursor-pointer rounded-2xl border p-5 transition-all duration-300 flex items-center justify-between ${
              role === "user"
                ? "border-sky-500 bg-sky-500/15 shadow-[0_0_20px_rgba(14,165,233,0.15)] scale-[1.02]"
                : "border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/15"
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-300 ${
                role === "user" ? "bg-sky-500 text-white" : "bg-white/5 text-slate-400 group-hover:text-slate-200"
              }`}>
                <UserOutlined className="text-xl" />
              </div>
              <div className="text-left">
                <h3 className="text-base font-bold text-white leading-snug">User</h3>
                <p className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors mt-0.5">
                  Access projects & daily updates
                </p>
              </div>
            </div>
            <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
              role === "user" ? "border-sky-500 bg-sky-500 scale-110" : "border-white/20"
            }`}>
              {role === "user" && <div className="w-2 h-2 bg-white rounded-full"></div>}
            </div>
          </div>

          {/* Admin Card */}
          <div
            onClick={() => setRole("admin")}
            className={`group cursor-pointer rounded-2xl border p-5 transition-all duration-300 flex items-center justify-between ${
              role === "admin"
                ? "border-emerald-500 bg-emerald-500/15 shadow-[0_0_20px_rgba(16,185,129,0.15)] scale-[1.02]"
                : "border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/15"
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-300 ${
                role === "admin" ? "bg-emerald-500 text-white" : "bg-white/5 text-slate-400 group-hover:text-slate-200"
              }`}>
                <TeamOutlined className="text-xl" />
              </div>
              <div className="text-left">
                <h3 className="text-base font-bold text-white leading-snug">Admin</h3>
                <p className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors mt-0.5">
                  Manage operations & team members
                </p>
              </div>
            </div>
            <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
              role === "admin" ? "border-emerald-500 bg-emerald-500 scale-110" : "border-white/20"
            }`}>
              {role === "admin" && <div className="w-2 h-2 bg-white rounded-full"></div>}
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <div className="mt-8 relative z-10">
          <Button
            type="primary"
            block
            size="large"
            disabled={!role}
            onClick={handleContinue}
            className={`!h-12 !rounded-xl !font-bold transition-all duration-300 flex items-center justify-center gap-2 border-0 ${
              role === "user"
                ? "!bg-sky-500 hover:!bg-sky-600 hover:!shadow-[0_0_15px_rgba(14,165,233,0.3)] !text-white"
                : role === "admin"
                ? "!bg-emerald-500 hover:!bg-emerald-600 hover:!shadow-[0_0_15px_rgba(16,185,129,0.3)] !text-white"
                : "!bg-slate-800 !text-slate-500 cursor-not-allowed"
            }`}
          >
            <span>Continue to Sign In</span>
            <ArrowRightOutlined className="text-sm mt-0.5" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
