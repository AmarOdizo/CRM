"use client";

import { getStatusClass, normalizeStatus } from "../utils";

export default function PaymentBadge({ status }) {
  const normalizedStatus = normalizeStatus(status);

  const statusClass = getStatusClass(normalizedStatus);

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusClass}`}
    >
      {normalizedStatus}
    </span>
  );
}
