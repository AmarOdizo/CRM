"use client";

import { useState } from "react";
import UserSidebar from "@/componenets/user/UserSidebar";
import UserNavbar from "@/componenets/user/UserNavbar";

export default function UserLayout({ children }) {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-800 relative antialiased">
      <UserSidebar collapsed={collapsed} />

      <div className={`transition-all duration-300 ${collapsed ? "ml-0 md:ml-16" : "ml-0 md:ml-72"}`}>
        <UserNavbar collapsed={collapsed} setCollapsed={setCollapsed} />

        <main className="pt-20 sm:pt-24 md:pt-24 px-3 sm:px-5 md:px-6 lg:px-8 pb-8 sm:pb-10 min-h-screen max-w-[1600px] mx-auto w-full transition-all duration-300">
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
