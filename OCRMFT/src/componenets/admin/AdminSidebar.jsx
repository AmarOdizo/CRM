"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
import { useRouter } from "next/navigation";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className="w-72 h-screen bg-slate-900 text-white fixed left-0 top-0 flex flex-col">
      <div className="h-17 flex items-center justify-center border-b border-slate-700">
        <img src="/al.png" alt="Logo" className="h-16 w-100 object-contain" />
      </div>

      <div className="flex-1 overflow-y-auto py-5">
        {menus.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.title}
              href={item.href}
              className={`mx-3 mb-2 flex items-center gap-3 rounded-xl px-4 py-3 transition-all
              ${
                pathname === item.href
                  ? "bg-cyan-500 text-white"
                  : "hover:bg-orange-300 text-slate-300"
              }`}
            >
              <Icon size={20} />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </div>

      <div className="border-t border-slate-700 p-4">
        <button
          className="w-full flex items-center gap-3 rounded-xl bg-red-500 py-3 justify-center hover:bg-red-600 transition"
          onClick={() => router.push("/")}
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}
