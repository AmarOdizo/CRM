"use client";

import { useState } from "react";
import { provideGlobalGridOptions } from "ag-grid-community";
import AdminSidebar from "@/componenets/admin/AdminSidebar";
import AdminNavbar from "@/componenets/admin/AdminNavbar";

provideGlobalGridOptions({
  theme: "legacy",
});

export default function AdminLayout({ children }) {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <div className="min-h-screen bg-slate-100 relative">
      <AdminSidebar collapsed={collapsed} />

      <div className={`transition-all duration-300 ${collapsed ? "ml-0 md:ml-16" : "ml-0 md:ml-64"}`}>
        <AdminNavbar collapsed={collapsed} setCollapsed={setCollapsed} />

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
