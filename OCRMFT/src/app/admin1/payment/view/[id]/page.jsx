"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
  ArrowLeft,
  CalendarDays,
  CreditCard,
  Edit,
  FileText,
  Hash,
  IndianRupee,
  Loader2,
  ReceiptText,
  Wallet,
} from "lucide-react";

import { getPaymentById } from "../../data";

import PaymentBadge from "../../paymentcomponents/PaymentBadge";

import {
  formatAmount,
  formatCurrency,
  formatDate,
  formatDateTime,
  formatPaymentMethod,
  formatPaymentType,
  formatReference,
  toNumber,
} from "../../utils";

export default function PaymentViewPage() {
  const router = useRouter();
  const params = useParams();

  const paymentId = params?.id;

  const [payment, setPayment] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // ==========================================
  // LOAD PAYMENT
  // ==========================================

  useEffect(() => {
    if (!paymentId) {
      return;
    }

    const loadPayment = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getPaymentById(paymentId);

        const paymentData = response?.data || response?.payment || response;

        setPayment(paymentData);
      } catch (err) {
        console.error("Payment Details Error:", err);

        setError(err.message || "Failed to load payment details.");
      } finally {
        setLoading(false);
      }
    };

    loadPayment();
  }, [paymentId]);

  // ==========================================
  // BACK
  // ==========================================

  const handleBack = () => {
    router.push("/admin1/payment");
  };

  // ==========================================
  // EDIT
  // ==========================================

  const handleEdit = () => {
    if (!paymentId) {
      return;
    }

    router.push(`/admin1/payment/edit/${paymentId}`);
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="mx-auto flex min-h-[500px] max-w-5xl items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 size={36} className="animate-spin text-blue-600" />

            <p className="text-sm text-gray-500">Loading payment details...</p>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error || !payment) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="mx-auto w-full max-w-5xl">
          <button
            type="button"
            onClick={handleBack}
            className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-gray-600 transition hover:text-blue-600"
          >
            <ArrowLeft size={17} />
            Back to Payments
          </button>

          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-600">
                <ReceiptText size={20} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-red-700">
                  Payment Not Found
                </h2>

                <p className="mt-1 text-sm text-red-600">
                  {error || "The requested payment could not be found."}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleBack}
              className="mt-5 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              Back to Payments
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // PAYMENT DATA
  // ==========================================

  const id = payment?._id || payment?.id || "-";

  // ==========================================
  // INVOICE DATA
  // ==========================================

  const invoice =
    typeof payment?.invoiceId === "object"
      ? payment.invoiceId
      : payment?.invoice;

  const invoiceId =
    typeof payment?.invoiceId === "string"
      ? payment.invoiceId
      : invoice?._id || invoice?.id || "-";

  const invoiceNumber =
    invoice?.invoiceNumber ||
    invoice?.invoiceNo ||
    invoice?.number ||
    payment?.invoiceNumber ||
    payment?.invoiceNo ||
    "-";

  const invoiceAmount = toNumber(
    payment?.invoiceAmount ??
      invoice?.totalAmount ??
      invoice?.grandTotal ??
      invoice?.amount ??
      0,
  );

  // ==========================================
  // PAYMENT DATA
  // ==========================================

  const paymentAmount = toNumber(
    payment?.amount ?? payment?.paidAmount ?? payment?.paymentAmount ?? 0,
  );

  const paymentDate =
    payment?.paymentDate || payment?.date || payment?.createdAt;

  const paymentMethod = payment?.paymentMethod || payment?.method || "-";

  const paymentType = payment?.paymentType || payment?.type || "";

  const reference =
    payment?.transactionReference ||
    payment?.referenceNumber ||
    payment?.transactionId ||
    payment?.reference ||
    "-";

  const notes = payment?.notes || "-";

  const status = payment?.status || "Pending";

  // ==========================================
  // REMAINING BALANCE
  // ==========================================

  const paidBeforePayment = toNumber(
    payment?.paidBeforePayment ?? payment?.previousPaidAmount ?? 0,
  );

  const remainingAmount =
    payment?.remainingAmount !== undefined
      ? toNumber(payment.remainingAmount)
      : Math.max(invoiceAmount - paidBeforePayment - paymentAmount, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="mx-auto w-full max-w-5xl">
        {/* ====================================
            TOP HEADER
        ===================================== */}

        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <button
              type="button"
              onClick={handleBack}
              className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-gray-600 transition hover:text-blue-600"
            >
              <ArrowLeft size={17} />
              Back to Payments
            </button>

            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
                <ReceiptText size={23} />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Payment Details
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                  View complete payment information
                </p>
              </div>
            </div>
          </div>

          {/* EDIT BUTTON */}

          <button
            type="button"
            onClick={handleEdit}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <Edit size={17} />
            Edit Payment
          </button>
        </div>

        {/* ====================================
            PAYMENT AMOUNT HERO
        ===================================== */}

        <div className="mb-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="p-6">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Payment Received
                </p>

                <div className="mt-2 flex items-center gap-2">
                  <IndianRupee size={28} className="text-green-600" />

                  <span className="text-3xl font-bold text-gray-800">
                    {formatAmount(paymentAmount)}
                  </span>
                </div>

                <p className="mt-2 text-xs text-gray-500">
                  Payment ID:{" "}
                  <span className="font-medium text-gray-700">{id}</span>
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-green-50 text-green-600">
                  <Wallet size={26} />
                </div>

                <PaymentBadge status={status} />
              </div>
            </div>
          </div>
        </div>

        {/* ====================================
            SUMMARY CARDS
        ===================================== */}

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* INVOICE */}

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <FileText size={19} />
              </div>

              <div>
                <p className="text-xs text-gray-500">Invoice Amount</p>

                <p className="mt-1 text-lg font-bold text-gray-800">
                  {formatCurrency(invoiceAmount)}
                </p>
              </div>
            </div>
          </div>

          {/* PAYMENT */}

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-600">
                <IndianRupee size={19} />
              </div>

              <div>
                <p className="text-xs text-gray-500">This Payment</p>

                <p className="mt-1 text-lg font-bold text-green-600">
                  {formatCurrency(paymentAmount)}
                </p>
              </div>
            </div>
          </div>

          {/* REMAINING */}

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-600">
                <Wallet size={19} />
              </div>

              <div>
                <p className="text-xs text-gray-500">Remaining Balance</p>

                <p className="mt-1 text-lg font-bold text-red-600">
                  {formatCurrency(remainingAmount)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ====================================
            DETAILS
        ===================================== */}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* ==================================
              PAYMENT INFORMATION
          =================================== */}

          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 px-5 py-4">
              <h2 className="text-base font-bold text-gray-800">
                Payment Information
              </h2>
            </div>

            <div className="divide-y divide-gray-100">
              {/* PAYMENT DATE */}

              <div className="flex items-center justify-between gap-4 px-5 py-4">
                <div className="flex items-center gap-3">
                  <CalendarDays size={18} className="text-gray-400" />

                  <span className="text-sm text-gray-500">Payment Date</span>
                </div>

                <span className="text-right text-sm font-semibold text-gray-800">
                  {formatDate(paymentDate)}
                </span>
              </div>

              {/* PAYMENT METHOD */}

              <div className="flex items-center justify-between gap-4 px-5 py-4">
                <div className="flex items-center gap-3">
                  <CreditCard size={18} className="text-gray-400" />

                  <span className="text-sm text-gray-500">Payment Method</span>
                </div>

                <span className="text-right text-sm font-semibold text-gray-800">
                  {formatPaymentMethod(paymentMethod)}
                </span>
              </div>

              {/* PAYMENT TYPE */}

              {paymentType && (
                <div className="flex items-center justify-between gap-4 px-5 py-4">
                  <div className="flex items-center gap-3">
                    <ReceiptText size={18} className="text-gray-400" />

                    <span className="text-sm text-gray-500">Payment Type</span>
                  </div>

                  <span className="text-right text-sm font-semibold text-gray-800">
                    {formatPaymentType(paymentType)}
                  </span>
                </div>
              )}

              {/* REFERENCE */}

              <div className="flex items-start justify-between gap-4 px-5 py-4">
                <div className="flex items-center gap-3">
                  <Hash size={18} className="text-gray-400" />

                  <span className="text-sm text-gray-500">
                    Transaction Reference
                  </span>
                </div>

                <span className="max-w-[220px] break-all text-right text-sm font-semibold text-gray-800">
                  {formatReference(reference)}
                </span>
              </div>

              {/* STATUS */}

              <div className="flex items-center justify-between gap-4 px-5 py-4">
                <div className="flex items-center gap-3">
                  <Wallet size={18} className="text-gray-400" />

                  <span className="text-sm text-gray-500">Status</span>
                </div>

                <PaymentBadge status={status} />
              </div>
            </div>
          </div>

          {/* ==================================
              INVOICE INFORMATION
          =================================== */}

          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 px-5 py-4">
              <h2 className="text-base font-bold text-gray-800">
                Invoice Information
              </h2>
            </div>

            <div className="divide-y divide-gray-100">
              {/* INVOICE NUMBER */}

              <div className="flex items-center justify-between gap-4 px-5 py-4">
                <div className="flex items-center gap-3">
                  <FileText size={18} className="text-gray-400" />

                  <span className="text-sm text-gray-500">Invoice Number</span>
                </div>

                <span className="text-right text-sm font-semibold text-blue-600">
                  {invoiceNumber}
                </span>
              </div>

              {/* INVOICE ID */}

              <div className="flex items-start justify-between gap-4 px-5 py-4">
                <div className="flex items-center gap-3">
                  <Hash size={18} className="text-gray-400" />

                  <span className="text-sm text-gray-500">Invoice ID</span>
                </div>

                <span className="max-w-[220px] break-all text-right text-xs font-medium text-gray-700">
                  {invoiceId}
                </span>
              </div>

              {/* TOTAL */}

              <div className="flex items-center justify-between gap-4 px-5 py-4">
                <div className="flex items-center gap-3">
                  <IndianRupee size={18} className="text-gray-400" />

                  <span className="text-sm text-gray-500">Invoice Total</span>
                </div>

                <span className="text-right text-sm font-bold text-gray-800">
                  {formatCurrency(invoiceAmount)}
                </span>
              </div>

              {/* CURRENT PAYMENT */}

              <div className="flex items-center justify-between gap-4 px-5 py-4">
                <div className="flex items-center gap-3">
                  <IndianRupee size={18} className="text-gray-400" />

                  <span className="text-sm text-gray-500">Current Payment</span>
                </div>

                <span className="text-right text-sm font-bold text-green-600">
                  {formatCurrency(paymentAmount)}
                </span>
              </div>

              {/* REMAINING */}

              <div className="flex items-center justify-between gap-4 px-5 py-4">
                <div className="flex items-center gap-3">
                  <Wallet size={18} className="text-gray-400" />

                  <span className="text-sm text-gray-500">Remaining</span>
                </div>

                <span className="text-right text-sm font-bold text-red-600">
                  {formatCurrency(remainingAmount)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ====================================
            NOTES
        ===================================== */}

        <div className="mt-6 rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-5 py-4">
            <h2 className="text-base font-bold text-gray-800">Payment Notes</h2>
          </div>

          <div className="px-5 py-5">
            <p className="whitespace-pre-wrap text-sm leading-6 text-gray-600">
              {notes}
            </p>
          </div>
        </div>

        {/* ====================================
            CREATED / UPDATED
        ===================================== */}

        <div className="mt-6 rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-medium text-gray-500">Created At</p>

              <p className="mt-1 text-sm font-semibold text-gray-700">
                {formatDateTime(payment?.createdAt)}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium text-gray-500">Last Updated</p>

              <p className="mt-1 text-sm font-semibold text-gray-700">
                {formatDateTime(payment?.updatedAt)}
              </p>
            </div>
          </div>
        </div>

        {/* ====================================
            BOTTOM ACTIONS
        ===================================== */}

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            <ArrowLeft size={17} />
            Back
          </button>

          <button
            type="button"
            onClick={handleEdit}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <Edit size={17} />
            Edit Payment
          </button>
        </div>
      </div>
    </div>
  );
}
