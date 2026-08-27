"use client";

import { useState } from "react";
import { Card, Input, Button } from "antd";
import {
  PhoneOutlined,
  SafetyCertificateOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function AdminForgotPassword() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  let handlePhone = (e) => {
    setPhone(e.target.value);
  };
  let handleOtp = (value) => {
    setOtp(value);
  };
  let handlePassword = (e) => {
    setNewPassword(e.target.value);
  };

  // STEP 1 - SEND OTP
  const handleSendOtp = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/Admin/send-otp",
        {
          phone,
        },
      );

      if (response.data.success) {
        alert(response.data.message);
        setStep(2);
      }
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Failed to Send OTP");
    }
  };

  // STEP 2 - VERIFY OTP
  const handleVerifyOtp = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/Admin/verify-otp",
        {
          phone,
          otp,
        },
      );

      if (response.data.success) {
        alert(response.data.message);
        setStep(3);
      }
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "OTP Verification Failed");
    }
  };

  // STEP 3 - RESET PASSWORD
  const handleResetPassword = async () => {
    try {
      const response = await axios.put(
        "http://localhost:5000/api/Admin/reset-password",
        {
          phone,
          newPassword,
        },
      );

      if (response.data.success) {
        alert(response.data.message);
        router.push("/Admin");
      }
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Password Reset Failed");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative w-full  bg-no-repeat"
      style={{
        backgroundImage: "url('/abi.png')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70"></div>

      {/* Card */}
      <Card
        className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-white/15 shadow-2xl"
        style={{
          background: "rgba(10, 15, 30, 0.25)", // More transparent
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          border: "1px solid rgba(255,255,255,0.15)",
          boxShadow: `
      0 8px 32px rgba(0,0,0,0.35),
      inset 0 1px 0 rgba(255,255,255,0.08)
    `,
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
          <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mx-auto">
            <SafetyCertificateOutlined
              style={{
                color: "#fff",
                fontSize: 42,
              }}
            />
          </div>

          <h1 className="text-3xl font-bold text-white mt-5">
            Admin Forgot Password
          </h1>

          <p className="text-gray-300 mt-2">Recover your admin account</p>
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <>
            <Input
              size="large"
              placeholder="Registered Phone Number"
              prefix={<PhoneOutlined />}
              onChange={handlePhone}
              className="mb-5 h-12 rounded-xl"
            />

            <Button
              type="primary"
              danger
              block
              size="large"
              className="!h-12 !rounded-xl"
              onClick={handleSendOtp}
            >
              Send OTP
            </Button>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <Input.OTP length={6} className="mb-5" onChange={handleOtp} />

            <Button
              type="primary"
              danger
              block
              size="large"
              className="!h-12 !rounded-xl"
              onClick={handleVerifyOtp}
            >
              Verify OTP
            </Button>
          </>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <>
            <Input.Password
              size="large"
              placeholder="New Password"
              prefix={<LockOutlined />}
              onChange={handlePassword}
              className="mb-4 h-12 rounded-xl"
            />

            <Input
              size="large"
              placeholder="Confirm Password"
              prefix={<PhoneOutlined />}
              onChange={handlePhone}
              className="mb-5 h-12 rounded-xl"
            />

            <Button
              type="primary"
              danger
              block
              size="large"
              className="!h-12 !rounded-xl"
              onClick={handleResetPassword}
            >
              Reset Password
            </Button>
          </>
        )}
      </Card>
    </div>
  );
}
