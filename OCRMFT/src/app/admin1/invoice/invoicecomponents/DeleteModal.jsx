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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Delete Invoice
          </h2>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          <div className="mb-5 flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle size={28} className="text-red-600" />
            </div>
          </div>

          <h3 className="text-center text-lg font-semibold text-gray-800">
            Are you sure?
          </h3>

          <p className="mt-2 text-center text-sm leading-6 text-gray-500">
            You are about to delete invoice{" "}
            <span className="font-semibold text-gray-700">{invoiceNumber}</span>{" "}
            for{" "}
            <span className="font-semibold text-gray-700">{customerName}</span>.
          </p>

          <p className="mt-2 text-center text-sm text-red-500">
            This action cannot be undone.
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t bg-gray-50 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Trash2 size={16} />

            {loading ? "Deleting..." : "Delete Invoice"}
          </button>
        </div>
      </div>
    </div>
  );
}
