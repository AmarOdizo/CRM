"use client";

import {
  Clock3,
  LoaderCircle,
  CheckCircle2,
  AlertCircle,
  XCircle,
} from "lucide-react";

export default function StatusBadge({ status }) {
  const statusConfig = {
    Pending: {
      label: "Pending",
      icon: Clock3,
      className: "bg-yellow-50 text-yellow-700 border-yellow-200",
    },

    "In Progress": {
      label: "In Progress",
      icon: LoaderCircle,
      className: "bg-blue-50 text-blue-700 border-blue-200",
    },

    Completed: {
      label: "Completed",
      icon: CheckCircle2,
      className: "bg-green-50 text-green-700 border-green-200",
    },

    Overdue: {
      label: "Overdue",
      icon: AlertCircle,
      className: "bg-red-50 text-red-700 border-red-200",
    },

    Cancelled: {
      label: "Cancelled",
      icon: XCircle,
      className: "bg-gray-50 text-gray-700 border-gray-200",
    },
  };

  const config = statusConfig[status] || {
    label: status || "Unknown",
    icon: AlertCircle,
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
