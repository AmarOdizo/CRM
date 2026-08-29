"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Upload,
  ClipboardList,
  CalendarDays,
  Bell,
  UserCircle,
  LogOut,
} from "lucide-react";
import { useRouter } from "next/navigation";

const menuItems = [
  {
    title: "Dashboard",
    href: "/User1/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "View Assigned Projects",
    href: "/User1/assigned-projects",
    icon: FolderKanban,
  },
  {
    title: "Update Task Progress",
    href: "/User1/task-progress",
    icon: CheckSquare,
  },
  {
    title: "Upload Project Files",
    href: "/User1/upload-files",
    icon: Upload,
  },
  {
    title: "Daily Work Updates",
    href: "/User1/daily-updates",
    icon: ClipboardList,
  },
  {
    title: "Meetings",
    href: "/User1/meetings",
    icon: CalendarDays,
  },
  {
    title: "Notifications",
    href: "/User1/notifications",
    icon: Bell,
  },
  {
    title: "Profile",
    href: "/User1/profile",
    icon: UserCircle,
  },
];

export default function UserSidebar({ collapsed }) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className={`fixed left-0 top-0 h-screen bg-slate-900 text-white shadow-xl flex flex-col transition-all duration-300 z-50 border-r border-slate-850 md:translate-x-0 ${collapsed ? "-translate-x-full md:w-16" : "translate-x-0 w-72"}`}>
      {/* Logo */}
      <div className="h-16 flex items-center justify-center border-b border-slate-700 px-4 shrink-0">
        {collapsed ? (
          <span className="text-base font-black text-cyan-400 bg-slate-950 px-2.5 py-1 rounded-xl border border-slate-850 shadow-inner select-none">
            O
          </span>
        ) : (
          <img src="/al.png" alt="Logo" className="h-12 w-full object-contain" />
        )}
      </div>

      {/* Menu */}
      <div className="flex-1 overflow-y-auto py-5 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.title}
              href={item.href}
              className={`group flex items-center rounded-xl transition-all duration-200 relative
              ${collapsed ? "justify-center p-2.5 mx-3" : "gap-3 px-4 py-3 mx-3 mb-2"}
              ${
                isActive
                  ? "bg-cyan-500 text-white shadow-md shadow-cyan-500/10"
                  : "text-slate-350 hover:text-slate-200 hover:bg-slate-800"
              }`}
            >
              <Icon size={20} className="shrink-0" />
              {!collapsed && <span className="font-semibold text-sm select-none">{item.title}</span>}
              {collapsed && (
                <div className="pointer-events-none absolute left-full ml-4 rounded-lg bg-slate-950 px-2.5 py-1.5 text-xs font-semibold text-white shadow-xl opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100 translate-x-[-10px] z-50 whitespace-nowrap border border-slate-800">
                  {item.title}
                </div>
              )}
            </Link>
          );
        })}
      </div>

      {/* Logout */}
      <div className="border-t border-slate-700 p-4">
        {collapsed ? (
          <button
            className="w-full bg-red-500 hover:bg-red-600 rounded-xl p-3 flex items-center justify-center gap-2 transition relative group"
            onClick={() => router.push("/")}
          >
            <LogOut size={18} />
            <div className="pointer-events-none absolute left-full ml-4 rounded-lg bg-red-950 px-2.5 py-1.5 text-xs font-semibold text-white shadow-xl opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100 translate-x-[-10px] z-50 whitespace-nowrap border border-red-500/20">
              Logout
            </div>
          </button>
        ) : (
          <button
            className="w-full bg-red-50 hover:bg-red-500 border border-red-500/20 hover:border-transparent text-red-500 hover:text-white rounded-xl py-3 flex items-center justify-center gap-2 transition font-semibold shadow-sm"
            onClick={() => router.push("/")}
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        )}
      </div>
    </aside>
  );
}
