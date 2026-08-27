"use client";

import { useState } from "react";
import { AlertTriangle, Trash2, X } from "lucide-react";
import { deletePayment } from "../data";

export default function DeleteModal({ payment, isOpen, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // CLOSE
  // ==========================================

  const handleClose = () => {
    if (loading) return;

    setError("");

    if (onClose) {
      onClose();
    }
  };

  // ==========================================
  // DELETE PAYMENT
  // ==========================================

  const handleDelete = async () => {
    if (!payment) {
      setError("Payment information is missing.");
      return;
    }

    const paymentId = payment._id || payment.id;

    if (!paymentId) {
      setError("Payment ID is missing.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const result = await deletePayment(paymentId);

      if (onSuccess) {
        onSuccess(result);
      }

      if (onClose) {
        onClose();
      }
    } catch (err) {
      console.error("Delete Payment Error:", err);

      setError(err.message || "Failed to delete payment.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // DON'T RENDER
  // ==========================================

  if (!isOpen || !payment) {
    return null;
  }

  // ==========================================
  // PAYMENT DISPLAY DATA
  // ==========================================

  const paymentId = payment._id || payment.id || "-";

  const amount =
    payment.amount ?? payment.paidAmount ?? payment.paymentAmount ?? 0;

  const invoiceNumber =
    payment.invoiceId?.invoiceNumber ||
    payment.invoice?.invoiceNumber ||
    payment.invoiceNumber ||
    payment.invoiceNo ||
    "-";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      {/* =====================================
          MODAL
      ====================================== */}

      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
        {/* =================================
            HEADER
        ================================== */}

        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600">
              <AlertTriangle size={20} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-800">
                Delete Payment
              </h2>

              <p className="text-xs text-gray-500">
                This action cannot be undone.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        {/* =================================
            BODY
        ================================== */}

        <div className="px-5 py-5">
          <p className="mb-4 text-sm leading-6 text-gray-600">
            Are you sure you want to delete this payment? All payment
            information associated with this record will be removed.
          </p>

          {/* Payment Information */}

          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-medium text-gray-500">Invoice</p>

                <p className="mt-1 truncate text-sm font-semibold text-gray-800">
                  {invoiceNumber}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium text-gray-500">
                  Payment Amount
                </p>

                <p className="mt-1 text-sm font-semibold text-gray-800">
                  ₹
                  {Number(amount).toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>

              <div className="col-span-2">
                <p className="text-xs font-medium text-gray-500">Payment ID</p>

                <p className="mt-1 break-all text-xs text-gray-700">
                  {paymentId}
                </p>
              </div>
            </div>
          </div>

          {/* =================================
              ERROR
          ================================== */}

          {error && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </div>
          )}
        </div>

        {/* =================================
            FOOTER
        ================================== */}

        <div className="flex flex-col-reverse gap-3 border-t border-gray-200 px-5 py-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Trash2 size={16} />

            {loading ? "Deleting..." : "Delete Payment"}
          </button>
        </div>
      </div>
    </div>
  );
}
