"use client";

import { Card, Input, Button, Checkbox } from "antd";
import {
  UserOutlined,
  LockOutlined,
  SafetyCertificateOutlined,
  LoginOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import axios from "axios";
export default function AdminLogin() {
  const router = useRouter();

  const [email, SetEmail] = useState("");
  const [password, SetPassword] = useState("");

  let handleAdminEmail = (e) => {
    SetEmail(e.target.value);
  };
  let handlePassword = (e) => {
    SetPassword(e.target.value);
  };

  const handleLogin = async () => {
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
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{
        backgroundImage: "url('/admin-bg.jpg')",
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Login Card */}
      <Card
        className="relative z-10 w-full max-w-md border border-white/20 shadow-2xl"
        style={{
          background: "rgba(255,255,255,0.12)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          borderRadius: "24px",
        }}
        styles={{
          body: {
            padding: "35px",
            background: "transparent",
          },
        }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto rounded-full bg-red-500/20 flex items-center justify-center">
            <SafetyCertificateOutlined
              style={{
                fontSize: 42,
                color: "#ffffff",
              }}
            />
          </div>

          <h1 className="text-3xl font-bold text-white mt-5">Admin Login</h1>

          <p className="text-gray-200 mt-2">
            Sign in to access the Admin Dashboard
          </p>
        </div>

        {/* Email */}
        <Input
          size="large"
          placeholder="Admin Email"
          prefix={<UserOutlined />}
          onChange={handleAdminEmail}
          className="mb-4 h-12 rounded-xl"
        />

        {/* Password */}
        <Input.Password
          size="large"
          placeholder="Password"
          prefix={<LockOutlined />}
          onChange={handlePassword}
          className="mb-4 h-12 rounded-xl"
        />

        {/* Remember */}
        <div className="flex justify-between items-center mb-6">
          <Checkbox className="text-white">Remember Me</Checkbox>

          <button
            className="text-red-300 hover:text-red-200"
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
          icon={<LoginOutlined />}
          className="!h-12 !rounded-xl !text-base !font-semibold"
          onClick={handleLogin}
        >
          Admin Login
        </Button>
        <div className="text-center mt-6">
          <span className="text-white">Do not have an admin account? </span>

          <Link
            href="/Register/Admin"
            className="text-red-300 font-semibold hover:text-red-200 hover:underline"
          >
            Register
          </Link>
        </div>
      </Card>
    </div>
  );
}
