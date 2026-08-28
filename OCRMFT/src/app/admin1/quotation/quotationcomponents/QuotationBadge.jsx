"use client";

import { formatQuotationStatus, getEffectiveQuotationStatus } from "../utils";

// ============================================================
// STATUS CONFIGURATION
// ============================================================

const statusConfig = {
  Draft: {
    label: "Draft",
    className: "bg-slate-50 text-slate-600 border-slate-200/60",
    dot: "bg-slate-400",
  },
  Sent: {
    label: "Sent",
    className: "bg-blue-50 text-blue-700 border-blue-100",
    dot: "bg-blue-500",
  },
  Accepted: {
    label: "Accepted",
    className: "bg-emerald-50 text-emerald-700 border-emerald-100",
    dot: "bg-emerald-500",
  },
  Rejected: {
    label: "Rejected",
    className: "bg-rose-50 text-rose-700 border-rose-100",
    dot: "bg-rose-500",
  },
  Expired: {
    label: "Expired",
    className: "bg-amber-50 text-amber-700 border-amber-100",
    dot: "bg-amber-500",
  },
  Converted: {
    label: "Converted",
    className: "bg-indigo-50 text-indigo-700 border-indigo-100",
    dot: "bg-indigo-500",
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
