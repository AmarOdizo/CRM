"use client";

import {
  UserPlus,
  Users,
  Briefcase,
  UserCheck,
  FolderKanban,
  CheckCircle2,
  Clock,
  IndianRupee,
} from "lucide-react";

const cards = [
  {
    key: "totalLeads",
    title: "Total Leads",
    icon: UserPlus,
    color: "text-blue-600 bg-blue-50 border-blue-200/40",
  },
  {
    key: "totalClients",
    title: "Clients",
    icon: Users,
    color: "text-emerald-600 bg-emerald-50 border-emerald-200/40",
  },
  {
    key: "totalProjects",
    title: "Total Projects",
    icon: Briefcase,
    color: "text-indigo-600 bg-indigo-50 border-indigo-200/40",
  },
  {
    key: "totalEmployees",
    title: "Employees",
    icon: UserCheck,
    color: "text-orange-600 bg-orange-50 border-orange-200/40",
  },
  {
    key: "activeProjects",
    title: "Active Projects",
    icon: FolderKanban,
    color: "text-cyan-600 bg-cyan-50 border-cyan-200/40",
  },
  {
    key: "completedProjects",
    title: "Completed Projects",
    icon: CheckCircle2,
    color: "text-teal-600 bg-teal-50 border-teal-200/40",
  },
  {
    key: "pendingProjects",
    title: "Pending Projects",
    icon: Clock,
    color: "text-rose-600 bg-rose-50 border-rose-200/40",
  },
  {
    key: "totalRevenue",
    title: "Revenue",
    icon: IndianRupee,
    color: "text-amber-600 bg-amber-50 border-amber-200/40",
    isCurrency: true,
  },
];

export default function StatisticsCards({ summary }) {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const val = summary?.[card.key] || 0;

        return (
          <div
            key={card.key}
            className="rounded-2xl bg-white p-5 border border-slate-200/80 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md flex items-center justify-between group"
          >
            <div className="min-w-0">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider truncate">
                {card.title}
              </h3>
              <p className="mt-2 text-2xl font-black text-slate-800 truncate">
                {card.isCurrency ? `₹${val.toLocaleString("en-IN")}` : val}
              </p>
            </div>

            <div
              className={`h-11 w-11 rounded-xl flex items-center justify-center border shrink-0 transition-transform duration-300 group-hover:scale-105 ${card.color}`}
            >
              <Icon size={20} className="shrink-0" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
