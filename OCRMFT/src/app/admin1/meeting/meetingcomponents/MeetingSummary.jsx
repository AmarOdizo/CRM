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
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              {/* ICON */}

              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.iconBg} ${card.iconColor}`}
              >
                <Icon size={21} />
              </div>

              {/* VALUE */}

              <p className="text-2xl font-bold text-gray-800">{card.value}</p>
            </div>

            {/* TEXT */}

            <div className="mt-4">
              <h3 className="text-sm font-bold text-gray-800">{card.title}</h3>

              <p className="mt-1 text-xs text-gray-500">{card.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
