"use client";

import {
  CalendarDays,
  CreditCard,
  FileText,
  IndianRupee,
  ReceiptText,
} from "lucide-react";

import PaymentBadge from "./PaymentBadge";
import PaymentActions from "./PaymentActions";

import {
  formatCurrency,
  formatDate,
  formatPaymentMethod,
  formatReference,
} from "../utils";

export default function PaymentTable({
  payments = [],
  loading = false,
  onView,
  onEdit,
  onDelete,
}) {
  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex min-h-[300px] items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-9 w-9 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

            <p className="text-sm text-gray-500">Loading payments...</p>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // EMPTY STATE
  // ==========================================

  if (!Array.isArray(payments) || payments.length === 0) {
    return (
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex min-h-[300px] flex-col items-center justify-center px-5 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-500">
            <ReceiptText size={26} />
          </div>

          <h3 className="text-base font-bold text-gray-800">
            No payments found
          </h3>

          <p className="mt-1 max-w-sm text-sm text-gray-500">
            There are no payment records matching your current search or filter.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      {/* ========================================
          TABLE HEADER
      ========================================= */}

      <div className="flex flex-col gap-2 border-b border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-bold text-gray-800">Payment Records</h2>

          <p className="text-xs text-gray-500">
            {payments.length} payment
            {payments.length !== 1 ? "s" : ""} found
          </p>
        </div>
      </div>

      {/* ========================================
          RESPONSIVE TABLE
      ========================================= */}

      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[1050px] border-collapse">
          {/* ==================================
              TABLE HEAD
          =================================== */}

          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                #
              </th>

              <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                Invoice
              </th>

              <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                Payment Date
              </th>

              <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                Amount
              </th>

              <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                Method
              </th>

              <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                Reference
              </th>

              <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                Status
              </th>

              <th className="px-5 py-3 text-right text-xs font-bold uppercase tracking-wide text-gray-500">
                Actions
              </th>
            </tr>
          </thead>

          {/* ==================================
              TABLE BODY
          =================================== */}

          <tbody className="divide-y divide-gray-100">
            {payments.map((payment, index) => {
              // -------------------------------
              // PAYMENT ID
              // -------------------------------

              const paymentId = payment?._id || payment?.id;

              // -------------------------------
              // INVOICE DATA
              // -------------------------------

              const invoice =
                typeof payment?.invoiceId === "object"
                  ? payment.invoiceId
                  : payment?.invoice;

              const invoiceNumber =
                invoice?.invoiceNumber ||
                invoice?.invoiceNo ||
                invoice?.number ||
                payment?.invoiceNumber ||
                payment?.invoiceNo ||
                payment?.invoiceId ||
                "-";

              // -------------------------------
              // PAYMENT AMOUNT
              // -------------------------------

              const amount =
                payment?.amount ??
                payment?.paidAmount ??
                payment?.paymentAmount ??
                0;

              // -------------------------------
              // PAYMENT DATE
              // -------------------------------

              const paymentDate =
                payment?.paymentDate || payment?.date || payment?.createdAt;

              // -------------------------------
              // PAYMENT METHOD
              // -------------------------------

              const paymentMethod =
                payment?.paymentMethod || payment?.method || "-";

              // -------------------------------
              // REFERENCE
              // -------------------------------

              const reference =
                payment?.transactionReference ||
                payment?.referenceNumber ||
                payment?.transactionId ||
                payment?.reference ||
                "-";

              // -------------------------------
              // STATUS
              // -------------------------------

              const status = payment?.status || "Pending";

              return (
                <tr
                  key={paymentId || index}
                  className="transition hover:bg-gray-50"
                >
                  {/* =========================
                      INDEX
                  ========================== */}

                  <td className="px-5 py-4">
                    <span className="text-sm font-medium text-gray-500">
                      {index + 1}
                    </span>
                  </td>

                  {/* =========================
                      INVOICE
                  ========================== */}

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                        <FileText size={17} />
                      </div>

                      <div className="min-w-0">
                        <p className="max-w-[180px] truncate text-sm font-semibold text-gray-800">
                          {invoiceNumber}
                        </p>

                        {paymentId && (
                          <p className="max-w-[180px] truncate text-xs text-gray-400">
                            ID: {paymentId}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* =========================
                      DATE
                  ========================== */}

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <CalendarDays
                        size={16}
                        className="shrink-0 text-gray-400"
                      />

                      <span>{formatDate(paymentDate)}</span>
                    </div>
                  </td>

                  {/* =========================
                      AMOUNT
                  ========================== */}

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5">
                      <IndianRupee size={15} className="text-green-600" />

                      <span className="text-sm font-bold text-gray-800">
                        {formatCurrency(amount)}
                      </span>
                    </div>
                  </td>

                  {/* =========================
                      METHOD
                  ========================== */}

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <CreditCard size={16} className="text-gray-400" />

                      <span className="text-sm text-gray-700">
                        {formatPaymentMethod(paymentMethod)}
                      </span>
                    </div>
                  </td>

                  {/* =========================
                      REFERENCE
                  ========================== */}

                  <td className="px-5 py-4">
                    <span
                      className="block max-w-[180px] truncate text-sm text-gray-600"
                      title={reference}
                    >
                      {formatReference(reference)}
                    </span>
                  </td>

                  {/* =========================
                      STATUS
                  ========================== */}

                  <td className="px-5 py-4">
                    <PaymentBadge status={status} />
                  </td>

                  {/* =========================
                      ACTIONS
                  ========================== */}

                  <td className="px-5 py-4">
                    <PaymentActions
                      payment={payment}
                      onView={onView}
                      onEdit={onEdit}
                      onDelete={onDelete}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ========================================
          FOOTER
      ========================================= */}

      <div className="border-t border-gray-200 bg-gray-50 px-5 py-3">
        <p className="text-xs text-gray-500">
          Showing{" "}
          <span className="font-semibold text-gray-700">{payments.length}</span>{" "}
          payment
          {payments.length !== 1 ? "s" : ""}
        </p>
      </div>
    </div>
  );
}
