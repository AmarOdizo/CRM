"use client";

import { AlertTriangle, X, Trash2 } from "lucide-react";

export default function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  quotation,
  loading = false,
}) {
  if (!isOpen) return null;

  const quotationNumber =
    quotation?.quotationNumber ||
    quotation?.quotationNo ||
    quotation?.quoteNumber ||
    `#${quotation?._id || quotation?.id || ""}`;

  const customerName =
    quotation?.customerName || quotation?.customer?.name || "this customer";

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-50 border border-rose-100">
              <AlertTriangle className="h-5 w-5 text-rose-600" />
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-800 tracking-tight">
                Delete Quotation
              </h2>
              <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Confirmation Required</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed cursor-pointer"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6">
          <p className="text-sm font-medium leading-relaxed text-slate-600">
            Are you sure you want to delete this quotation statement? This action cannot be undone.
          </p>

          {/* Quotation Details */}
          <div className="mt-4 rounded-xl border border-rose-100/50 bg-rose-50/30 p-4">
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Quotation Ref
              </span>
              <span className="text-sm font-bold text-slate-800">
                {quotationNumber}
              </span>
            </div>

            <div className="mt-2.5 flex items-center justify-between gap-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Customer Name
              </span>
              <span className="max-w-[220px] truncate text-sm font-bold text-slate-800">
                {customerName}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse gap-2.5 border-t border-slate-100 bg-slate-50/50 px-6 py-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-xs font-bold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-rose-600/10 transition hover:bg-rose-700 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Delete Quotation
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
