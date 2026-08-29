"use client";

import { Card, Input, Button, Checkbox } from "antd";
import {
  UserOutlined,
  LockOutlined,
  SafetyCertificateOutlined,
  LoginOutlined,
  ArrowLeftOutlined
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import axios from "axios";

export default function AdminLogin() {
  const router = useRouter();

  const [email, SetEmail] = useState("");
  const [password, SetPassword] = useState("");
  const [loading, setLoading] = useState(false);

  let handleAdminEmail = (e) => {
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
        "http://localhost:5000/api/Admin/login",
        {
          email,
          password,
        },
      );

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("admin", JSON.stringify(response.data.admin));

        alert("Login Successful");

        router.push("/admin1/dashboard");
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center overflow-hidden p-6"
      style={{
        backgroundImage: "url('/abi.png')",
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[2px] z-0"></div>

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
          backdropFilter: "blur-24px)",
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
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-rose-500/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Header */}
        <div className="text-center mb-8 relative z-10">
          <div className="mb-4 inline-block p-2 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md shadow-inner">
            <img src="/Logo.png" alt="Logo" className="h-10 w-auto object-contain" />
          </div>

          <h1 className="text-2xl font-extrabold text-white tracking-tight leading-tight flex items-center justify-center gap-2">
            <SafetyCertificateOutlined className="text-rose-500 text-xl" />
            <span>Admin Portal</span>
          </h1>

          <p className="text-slate-400 text-xs mt-1.5">Sign in to access your administrative actions</p>
        </div>

        {/* Email */}
        <div className="space-y-4 relative z-10">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Admin Email
            </label>
            <Input
              size="large"
              placeholder="admin@company.com"
              prefix={<UserOutlined className="text-slate-500" />}
              onChange={handleAdminEmail}
              className="h-12 rounded-xl !bg-slate-900/50 !border-white/10 !text-white hover:!border-rose-500/50 focus:!border-rose-500 placeholder-slate-600"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Password
            </label>
            <Input.Password
              size="large"
              placeholder="••••••••"
              prefix={<LockOutlined className="text-slate-500" />}
              onChange={handlePassword}
              className="h-12 rounded-xl !bg-slate-900/50 !border-white/10 !text-white hover:!border-rose-500/50 focus:!border-rose-500 placeholder-slate-600"
            />
          </div>
        </div>

        {/* Remember */}
        <div className="flex justify-between items-center my-6 text-xs relative z-10">
          <Checkbox className="!text-slate-300">Remember Me</Checkbox>

          <button
            className="text-rose-450 hover:text-rose-400 font-semibold transition"
            onClick={() => router.push("/ForgotPassword/Admin")}
          >
            Forgot Password?
          </button>
        </div>

        {/* Login Button */}
        <Button
          type="primary"
          danger
          size="large"
          block
          loading={loading}
          icon={<LoginOutlined />}
          className="!h-12 !rounded-xl !text-base !font-bold !bg-rose-600 hover:!bg-rose-700 hover:!shadow-[0_0_15px_rgba(225,29,72,0.35)] !border-0 transition-all duration-300 relative z-10"
          onClick={handleLogin}
        >
          Sign In as Admin
        </Button>

        {/* Register link */}
        <div className="text-center mt-6 text-xs relative z-10">
          <span className="text-slate-400">Do not have an admin account? </span>
          <Link
            href="/Register/Admin"
            className="text-rose-400 font-bold hover:text-rose-300 hover:underline transition"
          >
            Register Now
          </Link>
        </div>
      </Card>
    </div>
  );
}
