"use client";

import { Bell, Search, UserCircle2, Settings } from "lucide-react";

export default function UserNavbar() {
  return (
    <header className="fixed top-0 left-72 right-0 h-17 bg-white shadow-md flex items-center justify-between px-8 z-40">
      <div>
        <h2 className="text-2xl font-bold">Employee Dashboard</h2>

        <p className="text-gray-500 text-sm">Welcome back 👋</p>
      </div>

      <div className="flex items-center gap-6">
        {/* Search */}

        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />

          <input
            type="text"
            placeholder="Search..."
            className="w-72 h-11 rounded-xl border pl-10 pr-4 outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        {/* Notification */}

        <button className="relative">
          <Bell size={24} />

          <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
            5
          </span>
        </button>

        {/* Settings */}

        <Settings size={22} className="cursor-pointer hover:text-cyan-500" />

        {/* Profile */}

        <div className="flex items-center gap-3 cursor-pointer">
          <UserCircle2 size={42} className="text-cyan-600" />

          <div>
            <h4 className="font-semibold">Amar Kumar</h4>

            <p className="text-sm text-gray-500">Employee</p>
          </div>
        </div>
      </div>
    </header>
  );
}
