"use client";

import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  ListChecks,
  XCircle,
} from "lucide-react";

import { getMeetingSummary } from "../utils";

export default function MeetingSummary({ meetings = [] }) {
  const summary = getMeetingSummary(meetings);

  const cards = [
    {
      title: "Total Meetings",
      value: summary.total,
      icon: ListChecks,
      description: "All meetings",
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },

    {
      title: "Today",
      value: summary.today,
      icon: CalendarDays,
      description: "Today's meetings",
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
    },

    {
      title: "Upcoming",
      value: summary.upcoming,
      icon: Clock3,
      description: "Upcoming meetings",
      iconBg: "bg-orange-50",
      iconColor: "text-orange-600",
    },

    {
      title: "Completed",
      value: summary.completed,
      icon: CheckCircle2,
      description: "Completed meetings",
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
    },

    {
      title: "Cancelled",
      value: summary.cancelled,
      icon: XCircle,
      description: "Cancelled meetings",
      iconBg: "bg-red-50",
      iconColor: "text-red-600",
    },
  ];

  return (
    <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 w-full">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        const colorClass = {
          "Total Meetings": "text-blue-600 bg-blue-50 border-blue-100",
          "Today": "text-purple-600 bg-purple-50 border-purple-100",
          "Upcoming": "text-amber-600 bg-amber-50 border-amber-100",
          "Completed": "text-emerald-600 bg-emerald-50 border-emerald-100",
          "Cancelled": "text-rose-600 bg-rose-50 border-rose-100",
        }[card.title] || "text-slate-600 bg-slate-50 border-slate-100";

        return (
          <div
            key={idx}
            className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md flex items-center justify-between group"
          >
            <div>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {card.title}
              </h3>
              <p className="mt-2 text-2xl font-extrabold text-slate-800 tracking-tight">
                {card.value}
              </p>
            </div>
            <div
              className={`h-11 w-11 rounded-xl flex items-center justify-center border transition-all duration-300 group-hover:scale-105 ${colorClass}`}
            >
              <Icon size={20} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
