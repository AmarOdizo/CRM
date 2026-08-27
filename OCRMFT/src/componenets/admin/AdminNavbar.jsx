"use client";

import { Bell, Search, UserCircle2 } from "lucide-react";

export default function AdminNavbar() {
  return (
    <header className="fixed top-0 left-72 right-0 h-16 bg-white shadow flex items-center justify-between px-8 z-40">
      <div>
        <h2 className="text-2xl font-bold">Admin Dashboard</h2>
        <p className="text-gray-500 text-sm">Welcome back 👋</p>
      </div>

      <div className="flex items-center gap-5">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-500" size={18} />

          <input
            placeholder="Search..."
            className="pl-10 pr-4 h-11 rounded-xl border outline-none w-72"
          />
        </div>

        <Bell className="cursor-pointer" />

        <UserCircle2 size={38} />
      </div>
    </header>
  );
}
