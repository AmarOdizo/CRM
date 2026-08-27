"use client";

import { Eye, Pencil, Trash2 } from "lucide-react";

export default function PaymentActions({ payment, onView, onEdit, onDelete }) {
  const paymentId = payment?._id || payment?.id;

  return (
    <div className="flex items-center justify-end gap-2">
      {/* =====================================
          VIEW
      ====================================== */}

      <button
        type="button"
        onClick={() => onView?.(payment)}
        title="View Payment"
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-blue-200 bg-blue-50 text-blue-600 transition hover:bg-blue-100"
      >
        <Eye size={17} />
      </button>

      {/* =====================================
          EDIT
      ====================================== */}

      <button
        type="button"
        onClick={() => onEdit?.(payment)}
        title="Edit Payment"
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-amber-200 bg-amber-50 text-amber-600 transition hover:bg-amber-100"
      >
        <Pencil size={17} />
      </button>

      {/* =====================================
          DELETE
      ====================================== */}

      <button
        type="button"
        onClick={() => onDelete?.(payment)}
        title="Delete Payment"
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-600 transition hover:bg-red-100"
      >
        <Trash2 size={17} />
      </button>
    </div>
  );
}
