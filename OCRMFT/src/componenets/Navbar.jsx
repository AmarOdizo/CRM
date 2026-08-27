"use client";

import {
  BellOutlined,
  CalendarOutlined,
  MenuFoldOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Badge, Button, Input } from "antd";

export default function Navbar() {
  return (
    <header className="h-16 bg-white border-null flex items-center justify-between px-1 shadow-sm">
      {/* Left Side */}
      <div className="flex items-center gap-4">
        {/* Logo */}
        <img src="/logo.png" alt="Logo" className="h-16 w-43 object-contain" />

        {/* Menu Button */}
        <Button
          type="text"
          icon={<MenuFoldOutlined className="text-xl gap-7" />}
        />

        <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-5">
        {/* Search */}
        <Input
          prefix={<SearchOutlined />}
          placeholder="Search here..."
          className="w-72"
        />

        {/* Notification */}
        <Badge count={5}>
          <BellOutlined className="text-xl cursor-pointer" />
        </Badge>

        {/* Calendar */}
        <CalendarOutlined className="text-xl cursor-pointer" />

        {/* Profile */}
        <div className="flex items-center gap-3 cursor-pointer">
          <Avatar size={40} icon={<UserOutlined />} />
        </div>
      </div>
    </header>
  );
}
