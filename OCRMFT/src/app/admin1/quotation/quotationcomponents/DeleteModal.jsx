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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Delete Quotation
              </h2>

              <p className="text-sm text-gray-500">Confirmation required</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6">
          <p className="text-sm leading-6 text-gray-600">
            Are you sure you want to delete this quotation?
          </p>

          {/* Quotation Details */}
          <div className="mt-4 rounded-xl border border-red-100 bg-red-50 p-4">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm font-medium text-gray-500">
                Quotation
              </span>

              <span className="text-sm font-semibold text-gray-900">
                {quotationNumber}
              </span>
            </div>

            <div className="mt-2 flex items-center justify-between gap-4">
              <span className="text-sm font-medium text-gray-500">
                Customer
              </span>

              <span className="max-w-[220px] truncate text-sm font-semibold text-gray-900">
                {customerName}
              </span>
            </div>
          </div>

          <p className="mt-4 text-xs text-red-600">
            This action cannot be undone. The quotation will be permanently
            removed.
          </p>
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse gap-3 border-t bg-gray-50 px-6 py-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
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
