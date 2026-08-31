"use client";

import { AlertTriangle, X, Trash2 } from "lucide-react";

export default function DeleteModal({
  isOpen,
  invoice,
  onClose,
  onConfirm,
  loading = false,
}) {
  if (!isOpen) return null;

  const invoiceNumber =
    invoice?.invoiceNumber ||
    invoice?.invoiceNo ||
    invoice?.invoiceId ||
    "this invoice";

  const customerName = invoice?.customerName || "this customer";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="text-base font-bold text-slate-800">
            Delete Invoice
          </h2>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-50 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 border border-rose-100 text-rose-600">
              <AlertTriangle size={24} />
            </div>
          </div>

          <h3 className="text-lg font-bold text-slate-800">
            Confirm Deletion
          </h3>

          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            Are you sure you want to delete invoice{" "}
            <span className="font-semibold text-slate-700">{invoiceNumber}</span> for{" "}
            <span className="font-semibold text-slate-700">{customerName}</span>?
          </p>

          <p className="mt-2 text-xs font-semibold text-rose-500">
            This action cannot be undone.
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50/50 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-rose-700 shadow-md shadow-rose-500/10 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
          >
            <Trash2 size={15} />
            <span>{loading ? "Deleting..." : "Delete Invoice"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
