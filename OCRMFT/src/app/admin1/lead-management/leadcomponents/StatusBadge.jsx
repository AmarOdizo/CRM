"use client";

const statusColors = {
  New: "bg-gray-100 text-gray-700",
  Contacted: "bg-blue-100 text-blue-700",
  Interested: "bg-yellow-100 text-yellow-700",
  "Proposal Sent": "bg-purple-100 text-purple-700",
  Negotiation: "bg-orange-100 text-orange-700",
  Won: "bg-green-100 text-green-700",
  Lost: "bg-red-100 text-red-700",
};

export default function StatusBadge({ status }) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        statusColors[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status}
    </span>
  );
}
