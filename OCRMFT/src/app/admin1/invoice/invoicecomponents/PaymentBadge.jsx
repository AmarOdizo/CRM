"use client";

export default function PaymentBadge({ paymentStatus }) {
  const normalizedStatus = String(paymentStatus || "Pending")
    .trim()
    .toLowerCase();

  const paymentConfig = {
    paid: {
      label: "Paid",
      className: "bg-green-100 text-green-700",
    },

    pending: {
      label: "Pending",
      className: "bg-yellow-100 text-yellow-700",
    },

    partial: {
      label: "Partial",
      className: "bg-orange-100 text-orange-700",
    },

    failed: {
      label: "Failed",
      className: "bg-red-100 text-red-700",
    },

    refunded: {
      label: "Refunded",
      className: "bg-purple-100 text-purple-700",
    },
  };

  const config = paymentConfig[normalizedStatus] || {
    label: paymentStatus || "Unknown",
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
