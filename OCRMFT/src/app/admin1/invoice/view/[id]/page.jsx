"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Edit3,
  FileText,
  Mail,
  Phone,
  MapPin,
  CalendarDays,
  AlertCircle,
  Printer,
} from "lucide-react";

import StatusBadge from "../../invoicecomponents/StatusBadge";
import PaymentBadge from "../../invoicecomponents/PaymentBadge";
import { getInvoiceById } from "../../data";

export default function ViewInvoicePage({ params }) {
  const { id } = use(params);

  const [invoice, setInvoice] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // --------------------------------------------------
  // GET SINGLE INVOICE
  // --------------------------------------------------

  const fetchInvoice = async () => {
    try {
      setLoading(true);
      setError("");
      const invoiceData = await getInvoiceById(id);
      if (!invoiceData) {
        throw new Error("Invoice not found.");
      }
      setInvoice(invoiceData);
    } catch (err) {
      console.error("Fetch invoice error:", err);
      setError(err.message || "Unable to load invoice.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchInvoice();
    }
  }, [id]);

  // --------------------------------------------------
  // DATE FORMAT
  // --------------------------------------------------

  const formatDate = (date) => {
    if (!date) return "-";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "-";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // --------------------------------------------------
  // CURRENCY FORMAT
  // --------------------------------------------------

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(amount || 0));
  };

  // --------------------------------------------------
  // PRINT
  // --------------------------------------------------

  const handlePrint = () => {
    window.print();
  };

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
        <div className="mx-auto max-w-5xl">
          <div className="flex min-h-[500px] items-center justify-center rounded-xl border bg-white shadow-sm">
            <div className="text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

              <p className="mt-4 text-sm text-gray-500">Loading invoice...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // ERROR
  // --------------------------------------------------

  if (error || !invoice) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-xl border border-red-200 bg-red-50 p-6">
            <div className="flex items-start gap-3">
              <AlertCircle size={22} className="mt-0.5 shrink-0 text-red-600" />

              <div>
                <h2 className="font-semibold text-red-700">
                  Unable to load invoice
                </h2>

                <p className="mt-1 text-sm text-red-600">
                  {error || "Invoice not found."}
                </p>
              </div>
            </div>

            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={fetchInvoice}
                className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700"
              >
                Try Again
              </button>

              <Link
                href="/admin1/invoice"
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <ArrowLeft size={17} />
                Back to Invoices
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // INVOICE DATA
  // --------------------------------------------------

  const invoiceNumber =
    invoice.invoiceNumber ||
    invoice.invoiceNo ||
    invoice.invoiceId ||
    `INV-${id}`;

  const customerName = invoice.customerName || "-";

  const customerEmail = invoice.customerEmail || "";

  const customerPhone = invoice.customerPhone || "";

  const customerAddress = invoice.customerAddress || "";

  const subtotal = Number(invoice.subtotal || 0);

  const tax = Number(invoice.tax || 0);

  const taxAmount = Number(invoice.taxAmount ?? (subtotal * tax) / 100);

  const discount = Number(invoice.discount || 0);

  const discountAmount = Number(
    invoice.discountAmount ?? (subtotal * discount) / 100,
  );

  const totalAmount = Number(
    invoice.totalAmount ??
      invoice.grandTotal ??
      invoice.total ??
      subtotal + taxAmount - discountAmount,
  );

  const items = Array.isArray(invoice.items) ? invoice.items : [];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8 print:bg-white print:p-0">
      <div className="mx-auto max-w-5xl">
        {/* ----------------------------------------- */}
        {/* PAGE HEADER */}
        {/* ----------------------------------------- */}

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between print:hidden">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100">
              <FileText size={22} className="text-blue-600" />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Invoice Details
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                View complete invoice information.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              <Printer size={17} />
              Print
            </button>

            <Link
              href={`/admin1/invoice/edit/${id}`}
              className="inline-flex items-center gap-2 rounded-lg bg-yellow-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-yellow-600"
            >
              <Edit3 size={17} />
              Edit
            </Link>

            <Link
              href="/admin1/invoice"
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              <ArrowLeft size={17} />
              Back
            </Link>
          </div>
        </div>

        {/* ----------------------------------------- */}
        {/* INVOICE DOCUMENT */}
        {/* ----------------------------------------- */}

        <div
          id="invoice-print"
          className="overflow-hidden rounded-2xl border bg-white shadow-sm print:rounded-none print:border-0 print:shadow-none"
        >
          {/* --------------------------------------- */}
          {/* INVOICE HEADER */}
          {/* --------------------------------------- */}

          <div className="border-b px-6 py-8 md:px-10">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">INVOICE</h2>

                <p className="mt-2 text-sm text-gray-500">
                  Invoice #{invoiceNumber}
                </p>
              </div>

              <div className="text-left sm:text-right">
                <p className="text-sm font-medium text-gray-500">
                  Invoice Status
                </p>

                <div className="mt-2">
                  <StatusBadge status={invoice.status} />
                </div>
              </div>
            </div>
          </div>

          {/* --------------------------------------- */}
          {/* CUSTOMER + INVOICE INFO */}
          {/* --------------------------------------- */}

          <div className="grid grid-cols-1 gap-8 border-b px-6 py-8 md:grid-cols-2 md:px-10">
            {/* Customer */}
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                Bill To
              </p>

              <h3 className="text-lg font-bold text-gray-800">
                {customerName}
              </h3>

              <div className="mt-3 space-y-2">
                {customerEmail && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail size={15} className="text-gray-400" />

                    <span>{customerEmail}</span>
                  </div>
                )}

                {customerPhone && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone size={15} className="text-gray-400" />

                    <span>{customerPhone}</span>
                  </div>
                )}

                {customerAddress && (
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <MapPin
                      size={15}
                      className="mt-0.5 shrink-0 text-gray-400"
                    />

                    <span>{customerAddress}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Invoice Info */}
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                Invoice Information
              </p>

              <div className="space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-gray-500">Invoice Number</span>

                  <span className="text-sm font-semibold text-gray-800">
                    {invoiceNumber}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="flex items-center gap-2 text-sm text-gray-500">
                    <CalendarDays size={15} />
                    Invoice Date
                  </span>

                  <span className="text-sm font-semibold text-gray-800">
                    {formatDate(invoice.invoiceDate)}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="flex items-center gap-2 text-sm text-gray-500">
                    <CalendarDays size={15} />
                    Due Date
                  </span>

                  <span className="text-sm font-semibold text-gray-800">
                    {formatDate(invoice.dueDate)}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-gray-500">Payment Status</span>

                  <PaymentBadge paymentStatus={invoice.paymentStatus} />
                </div>
              </div>
            </div>
          </div>

          {/* --------------------------------------- */}
          {/* ITEMS */}
          {/* --------------------------------------- */}

          <div className="px-6 py-8 md:px-10">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">
              Invoice Items
            </h3>

            <div className="overflow-x-auto rounded-xl border">
              <table className="w-full min-w-[650px]">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      #
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Description
                    </th>

                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Qty
                    </th>

                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Rate
                    </th>

                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Amount
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {items.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-8 text-center text-sm text-gray-500"
                      >
                        No invoice items available.
                      </td>
                    </tr>
                  ) : (
                    items.map((item, index) => {
                      const quantity = Number(item.quantity || 0);

                      const rate = Number(item.rate || 0);

                      const amount = Number(item.amount ?? quantity * rate);

                      return (
                        <tr key={item._id || item.id || index}>
                          <td className="px-4 py-4 text-sm text-gray-500">
                            {index + 1}
                          </td>

                          <td className="px-4 py-4">
                            <p className="text-sm font-medium text-gray-800">
                              {item.description || item.name || "-"}
                            </p>
                          </td>

                          <td className="px-4 py-4 text-center text-sm text-gray-600">
                            {quantity}
                          </td>

                          <td className="px-4 py-4 text-right text-sm text-gray-600">
                            {formatCurrency(rate)}
                          </td>

                          <td className="px-4 py-4 text-right text-sm font-semibold text-gray-800">
                            {formatCurrency(amount)}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* --------------------------------------- */}
          {/* TOTAL */}
          {/* --------------------------------------- */}

          <div className="border-t px-6 py-8 md:px-10">
            <div className="ml-auto w-full max-w-sm space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>

                <span className="font-medium text-gray-800">
                  {formatCurrency(subtotal)}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Tax ({tax}%)</span>

                <span className="font-medium text-gray-800">
                  {formatCurrency(taxAmount)}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Discount ({discount}%)</span>

                <span className="font-medium text-red-600">
                  -{formatCurrency(discountAmount)}
                </span>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-800">Total</span>

                  <span className="text-2xl font-bold text-blue-600">
                    {formatCurrency(totalAmount)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* --------------------------------------- */}
          {/* NOTES */}
          {/* --------------------------------------- */}

          {invoice.notes && (
            <div className="border-t bg-gray-50 px-6 py-6 md:px-10">
              <h3 className="mb-2 text-sm font-semibold text-gray-800">
                Notes
              </h3>

              <p className="whitespace-pre-wrap text-sm leading-6 text-gray-600">
                {invoice.notes}
              </p>
            </div>
          )}

          {/* --------------------------------------- */}
          {/* FOOTER */}
          {/* --------------------------------------- */}

          <div className="border-t px-6 py-6 text-center md:px-10">
            <p className="text-xs text-gray-400">
              Thank you for your business.
            </p>
          </div>
        </div>
      </div>

      {/* ------------------------------------------- */}
      {/* PRINT CSS */}
      {/* ------------------------------------------- */}

      <style jsx global>{`
        @media print {
          body {
            background: white !important;
          }

          .print\\:hidden {
            display: none !important;
          }

          @page {
            size: A4;
            margin: 12mm;
          }
        }
      `}</style>
    </div>
  );
}
