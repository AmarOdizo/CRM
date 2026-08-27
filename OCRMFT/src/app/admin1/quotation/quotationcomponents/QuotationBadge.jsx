"use client";

import { formatQuotationStatus, getEffectiveQuotationStatus } from "../utils";

// ============================================================
// STATUS CONFIGURATION
// ============================================================

const statusConfig = {
  Draft: {
    label: "Draft",
    className: "bg-gray-100 text-gray-700 border-gray-200",
    dot: "bg-gray-500",
  },

  Sent: {
    label: "Sent",
    className: "bg-blue-100 text-blue-700 border-blue-200",
    dot: "bg-blue-500",
  },

  Accepted: {
    label: "Accepted",
    className: "bg-green-100 text-green-700 border-green-200",
    dot: "bg-green-500",
  },

  Rejected: {
    label: "Rejected",
    className: "bg-red-100 text-red-700 border-red-200",
    dot: "bg-red-500",
  },

  Expired: {
    label: "Expired",
    className: "bg-orange-100 text-orange-700 border-orange-200",
    dot: "bg-orange-500",
  },

  Converted: {
    label: "Converted",
    className: "bg-purple-100 text-purple-700 border-purple-200",
    dot: "bg-purple-500",
  },
};

// ============================================================
// COMPONENT
// ============================================================

export default function QuotationBadge({
  status,
  quotation = null,
  size = "md",
  showDot = true,
}) {
  // ==========================================================
  // GET EFFECTIVE STATUS
  // ==========================================================

  const effectiveStatus = quotation
    ? getEffectiveQuotationStatus(quotation)
    : formatQuotationStatus(status);

  // ==========================================================
  // CONFIG
  // ==========================================================

  const config = statusConfig[effectiveStatus] || statusConfig.Draft;

  // ==========================================================
  // SIZE
  // ==========================================================

  const sizeClass =
    {
      sm: "px-2 py-0.5 text-xs",

      md: "px-2.5 py-1 text-xs",

      lg: "px-3 py-1.5 text-sm",
    }[size] || "px-2.5 py-1 text-xs";

  return (
    <span
      className={`
        inline-flex
        items-center
        gap-1.5
        rounded-full
        border
        font-medium
        whitespace-nowrap
        ${config.className}
        ${sizeClass}
      `}
    >
      {/* ====================================================
          STATUS DOT
      ==================================================== */}

      {showDot && (
        <span
          className={`
            h-1.5
            w-1.5
            rounded-full
            ${config.dot}
          `}
        />
      )}

      {/* ====================================================
          STATUS LABEL
      ==================================================== */}

      <span>{config.label}</span>
    </span>
  );
}
