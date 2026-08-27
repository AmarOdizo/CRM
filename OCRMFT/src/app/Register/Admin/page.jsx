"use client";

import { Card, Input, Button, Select } from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  LockOutlined,
  IdcardOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";

const { Option } = Select;

export default function AdminRegister() {
  const router = useRouter();

  const [name, SetName] = useState("");
  const [adminid, SetAdminId] = useState("");
  const [email, SetEmail] = useState("");
  const [phone, SetPhone] = useState("");
  const [adminrole, SetAdminRole] = useState("");
  const [department, SetDepartment] = useState("");

  const [password, SetPassword] = useState("");
  const [confirmpassword, SetConfirmPassword] = useState("");

  let handleFullName = (e) => {
    SetName(e.target.value);
  };
  let handleAdminID = (e) => {
    SetAdminId(e.target.value);
  };
  let handleEmailAddress = (e) => {
    SetEmail(e.target.value);
  };
  let handlePhoneNumber = (e) => {
    SetPhone(e.target.value);
  };
  let handleAdminRole = (value) => {
    SetAdminRole(value);
  };
  let handleDepartment = (e) => {
    SetDepartment(e.target.value);
  };

  let handlePassword = (e) => {
    SetPassword(e.target.value);
  };
  let handleConfirmPassword = (e) => {
    SetConfirmPassword(e.target.value);
  };

  const handleRegister = async () => {
    if (password !== confirmpassword) {
      alert("Password and Confirm Password do not match");
      return;
    }

    const data = {
      name,
      adminid,
      email,
      phone,
      adminrole,
      department,

      password,
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/Admin",
        data,
      );

      console.log(response.data);
      alert("Registration Successful");

      router.push("/Admin");
    } catch (error) {
      console.error(error);

      alert(error.response?.data?.message || "Registration Failed");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center p-6 relative"
      style={{
        backgroundImage: "url('/admin-register-bg.jpg')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Register Card */}
      <Card
        className="relative z-10 w-full max-w-2xl border border-white/20 shadow-2xl"
        style={{
          background: "rgba(255,255,255,0.12)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          borderRadius: "24px",
        }}
        styles={{
          body: {
            padding: 35,
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
                color: "#fff",
              }}
            />
          </div>

          <h1 className="text-3xl font-bold text-white mt-4">
            Admin Registration
          </h1>

          <p className="text-gray-200">Create a new administrator account</p>
        </div>

        {/* Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            size="large"
            prefix={<UserOutlined />}
            onChange={handleFullName}
            placeholder="Full Name"
          />

          <Input
            size="large"
            prefix={<IdcardOutlined />}
            onChange={handleAdminID}
            placeholder="Admin ID"
          />

          <Input
            size="large"
            prefix={<MailOutlined />}
            onChange={handleEmailAddress}
            placeholder="Email Address"
          />

          <Input
            size="large"
            prefix={<PhoneOutlined />}
            onChange={handlePhoneNumber}
            placeholder="Phone Number"
          />

          <Select
            size="large"
            placeholder="Admin Role"
            onChange={handleAdminRole}
          >
            <Option value="Super Admin">Super Admin</Option>
            <Option value="Project Admin">Project Admin</Option>
            <Option value="System Admin">System Admin</Option>
          </Select>

          <Input
            size="large"
            prefix={<SafetyCertificateOutlined />}
            onChange={handleDepartment}
            placeholder="Department"
          />

          <Input.Password
            size="large"
            prefix={<LockOutlined />}
            onChange={handlePassword}
            placeholder="Password"
          />

          <Input.Password
            size="large"
            prefix={<LockOutlined />}
            onChange={handleConfirmPassword}
            placeholder="Confirm Password"
          />
        </div>

        <Button
          type="primary"
          danger
          block
          size="large"
          className="!mt-8 !h-12 !rounded-xl !font-semibold"
          onClick={handleRegister}
        >
          Register Admin
        </Button>

        <p className="text-center text-white mt-5">
          Already have an account?{" "}
          <span
            className="text-red-300 cursor-pointer hover:underline"
            onClick={() => router.push("/Admin")}
          >
            Login
          </span>
        </p>
      </Card>
    </div>
  );
}
