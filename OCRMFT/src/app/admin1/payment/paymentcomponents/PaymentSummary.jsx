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
    <div className="w-full">
      {/* ======================================
          SUMMARY GRID
      ======================================= */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* ====================================
            TOTAL INVOICE
        ===================================== */}

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Invoice</p>

              <p className="mt-2 text-2xl font-bold text-gray-800">
                {formatCurrency(totalInvoiceAmount)}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <IndianRupee size={21} />
            </div>
          </div>

          <p className="mt-3 text-xs text-gray-500">Total invoice amount</p>
        </div>

        {/* ====================================
            TOTAL PAID
        ===================================== */}

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Paid</p>

              <p className="mt-2 text-2xl font-bold text-green-600">
                {formatCurrency(totalPaidAmount)}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600">
              <CheckCircle2 size={21} />
            </div>
          </div>

          <p className="mt-3 text-xs text-gray-500">Amount received so far</p>
        </div>

        {/* ====================================
            REMAINING
        ===================================== */}

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Remaining Balance
              </p>

              <p className="mt-2 text-2xl font-bold text-red-600">
                {formatCurrency(remainingAmount)}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <WalletCards size={21} />
            </div>
          </div>

          <p className="mt-3 text-xs text-gray-500">
            Amount still to be collected
          </p>
        </div>

        {/* ====================================
            PAYMENT PROGRESS
        ===================================== */}

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Payment Progress
              </p>

              <p className="mt-2 text-2xl font-bold text-purple-600">
                {paymentPercentage.toFixed(0)}%
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <Percent size={21} />
            </div>
          </div>

          {/* Progress Bar */}

          <div className="mt-4">
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-purple-600 transition-all duration-500"
                style={{
                  width: `${paymentPercentage}%`,
                }}
              />
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <p className="text-xs text-gray-500">Collection progress</p>

            <PaymentBadge status={paymentStatus} />
          </div>
        </div>
      </div>

      {/* ======================================
          PAYMENT STATUS
      ======================================= */}

      <div className="mt-4 rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
              {paymentStatus === "Paid" ? (
                <CheckCircle2 size={19} />
              ) : (
                <Clock3 size={19} />
              )}
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-800">
                Payment Status
              </p>

              <p className="text-xs text-gray-500">Current collection status</p>
            </div>
          </div>

          <PaymentBadge status={paymentStatus} />
        </div>
      </div>
    </div>
  );
}
