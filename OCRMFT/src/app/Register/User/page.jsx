"use client";

import { Card, Input, Button, Select } from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  LockOutlined,
  IdcardOutlined,
  ApartmentOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";

const { Option } = Select;

export default function EmployeeRegister() {
  const router = useRouter();

  //....//
  const [name, SetName] = useState("");
  const [employeeid, SetEmployeeid] = useState("");
  const [email, SetEmail] = useState("");
  const [phone, SetPhone] = useState("");
  const [department, SetDepartment] = useState("");
  const [designation, SetDesignation] = useState("");
  const [password, SetPassword] = useState("");
  const [confirmpassword, SetConfirmPassword] = useState("");

  let handleFullName = (e) => {
    SetName(e.target.value);
  };
  let handleEmployeeID = (e) => {
    SetEmployeeid(e.target.value);
  };
  let handleEmailAddress = (e) => {
    SetEmail(e.target.value);
  };
  let handlePhoneNumber = (e) => {
    SetPhone(e.target.value);
  };
  let handleDepartment = (value) => {
    SetDepartment(value);
  };
  let handleDesignation = (e) => {
    SetDesignation(e.target.value);
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
      employeeid,
      email,
      phone,
      department,
      designation,
      password,
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/Employee",
        data,
      );

      console.log(response.data);
      alert("Registration Successful");

      router.push("/User");
    } catch (error) {
      console.error(error);

      alert(error.response?.data?.message || "Registration Failed");
    }
  };
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center p-6"
      style={{
        backgroundImage: "url('/register-bg.jpg')",
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
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto">
            <UserOutlined style={{ fontSize: 40, color: "#fff" }} />
          </div>

          <h1 className="text-3xl font-bold text-white mt-4">
            Employee Registration
          </h1>

          <p className="text-gray-200">Create your employee account</p>
        </div>

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
            onChange={handleEmployeeID}
            placeholder="Employee ID"
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
            placeholder="Department"
            onChange={handleDepartment}
          >
            <Option value="IT">IT</Option>
            <Option value="Software Developer">Software Developer</Option>
            <Option value="HR">HR</Option>
            <Option value="Finance">Finance</Option>
            <Option value="Marketing">Marketing</Option>
          </Select>

          <Input
            size="large"
            prefix={<ApartmentOutlined />}
            onChange={handleDesignation}
            placeholder="Designation"
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
          block
          size="large"
          className="!mt-8 !h-12 !rounded-xl !font-semibold"
          onClick={handleRegister}
        >
          Register
        </Button>

        <p className="text-center text-red-500 mt-5">
          Already have an account?{" "}
          <span
            className="text-blue-300 cursor-pointer hover:underline"
            onClick={() => router.push("/User")}
          >
            Login
          </span>
        </p>
      </Card>
    </div>
  );
}
