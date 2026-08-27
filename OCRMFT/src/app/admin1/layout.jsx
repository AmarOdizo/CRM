"use client";

import { useState } from "react";
import { provideGlobalGridOptions } from "ag-grid-community";
import AdminSidebar from "@/componenets/admin/AdminSidebar";
import AdminNavbar from "@/componenets/admin/AdminNavbar";

provideGlobalGridOptions({
  theme: "legacy",
});

export default function AdminLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100">
      <AdminSidebar collapsed={collapsed} />

      <div className={`transition-all duration-300 ${collapsed ? "ml-16" : "ml-64"}`}>
        <AdminNavbar collapsed={collapsed} setCollapsed={setCollapsed} />

        <main className="pt-20 p-8 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}
