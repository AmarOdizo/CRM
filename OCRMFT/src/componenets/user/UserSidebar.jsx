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

export default function UserSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className="fixed left-0 top-0 w-72 h-screen bg-slate-900 text-white shadow-xl flex flex-col">
      {/* Logo */}

      <div className="h-17 flex items-center justify-center border-b border-slate-700">
        <div className="text-center">
          <img src="/al.png" alt="Logo" className="h-16 w-100 object-contain" />
        </div>
      </div>

      {/* Menu */}

      <div className="flex-1 overflow-y-auto py-5">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.title}
              href={item.href}
              className={`mx-3 mb-2 flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-300
              ${
                pathname === item.href
                  ? "bg-cyan-500 text-white"
                  : "text-slate-300 hover:bg-slate-800"
              }`}
            >
              <Icon size={20} />

              <span>{item.title}</span>
            </Link>
          );
        })}
      </div>

      {/* Logout */}

      <div className="border-t border-slate-700 p-4">
        <button
          className="w-full bg-red-500 hover:bg-red-600 rounded-xl py-3 flex items-center justify-center gap-2 transition"
          onClick={() => router.push("/")}
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}
