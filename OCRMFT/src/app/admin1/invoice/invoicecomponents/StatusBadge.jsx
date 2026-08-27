"use client";

export default function StatusBadge({ status }) {
  const normalizedStatus = String(status || "Draft")
    .trim()
    .toLowerCase();

  const statusConfig = {
    draft: {
      label: "Draft",
      className: "bg-gray-100 text-gray-700",
    },

    sent: {
      label: "Sent",
      className: "bg-blue-100 text-blue-700",
    },

    paid: {
      label: "Paid",
      className: "bg-green-100 text-green-700",
    },

    overdue: {
      label: "Overdue",
      className: "bg-red-100 text-red-700",
    },

    cancelled: {
      label: "Cancelled",
      className: "bg-gray-100 text-gray-600",
    },

    pending: {
      label: "Pending",
      className: "bg-yellow-100 text-yellow-700",
    },
  };

  const config = statusConfig[normalizedStatus] || {
    label: status || "Unknown",
    className: "bg-gray-100 text-gray-700",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${config.className}`}
    >
      <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current" />
      {config.label}
    </span>
  );
}
