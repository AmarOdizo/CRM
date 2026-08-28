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
        title="View details"
        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-100/50 rounded-lg transition cursor-pointer"
      >
        <Eye size={15} />
      </button>

      <button
        type="button"
        onClick={() => onEdit?.(payment)}
        title="Edit payment"
        className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-slate-100/50 rounded-lg transition cursor-pointer"
      >
        <Pencil size={15} />
      </button>

      <button
        type="button"
        onClick={() => onDelete?.(payment)}
        title="Delete record"
        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100/50 rounded-lg transition cursor-pointer"
      >
        <Trash2 size={15} />
      </button>
    </div>
  );
}
