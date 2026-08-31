"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  UserPlus,
  Building2,
  FolderKanban,
  ClipboardCheck,
  FileText,
  Receipt,
  CreditCard,
  CalendarDays,
  BarChart3,
  LogOut,
} from "lucide-react";

const menus = [
  {
    title: "Dashboard",
    href: "/admin1/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "User Management",
    href: "/admin1/user-management",
    icon: Users,
  },
  {
    title: "Role Management",
    href: "/admin1/role-management",
    icon: ShieldCheck,
  },
  {
    title: "Lead Management",
    href: "/admin1/lead-management",
    icon: UserPlus,
  },
  {
    title: "Client Management",
    href: "/admin1/client-management",
    icon: Building2,
  },
  {
    title: "Project Management",
    href: "/admin1/project-management",
    icon: FolderKanban,
  },
  {
    title: "Task Assignment",
    href: "/admin1/task-assignment",
    icon: ClipboardCheck,
  },
  {
    title: "Quotation Generation",
    href: "/admin1/quotation",
    icon: FileText,
  },
  {
    title: "Invoice Management",
    href: "/admin1/invoice",
    icon: Receipt,
  },
  {
    title: "Payment Tracking",
    href: "/admin1/payment",
    icon: CreditCard,
  },
  {
    title: "Meeting Scheduling",
    href: "/admin1/meeting",
    icon: CalendarDays,
  },
  {
    title: "Report Generation",
    href: "/admin1/report-management",
    icon: BarChart3,
  },
];

export default function AdminSidebar({ collapsed }) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-white text-slate-800 flex flex-col transition-all duration-300 z-50 border-r border-slate-200 shadow-lg md:translate-x-0
      ${collapsed ? "-translate-x-full md:w-16" : "translate-x-0 w-64"}`}
    >
      {/* LOGO */}
      <div className="h-16 flex items-center justify-center border-b border-slate-100 overflow-hidden px-4">
        {collapsed ? (
          <span className="text-base font-black text-cyan-600 bg-cyan-50 px-2.5 py-1 rounded-xl border border-cyan-100 shadow-inner select-none">
            O
          </span>
        ) : (
          <img src="/al.png" alt="Logo" className="h-12 w-full object-contain" />
        )}
      </div>

      {/* MENUS */}
      <div className="flex-1 overflow-y-auto py-4 px-2 space-y-1.5 scrollbar-thin">
        {menus.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.title}
              href={item.href}
              className={`group flex items-center rounded-xl transition-all duration-200 relative
              ${collapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2.5 mx-2"}
              ${
                isActive
                  ? "bg-cyan-50 text-cyan-600 border border-cyan-100 shadow-xs " +
                    (collapsed
                      ? ""
                      : "before:absolute before:left-0 before:top-2.5 before:bottom-2.5 before:w-1 before:bg-cyan-500 before:rounded-r")
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-50 border border-transparent"
              }`}
            >
              <Icon
                size={20}
                className={
                  isActive
                    ? "scale-110 shrink-0 text-cyan-600"
                    : "group-hover:scale-105 transition-transform shrink-0"
                }
              />

              {!collapsed && (
                <span className="font-semibold text-sm select-none">{item.title}</span>
              )}

              {/* COLLAPSED TOOLTIP */}
              {collapsed && (
                <div
                  className="pointer-events-none absolute left-full ml-4 rounded-lg bg-slate-900 px-2.5 py-1.5 text-xs font-semibold text-white shadow-xl opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100 translate-x-[-10px] z-50 whitespace-nowrap border border-slate-800"
                >
                  {item.title}
                </div>
              )}
            </Link>
          );
        })}
      </div>

      {/* FOOTER LOGOUT */}
      <div className="border-t border-slate-100 p-4">
        {collapsed ? (
          <button
            onClick={() => router.push("/")}
            className="w-full flex items-center justify-center rounded-xl bg-red-50/10 hover:bg-red-500 p-3 text-red-600 hover:text-white transition-all duration-200 group relative border border-red-100/50 hover:border-transparent"
          >
            <LogOut size={18} className="shrink-0" />

            <div
              className="pointer-events-none absolute left-full ml-4 rounded-lg bg-red-900 px-2.5 py-1.5 text-xs font-semibold text-white shadow-xl opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100 translate-x-[-10px] z-50 whitespace-nowrap border border-red-800"
            >
              Logout
            </div>
          </button>
        ) : (
          <button
            onClick={() => router.push("/")}
            className="w-full flex items-center gap-3 rounded-xl bg-red-50 hover:bg-red-500 py-3 justify-center text-red-600 hover:text-white font-semibold transition border border-red-100 hover:border-transparent shadow-xs"
          >
            <LogOut size={18} className="shrink-0" />
            <span className="select-none">Logout</span>
          </button>
        )}
      </div>
    </aside>
  );
}
