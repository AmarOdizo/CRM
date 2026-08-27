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

export default function UserForgotPassword() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  // STEP 1 - SEND OTP
  const [phone, SetPhone] = useState("");

  let handlePhoneNumber = (e) => {
    SetPhone(e.target.value);
  };

  const handlestep2 = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/Employee/send-otp",
        {
          phone,
        },
      );

      if (response.data.success) {
        alert(response.data.message);

        // OTP screen par jao
        setStep(2);
      }
    } catch (error) {
      console.log(error);
      console.log(error.response);

      alert(error.response?.data?.message || error.message);
    }
  };

  // STEP 2 - VERIFY OTP
  const [otp, SetOtp] = useState("");

  let handleotp = (value) => {
    SetOtp(value);
  };

  const handleVerifyOtp = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/Employee/verify-otp",
        {
          otp,
        },
      );

      if (response.data.success) {
        alert(response.data.message);

        // Password Reset Step par jao
        setStep(3);
      }
    } catch (error) {
      console.log(error);

      alert(error.response?.data?.message || "OTP Verification Failed");
    }
  };
  // STEP 3 - RESET PASSWORD

  const [newPassword, SetPassword] = useState("");

  let handlePassword = (e) => {
    SetPassword(e.target.value);
  };
  let handlePhone = (e) => {
    SetPhone(e.target.value);
  };

  const handleResetPassword = async () => {
    try {
      const response = await axios.put(
        "http://localhost:5000/api/Employee/reset-password",
        {
          newPassword,
          phone,
        },
      );

      if (response.data.success) {
        alert(response.data.message);

        router.push("/User");
      }
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Password Reset Failed");
    }
  };

  return (
    <div
      className="min-h-screen flex justify-center items-center bg-cover bg-center min-h-screen w-full bg-no-repeat"
      style={{
        backgroundImage: "url('/ubi.png')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      <Card
        className="relative z-10 w-full max-w-md border border-white/20 shadow-2xl"
        style={{
          background: "rgba(8, 18, 40, 0.35)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          borderRadius: "24px",
          border: "1px solid rgba(170, 66, 195, 0.15)",
          boxShadow:
            "0 8px 32px rgba(0,0,0,0.35), 0 0 20px rgba(37,99,235,0.2)",
        }}
        styles={{
          body: {
            padding: 35,
            background: "transparent",
          },
        }}
      >
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-blue-500/20 flex justify-center items-center mx-auto">
            <PhoneOutlined
              style={{
                color: "#fff",
                fontSize: 40,
              }}
            />
          </div>

          <h2 className="text-3xl text-white font-bold mt-5">
            Forgot Password
          </h2>

          <p className="text-gray-200">
            Recover your account using your phone number
          </p>
        </div>

        {/* STEP 1 */}

        {step === 1 && (
          <>
            <Input
              size="large"
              placeholder="Enter Phone Number"
              prefix={<PhoneOutlined />}
              onChange={handlePhoneNumber}
              className="mb-5 h-12 rounded-xl"
            />

            <Button
              type="primary"
              block
              size="large"
              className="!h-12 !rounded-xl"
              onClick={handlestep2}
            >
              Send OTP
            </Button>
          </>
        )}

        {/* STEP 2 */}

        {step === 2 && (
          <>
            <Input.OTP length={6} className="mb-5" onChange={handleotp} />

            <Button
              type="primary"
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
              placeholder="Enter Register Phone Number"
              prefix={<PhoneOutlined />}
              onChange={handlePhone}
              className="mb-5 h-12 rounded-xl"
            />

            <Button
              type="primary"
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
