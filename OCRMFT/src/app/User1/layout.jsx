"use client";

import { useState } from "react";
import UserSidebar from "@/componenets/user/UserSidebar";
import UserNavbar from "@/componenets/user/UserNavbar";

export default function UserLayout({ children }) {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <div className="min-h-screen bg-slate-100 relative">
      <UserSidebar collapsed={collapsed} />

      <div className={`transition-all duration-300 ${collapsed ? "ml-0 md:ml-16" : "ml-0 md:ml-72"}`}>
        <UserNavbar collapsed={collapsed} setCollapsed={setCollapsed} />

        <main className="pt-20 p-4 md:p-8 min-h-screen">
          {children}
        </main>
      </div>

      {!collapsed && (
        <div
          className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-40 md:hidden transition-all"
          onClick={() => setCollapsed(true)}
        />
      )}
    </div>
  );
}
