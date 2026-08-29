"use client";

import { Card, Input, Button, Checkbox } from "antd";
import { UserOutlined, LockOutlined, LoginOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import axios from "axios";

export default function UserLogin() {
  const router = useRouter();

  const [email, SetEmail] = useState("");
  const [password, SetPassword] = useState("");
  const [loading, setLoading] = useState(false);

  let handleUserEmail = (e) => {
    SetEmail(e.target.value);
  };
  let handlePassword = (e) => {
    SetPassword(e.target.value);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/Employee/login",
        {
          email,
          password,
        },
      );

      if (response.data.success) {
        alert(response.data.message);

        localStorage.setItem(
          "employee",
          JSON.stringify(response.data.employee),
        );

        router.push("/User1/dashboard");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center overflow-hidden p-6"
      style={{
        backgroundImage: "url('/ubi.png')",
      }}
    >
      {/* Premium Dark Overlay */}
      <div className="absolute inset-0 bg-slate-950/65 backdrop-blur-[2px] z-0"></div>

      {/* Back Button */}
      <button
        onClick={() => router.push("/login")}
        className="absolute top-6 left-6 z-10 flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all text-xs font-semibold backdrop-blur-md shadow-sm"
      >
        <ArrowLeftOutlined />
        <span>Back to Portal selection</span>
      </button>

      {/* Login Card */}
      <Card
        className="relative z-10 w-full max-w-md border border-white/10 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-700"
        style={{
          background: "rgba(15, 23, 42, 0.6)",
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
        {/* Glow Element */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-sky-500/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Header */}
        <div className="text-center mb-8 relative z-10">
          <div className="mb-4 inline-block p-2 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md shadow-inner">
            <img src="/Logo.png" alt="Logo" className="h-10 w-auto object-contain" />
          </div>

          <h1 className="text-2xl font-extrabold text-white tracking-tight leading-tight flex items-center justify-center gap-2">
            <UserOutlined className="text-sky-400 text-xl" />
            <span>User Portal</span>
          </h1>

          <p className="text-slate-400 text-xs mt-1.5">Sign in to access your projects and updates</p>
        </div>

        {/* Inputs */}
        <div className="space-y-4 relative z-10">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <Input
              size="large"
              placeholder="name@company.com"
              prefix={<UserOutlined className="text-slate-500" />}
              onChange={handleUserEmail}
              className="h-12 rounded-xl !bg-slate-900/50 !border-white/10 !text-white hover:!border-sky-500/50 focus:!border-sky-500 placeholder-slate-600"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Password
            </label>
            <Input.Password
              size="large"
              placeholder="••••••••"
              prefix={<LockOutlined className="text-slate-500" />}
              onChange={handlePassword}
              className="h-12 rounded-xl !bg-slate-900/50 !border-white/10 !text-white hover:!border-sky-500/50 focus:!border-sky-500 placeholder-slate-600"
            />
          </div>
        </div>

        {/* Remember & Forgot */}
        <div className="flex justify-between items-center my-6 text-xs relative z-10">
          <Checkbox className="!text-slate-300">Remember Me</Checkbox>

          <button
            className="text-sky-400 hover:text-sky-300 font-semibold transition"
            onClick={() => router.push("/ForgotPassword/User")}
          >
            Forgot Password?
          </button>
        </div>

        {/* Login Button */}
        <Button
          type="primary"
          size="large"
          block
          loading={loading}
          icon={<LoginOutlined />}
          className="!h-12 !rounded-xl !text-base !font-bold !bg-sky-500 hover:!bg-sky-600 hover:!shadow-[0_0_15px_rgba(14,165,233,0.35)] !border-0 transition-all duration-300 relative z-10"
          onClick={handleLogin}
        >
          Sign In
        </Button>

        {/* Register Section */}
        <div className="text-center mt-6 text-xs relative z-10">
          <span className="text-slate-400">Do not have an account? </span>
          <Link
            href="/Register/User"
            className="text-sky-400 font-bold hover:text-sky-300 hover:underline transition"
          >
            Register Now
          </Link>
        </div>
      </Card>
    </div>
  );
}
