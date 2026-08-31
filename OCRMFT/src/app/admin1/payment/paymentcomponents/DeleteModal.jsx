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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl transition-all">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 border border-rose-100 text-rose-600">
              <AlertTriangle size={18} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800">
                Delete Payment Record
              </h2>
              <p className="text-[10px] font-semibold text-slate-400">
                This transaction record will be permanently deleted.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 transition cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* BODY */}
        <div className="px-6 py-6 space-y-4">
          <p className="text-xs leading-relaxed text-slate-500 font-medium">
            Are you sure you want to delete this payment record? This action removes the logged transaction from your system ledger and reverts the invoice amount state.
          </p>

          {/* Payment Info */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Invoice Number</p>
                <p className="mt-1 truncate text-xs font-bold text-slate-700">
                  {invoiceNumber}
                </p>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Amount Logged</p>
                <p className="mt-1 text-xs font-extrabold text-slate-700 font-mono">
                  ₹{Number(amount).toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>

              <div className="col-span-2 border-t border-slate-200/50 pt-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Ledger Reference ID</p>
                <p className="mt-1 truncate text-[10px] font-mono font-semibold text-slate-500">
                  {paymentId}
                </p>
              </div>
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-3">
              <p className="text-xs font-semibold text-rose-800">{error}</p>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="flex flex-col-reverse gap-2 border-t border-slate-100 bg-slate-50/50 px-6 py-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm transition cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-rose-500/10 hover:bg-rose-700 active:scale-95 transition cursor-pointer"
          >
            {loading ? "Deleting..." : "Permanently Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
