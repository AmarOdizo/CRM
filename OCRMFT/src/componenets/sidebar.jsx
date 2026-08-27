"use client";

import { Layout, Menu } from "antd";
import {
  DashboardOutlined,
  InfoCircleOutlined,
  LoginOutlined,
} from "@ant-design/icons";
import { useRouter, usePathname } from "next/navigation";

const { Sider } = Layout;

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const items = [
    {
      key: "/dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
    },
    {
      key: "/about",
      icon: <InfoCircleOutlined />,
      label: "About",
    },
    {
      key: "/login",
      icon: <LoginOutlined />,
      label: "Login",
    },
  ];

  return (
    <Sider width={180} theme="dark" style={{ minHeight: "100vh" }}>
      <Menu
        theme="dark"
        mode="inline"
        className="h-full hover:bg-Red-700"
        selectedKeys={[pathname]}
        items={items}
        onClick={({ key }) => router.push(key)}
      />
    </Sider>
  );
}
