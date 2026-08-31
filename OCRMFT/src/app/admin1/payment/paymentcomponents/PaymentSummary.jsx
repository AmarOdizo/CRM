"use client";

import {
  CheckCircle2,
  Clock3,
  IndianRupee,
  Percent,
  WalletCards,
} from "lucide-react";

import PaymentBadge from "./PaymentBadge";

import {
  calculatePaidAmount,
  calculatePaymentPercentage,
  calculateRemaining,
  formatCurrency,
  getPaymentStatus,
  toNumber,
} from "../utils";

export default function PaymentSummary({ invoiceAmount = 0, payments = [] }) {
  // ==========================================
  // TOTAL INVOICE
  // ==========================================

  const totalInvoiceAmount = toNumber(invoiceAmount);

  // ==========================================
  // TOTAL PAID
  // ==========================================

  const totalPaidAmount = calculatePaidAmount(payments);

  // ==========================================
  // REMAINING
  // ==========================================

  const remainingAmount = calculateRemaining(
    totalInvoiceAmount,
    totalPaidAmount,
  );

  // ==========================================
  // PAYMENT PERCENTAGE
  // ==========================================

  const paymentPercentage = calculatePaymentPercentage(
    totalInvoiceAmount,
    totalPaidAmount,
  );

  // ==========================================
  // STATUS
  // ==========================================

  const paymentStatus = getPaymentStatus({
    invoiceAmount: totalInvoiceAmount,
    paidAmount: totalPaidAmount,
  });

  return (
    <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 w-full">
      {/* TOTAL INVOICE */}
      <div className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md flex items-center justify-between group">
        <div>
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Invoice</h3>
          <p className="mt-2 text-2xl font-extrabold text-slate-800 tracking-tight font-mono">
            {formatCurrency(totalInvoiceAmount)}
          </p>
        </div>
        <div className="h-11 w-11 rounded-xl flex items-center justify-center border border-blue-100 bg-blue-50 text-blue-600">
          <IndianRupee size={20} />
        </div>
      </div>

      {/* TOTAL PAID */}
      <div className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md flex items-center justify-between group">
        <div>
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Paid</h3>
          <p className="mt-2 text-2xl font-extrabold text-emerald-600 tracking-tight font-mono">
            {formatCurrency(totalPaidAmount)}
          </p>
        </div>
        <div className="h-11 w-11 rounded-xl flex items-center justify-center border border-emerald-100 bg-emerald-50 text-emerald-600">
          <CheckCircle2 size={20} />
        </div>
      </div>

      {/* REMAINING BALANCE */}
      <div className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md flex items-center justify-between group">
        <div>
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Remaining Balance</h3>
          <p className="mt-2 text-2xl font-extrabold text-rose-600 tracking-tight font-mono">
            {formatCurrency(remainingAmount)}
          </p>
        </div>
        <div className="h-11 w-11 rounded-xl flex items-center justify-center border border-rose-100 bg-rose-50 text-rose-600">
          <WalletCards size={20} />
        </div>
      </div>

      {/* PROGRESS */}
      <div className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md flex flex-col justify-between group">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Collection Progress</h3>
            <p className="mt-1 text-2xl font-extrabold text-purple-600 tracking-tight">
              {paymentPercentage.toFixed(0)}%
            </p>
          </div>
          <div className="h-11 w-11 rounded-xl flex items-center justify-center border border-purple-100 bg-purple-50 text-purple-600">
            <Percent size={20} />
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-3">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-purple-600 transition-all duration-500"
              style={{
                width: `${paymentPercentage}%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
