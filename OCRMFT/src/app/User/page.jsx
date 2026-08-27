"use client";

import { Card, Input, Button, Checkbox } from "antd";
import { UserOutlined, LockOutlined, LoginOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import axios from "axios";

export default function UserLogin() {
  const router = useRouter();

  const [email, SetEmail] = useState("");
  const [password, SetPassword] = useState("");

  let handleUserEmail = (e) => {
    SetEmail(e.target.value);
  };
  let handlePassword = (e) => {
    SetPassword(e.target.value);
  };

  const handleLogin = async () => {
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
    }
  };
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: "url('/login-bg.jpg')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

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
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto rounded-full bg-white/20 flex items-center justify-center">
            <UserOutlined
              style={{
                fontSize: 40,
                color: "#fff",
              }}
            />
          </div>

          <h1 className="text-3xl font-bold text-white mt-5">User Login</h1>

          <p className="text-gray-200 mt-2">Welcome back! Please login.</p>
        </div>

        <Input
          size="large"
          placeholder="User Email Address"
          prefix={<UserOutlined />}
          onChange={handleUserEmail}
          className="mb-4 h-12 rounded-xl"
        />

        <Input.Password
          size="large"
          placeholder="Password"
          prefix={<LockOutlined />}
          onChange={handlePassword}
          className="mb-4 h-12 rounded-xl"
        />

        <div className="flex justify-between items-center mb-6 text-white">
          <Checkbox className="text-white">Remember Me</Checkbox>

          <button
            className="text-blue-300 hover:text-blue-200"
            onClick={() => router.push("/ForgotPassword/User")}
          >
            Forgot Password?
          </button>
        </div>

        <Button
          type="primary"
          size="large"
          block
          icon={<LoginOutlined />}
          className="!h-12 !rounded-xl !text-base !font-semibold"
          onClick={handleLogin}
        >
          Login
        </Button>

        <div className="text-center mt-6">
          <span className="text-white">Do not have an account? </span>

          <Link
            href="/Register/User"
            className="text-blue-300 font-semibold hover:text-blue-200 hover:underline"
          >
            Register
          </Link>
        </div>
      </Card>
    </div>
  );
}
