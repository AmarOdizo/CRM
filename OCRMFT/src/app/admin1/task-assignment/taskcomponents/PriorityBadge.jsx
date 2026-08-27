"use client";

import { ArrowDown, Minus, ArrowUp } from "lucide-react";

export default function PriorityBadge({ priority }) {
  const priorityConfig = {
    Low: {
      label: "Low",
      icon: ArrowDown,
      className: "bg-green-50 text-green-700 border-green-200",
    },

    Medium: {
      label: "Medium",
      icon: Minus,
      className: "bg-yellow-50 text-yellow-700 border-yellow-200",
    },

    High: {
      label: "High",
      icon: ArrowUp,
      className: "bg-red-50 text-red-700 border-red-200",
    },
  };

  const config = priorityConfig[priority] || {
    label: priority || "Unknown",
    icon: Minus,
    className: "bg-gray-50 text-gray-600 border-gray-200",
  };

  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold whitespace-nowrap ${config.className}`}
    >
      <Icon size={14} />
      {config.label}
    </span>
  );
}
