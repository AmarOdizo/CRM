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
      className="min-h-screen flex items-center justify-center p-6"
      style={{
        backgroundImage: "url('/loginbg.jpg')",
      }}
    >
      <Card
        className="w-full max-w-md rounded-3xl border border-white/20 shadow-2xl"
        style={{
          background: "rgba(0, 0, 0, 0.45)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
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
          <div className="w-20 h-20 mx-auto rounded-full bg-blue-100 flex items-center justify-center">
            <TeamOutlined className="text-4xl text-blue-600" />
          </div>

          <h1 className="text-3xl font-bold mt-5 text-gray-900">
            Client & Project
          </h1>

          <h2 className="text-xl font-semibold text-blue-600">
            Management System
          </h2>

          <p className="text-gray-500 mt-2">Select your account type</p>
        </div>

        {/* User Card */}
        <div
          onClick={() => setRole("user")}
          className={`mb-4 cursor-pointer rounded-2xl border p-5 transition-all duration-300 ${
            role === "user"
              ? "border-blue-600 bg-blue-50 shadow-lg"
              : "border-gray-200 hover:border-blue-500 hover:shadow-md"
          }`}
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center">
              <UserOutlined className="text-2xl text-blue-600" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900">User</h3>
              <p className="text-sm text-gray-500">
                Access your projects and dashboard
              </p>
            </div>
          </div>
        </div>

        {/* Admin Card */}
        <div
          onClick={() => setRole("admin")}
          className={`cursor-pointer rounded-2xl border p-5 transition-all duration-300 ${
            role === "admin"
              ? "border-green-600 bg-green-50 shadow-lg"
              : "border-gray-200 hover:border-green-500 hover:shadow-md"
          }`}
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center">
              <TeamOutlined className="text-2xl text-green-600" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900">Admin</h3>
              <p className="text-sm text-gray-500">Manage users and projects</p>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <Button
          type="primary"
          block
          size="large"
          disabled={!role}
          onClick={handleContinue}
          className="!mt-8 !h-12 !rounded-xl !font-semibold !text-orange-500"
        >
          Continue <ArrowRightOutlined />
        </Button>
      </Card>
    </div>
  );
}
