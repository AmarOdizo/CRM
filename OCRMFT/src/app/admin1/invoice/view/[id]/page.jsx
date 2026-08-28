"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Pencil,
  FileText,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Printer,
  FileSpreadsheet
} from "lucide-react";

import StatusBadge from "../../invoicecomponents/StatusBadge";
import PaymentBadge from "../../invoicecomponents/PaymentBadge";
import { getInvoiceById } from "../../data";

export default function ViewInvoicePage({ params }) {
  const { id } = use(params);

  const [invoice, setInvoice] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(amount || 0));
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="rounded-2xl border border-slate-200 bg-white px-12 py-10 shadow-sm text-center">
          <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-lg font-bold text-slate-700">Loading Invoice...</h2>
          <p className="text-sm text-slate-400 mt-1">Please wait while we retrieve invoice details.</p>
        </div>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-md rounded-2xl border border-rose-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 text-rose-600 mb-4">
            <FileText size={26} />
          </div>
          <h2 className="text-2xl font-black text-rose-600">Invoice Not Found</h2>
          <p className="mt-2 text-sm text-slate-500 leading-relaxed mb-6">
            {error || "The requested invoice deliverable could not be found."}
          </p>

          <Link
            href="/admin1/invoice"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/20 active:scale-95 cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Back to Invoices</span>
          </Link>
        </div>
      </div>
    );
  }

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
    <div className="min-h-screen bg-slate-50 p-6 print:bg-white print:p-0">
      <div className="mx-auto max-w-4xl">
        {/* PAGE HEADER */}
        <div className="mb-8 flex items-center justify-between print:hidden">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Invoice Details</h1>
            <p className="mt-1 text-slate-500 font-medium">Review customer invoices and billing statements.</p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900 active:scale-95 cursor-pointer"
            >
              <Printer size={16} />
              <span>Print Invoice</span>
            </button>

            <Link
              href={`/admin1/invoice/edit/${id}`}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition duration-300 hover:shadow-xl active:scale-95 cursor-pointer"
            >
              <Pencil size={16} />
              <span>Edit Invoice</span>
            </Link>

            <Link
              href="/admin1/invoice"
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900 active:scale-95 cursor-pointer"
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </Link>
          </div>
        </div>

        {/* INVOICE SHEET */}
        <div
          id="invoice-print"
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm print:rounded-none print:border-0 print:shadow-none"
        >
          {/* INVOICE HEADER BLOCK */}
          <div className="border-b border-slate-100 p-8 md:p-10 bg-slate-50/50">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2 text-blue-600 font-black tracking-tight text-xl mb-3">
                  <FileSpreadsheet size={24} />
                  <span>ODIZO CRM</span>
                </div>
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">Invoice #{invoiceNumber}</h2>
                <p className="mt-1.5 text-xs text-slate-400 font-semibold uppercase tracking-wider">Statement of Account</p>
              </div>

              <div className="sm:text-right flex flex-row sm:flex-col gap-3 sm:gap-2 items-center sm:items-end justify-start">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status</span>
                <StatusBadge status={invoice.status} />
              </div>
            </div>
          </div>

          {/* CUSTOMER & DETAILS GRID */}
          <div className="grid grid-cols-1 gap-8 border-b border-slate-100 p-8 md:grid-cols-2 md:p-10">
            {/* Customer Details */}
            <div>
              <span className="mb-3 block text-xs font-bold uppercase tracking-wider text-slate-400">
                Bill To
              </span>
              <h3 className="text-lg font-black text-slate-800 tracking-tight">
                {customerName}
              </h3>
              <div className="mt-3.5 space-y-2 text-sm font-medium text-slate-500">
                {customerEmail && (
                  <div className="flex items-center gap-2">
                    <Mail size={14} className="text-slate-400 shrink-0" />
                    <span>{customerEmail}</span>
                  </div>
                )}
                {customerPhone && (
                  <div className="flex items-center gap-2">
                    <Phone size={14} className="text-slate-400 shrink-0" />
                    <span>{customerPhone}</span>
                  </div>
                )}
                {customerAddress && (
                  <div className="flex items-start gap-2">
                    <MapPin size={14} className="text-slate-400 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{customerAddress}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Billing Metadata */}
            <div>
              <span className="mb-3 block text-xs font-bold uppercase tracking-wider text-slate-400">
                Billing Info
              </span>
              <div className="space-y-3.5 text-sm font-medium">
                <div className="flex justify-between items-center text-slate-500">
                  <span>Invoice Reference</span>
                  <span className="font-bold text-slate-800">{invoiceNumber}</span>
                </div>

                <div className="flex justify-between items-center text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-slate-400" />
                    Invoice Date
                  </span>
                  <span className="font-semibold text-slate-700">
                    {formatDate(invoice.invoiceDate)}
                  </span>
                </div>

                <div className="flex justify-between items-center text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-slate-400" />
                    Due Date
                  </span>
                  <span className="font-semibold text-slate-700">
                    {formatDate(invoice.dueDate)}
                  </span>
                </div>

                <div className="flex justify-between items-center text-slate-500">
                  <span>Payment Condition</span>
                  <PaymentBadge paymentStatus={invoice.paymentStatus} />
                </div>
              </div>
            </div>
          </div>

          {/* LINE ITEMS TABLE */}
          <div className="p-8 md:p-10">
            <span className="mb-4 block text-xs font-bold uppercase tracking-wider text-slate-400">
              Billing Items
            </span>

            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full min-w-[600px] border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-400 w-12">
                      #
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                      Description
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-slate-400 w-24">
                      Qty
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider text-slate-400 w-32">
                      Rate
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider text-slate-400 w-36">
                      Amount
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 font-medium">
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                        No invoice statement details available.
                      </td>
                    </tr>
                  ) : (
                    items.map((item, index) => {
                      const quantity = Number(item.quantity || 0);
                      const rate = Number(item.rate || 0);
                      const amount = Number(item.amount ?? quantity * rate);

                      return (
                        <tr key={item._id || item.id || index} className="text-slate-600">
                          <td className="px-4 py-4 text-slate-400">
                            {index + 1}
                          </td>
                          <td className="px-4 py-4 text-slate-800 font-semibold">
                            {item.description || item.name || "-"}
                          </td>
                          <td className="px-4 py-4 text-center">
                            {quantity}
                          </td>
                          <td className="px-4 py-4 text-right">
                            {formatCurrency(rate)}
                          </td>
                          <td className="px-4 py-4 text-right text-slate-800 font-bold font-mono">
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

          {/* INVOICE SUMMARY SPLIT */}
          <div className="border-t border-slate-100 p-8 md:p-10 flex flex-col md:flex-row gap-6 md:justify-between items-start">
            {/* Notes Section */}
            <div className="w-full md:max-w-md">
              {invoice.notes ? (
                <div>
                  <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                    Payment Instructions & Terms
                  </span>
                  <p className="whitespace-pre-wrap text-xs leading-relaxed text-slate-500 font-medium p-4 bg-slate-50/50 rounded-xl border border-slate-200/40">
                    {invoice.notes}
                  </p>
                </div>
              ) : (
                <div className="text-xs text-slate-400 italic">No notes provided for this invoice.</div>
              )}
            </div>

            {/* Calculations Summary */}
            <div className="w-full md:max-w-xs space-y-3 text-sm font-medium">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-700">{formatCurrency(subtotal)}</span>
              </div>

              <div className="flex justify-between text-slate-500">
                <span>Tax ({tax}%)</span>
                <span className="font-semibold text-slate-700">{formatCurrency(taxAmount)}</span>
              </div>

              <div className="flex justify-between text-slate-500">
                <span>Discount ({discount}%)</span>
                <span className="font-semibold text-rose-600">-{formatCurrency(discountAmount)}</span>
              </div>

              <div className="border-t border-slate-100 pt-4 mt-2">
                <div className="flex items-center justify-between text-base font-black text-slate-800 tracking-tight">
                  <span>Grand Total</span>
                  <span className="text-xl text-blue-600 font-mono">{formatCurrency(totalAmount)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer remarks */}
          <div className="border-t border-slate-100 py-6 text-center text-xs text-slate-400 font-medium">
            Thank you for your business. For query, please write to support@odizo.com.
          </div>
        </div>
      </div>

      {/* PRINT STYLE OVERLAYS */}
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
            margin: 15mm;
          }
        }
      `}</style>
    </div>
  );
}
