"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Edit,
  Trash2,
  FileText,
  User,
  CalendarDays,
  Mail,
  Phone,
  MapPin,
  Loader2,
  AlertCircle,
  IndianRupee,
} from "lucide-react";

import QuotationBadge from "../../quotationcomponents/QuotationBadge";
import DeleteModal from "../../quotationcomponents/DeleteModal";

const API_URL = "http://localhost:5000/api/Quotation";

export default function ViewQuotationPage() {
  const router = useRouter();
  const params = useParams();

  const quotationId = params?.id;

  const [quotation, setQuotation] = useState(null);

  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [error, setError] = useState("");

  /*
   * ==========================================
   * FETCH QUOTATION
   * ==========================================
   */
  const fetchQuotation = async () => {
    if (!quotationId) return;

    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/${quotationId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          result?.message || result?.error || "Failed to fetch quotation",
        );
      }

      const quotationData = result?.data || result?.quotation || result;

      setQuotation(quotationData);
    } catch (err) {
      console.error("Fetch quotation error:", err);

      setError(err?.message || "Unable to load quotation.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotation();
  }, [quotationId]);

  /*
   * ==========================================
   * HELPERS
   * ==========================================
   */

  const getQuotationNumber = () => {
    return (
      quotation?.quotationNumber ||
      quotation?.quotationNo ||
      quotation?.quoteNumber ||
      quotation?.number ||
      `#${quotation?.id || quotation?._id || "-"}`
    );
  };

  const getCustomer = () => {
    return quotation?.customer || quotation?.customerDetails || {};
  };

  const customer = getCustomer();

  const getCustomerName = () => {
    return (
      quotation?.customerName ||
      customer?.name ||
      customer?.customerName ||
      customer?.companyName ||
      "N/A"
    );
  };

  const getCustomerEmail = () => {
    return (
      quotation?.customerEmail || customer?.email || quotation?.email || "-"
    );
  };

  const getCustomerPhone = () => {
    return (
      quotation?.customerPhone ||
      customer?.phone ||
      customer?.mobile ||
      quotation?.phone ||
      "-"
    );
  };

  const getCustomerAddress = () => {
    return (
      quotation?.customerAddress ||
      customer?.address ||
      customer?.billingAddress ||
      "-"
    );
  };

  const getItems = () => {
    return Array.isArray(quotation?.items) ? quotation.items : [];
  };

  const items = getItems();

  const getAmount = (value) => {
    return Number(value || 0);
  };

  const subtotal = getAmount(quotation?.subtotal);

  const discount = getAmount(quotation?.discount);

  const tax = getAmount(quotation?.tax);

  const grandTotal = getAmount(
    quotation?.grandTotal ?? quotation?.totalAmount ?? quotation?.total,
  );

  const formatAmount = (amount) => {
    return amount.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    });
  };

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

  /*
   * ==========================================
   * DATE FIELDS
   * ==========================================
   */

  const quotationDate =
    quotation?.quotationDate || quotation?.date || quotation?.createdAt;

  const validUntil =
    quotation?.validUntil || quotation?.validTill || quotation?.expiryDate;

  /*
   * ==========================================
   * EDIT
   * ==========================================
   */

  const handleEdit = () => {
    router.push(`/admin1/quotation/edit/${quotationId}`);
  };

  /*
   * ==========================================
   * DELETE
   * ==========================================
   */

  const handleDelete = () => {
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!quotationId) return;

    try {
      setDeleteLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/${quotationId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          result?.message || result?.error || "Failed to delete quotation",
        );
      }

      setDeleteModalOpen(false);

      router.push("/admin1/quotation");
    } catch (err) {
      console.error("Delete quotation error:", err);

      setError(err?.message || "Unable to delete quotation.");
    } finally {
      setDeleteLoading(false);
    }
  };

  /*
   * ==========================================
   * LOADING
   * ==========================================
   */

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="rounded-2xl border border-slate-200 bg-white px-12 py-10 shadow-sm text-center">
          <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-lg font-bold text-slate-700">Loading Proposal...</h2>
          <p className="text-sm text-slate-400 mt-1">Please wait while we retrieve estimation details.</p>
        </div>
      </div>
    );
  }

  if (error || !quotation) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-md rounded-2xl border border-rose-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 text-rose-600 mb-4">
            <AlertCircle size={26} />
          </div>
          <h2 className="text-2xl font-black text-rose-600">Proposal Not Found</h2>
          <p className="mt-2 text-sm text-slate-500 leading-relaxed mb-6">
            {error || "The requested quotation proposal could not be found."}
          </p>

          <button
            onClick={() => router.push("/admin1/quotation")}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/20 active:scale-95 cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Back to Quotations</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 print:bg-white print:p-0">
      <div className="mx-auto max-w-4xl">
        {/* PAGE HEADER */}
        <div className="mb-8 flex items-center justify-between print:hidden">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Proposal Estimates</h1>
            <p className="mt-1 text-slate-500 font-medium">Review customer proposals, items, and billing calculations.</p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900 active:scale-95 cursor-pointer"
            >
              <Printer size={16} />
              <span>Print Quote</span>
            </button>

            <button
              onClick={handleEdit}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900 active:scale-95 cursor-pointer"
            >
              <Edit size={16} />
              <span>Edit</span>
            </button>

            <button
              onClick={handleDelete}
              className="flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-3 font-semibold text-white shadow-lg shadow-rose-500/10 hover:bg-rose-700 transition active:scale-95 cursor-pointer"
            >
              <Trash2 size={16} />
              <span>Delete</span>
            </button>
          </div>
        </div>

        {/* PROPOSAL DOCUMENT */}
        <div
          id="quotation-print"
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm print:rounded-none print:border-0 print:shadow-none"
        >
          {/* HEADER BLOCK */}
          <div className="border-b border-slate-100 p-8 md:p-10 bg-slate-50/50">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2 text-blue-600 font-black tracking-tight text-xl mb-3">
                  <FileText size={24} />
                  <span>ODIZO CRM</span>
                </div>
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">Quotation #{getQuotationNumber()}</h2>
                <p className="mt-1.5 text-xs text-slate-400 font-semibold uppercase tracking-wider">Estimate Proposal Statement</p>
              </div>

              <div className="sm:text-right flex flex-row sm:flex-col gap-3 sm:gap-2 items-center sm:items-end justify-start">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status</span>
                <QuotationBadge status={quotation.status} />
              </div>
            </div>
          </div>

          {/* CUSTOMER & DETAILS GRID */}
          <div className="grid grid-cols-1 gap-8 border-b border-slate-100 p-8 md:grid-cols-2 md:p-10">
            {/* Customer Details */}
            <div>
              <span className="mb-3 block text-xs font-bold uppercase tracking-wider text-slate-400">
                Prepared For
              </span>
              <h3 className="text-lg font-black text-slate-800 tracking-tight">
                {getCustomerName()}
              </h3>
              <div className="mt-3.5 space-y-2 text-sm font-medium text-slate-500">
                {getCustomerEmail() !== "-" && (
                  <div className="flex items-center gap-2">
                    <Mail size={14} className="text-slate-400 shrink-0" />
                    <span>{getCustomerEmail()}</span>
                  </div>
                )}
                {getCustomerPhone() !== "-" && (
                  <div className="flex items-center gap-2">
                    <Phone size={14} className="text-slate-400 shrink-0" />
                    <span>{getCustomerPhone()}</span>
                  </div>
                )}
                {getCustomerAddress() !== "-" && (
                  <div className="flex items-start gap-2">
                    <MapPin size={14} className="text-slate-400 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{getCustomerAddress()}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Proposal Metadata */}
            <div>
              <span className="mb-3 block text-xs font-bold uppercase tracking-wider text-slate-400">
                Proposal Details
              </span>
              <div className="space-y-3.5 text-sm font-medium">
                <div className="flex justify-between items-center text-slate-500">
                  <span>Proposal Reference</span>
                  <span className="font-bold text-slate-800">{getQuotationNumber()}</span>
                </div>

                <div className="flex justify-between items-center text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <CalendarDays size={14} className="text-slate-400" />
                    Proposal Date
                  </span>
                  <span className="font-semibold text-slate-700">
                    {formatDate(quotationDate)}
                  </span>
                </div>

                <div className="flex justify-between items-center text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <CalendarDays size={14} className="text-slate-400" />
                    Valid Until
                  </span>
                  <span className="font-semibold text-slate-700">
                    {formatDate(validUntil)}
                  </span>
                </div>

                <div className="flex justify-between items-center text-slate-500">
                  <span>Compiled By</span>
                  <span className="font-bold text-slate-800">{quotation.createdBy || "Admin"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ESTIMATED ITEMS TABLE */}
          <div className="p-8 md:p-10">
            <span className="mb-4 block text-xs font-bold uppercase tracking-wider text-slate-400">
              Proposal Line Items
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
                        No estimation details available.
                      </td>
                    </tr>
                  ) : (
                    items.map((item, index) => {
                      const quantity = Number(item.quantity || 0);
                      const rate = Number(item.rate || item.unitPrice || 0);
                      const amount = Number(item.amount ?? quantity * rate);

                      return (
                        <tr key={item._id || item.id || index} className="text-slate-600">
                          <td className="px-4 py-4 text-slate-400">
                            {index + 1}
                          </td>
                          <td className="px-4 py-4 text-slate-800 font-semibold">
                            {item.productName || item.description || item.name || "-"}
                          </td>
                          <td className="px-4 py-4 text-center">
                            {quantity}
                          </td>
                          <td className="px-4 py-4 text-right">
                            {formatAmount(rate)}
                          </td>
                          <td className="px-4 py-4 text-right text-slate-800 font-bold font-mono">
                            {formatAmount(amount)}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* ESTIMATION SUMMARY SPLIT */}
          <div className="border-t border-slate-100 p-8 md:p-10 flex flex-col md:flex-row gap-6 md:justify-between items-start">
            {/* Notes Section */}
            <div className="w-full md:max-w-md space-y-4">
              {quotation.notes && (
                <div>
                  <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                    Additional Notes
                  </span>
                  <p className="whitespace-pre-wrap text-xs leading-relaxed text-slate-500 font-medium p-4 bg-slate-50/50 rounded-xl border border-slate-200/40">
                    {quotation.notes}
                  </p>
                </div>
              )}

              {quotation.termsAndConditions && (
                <div>
                  <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                    Terms & Conditions
                  </span>
                  <p className="whitespace-pre-wrap text-xs leading-relaxed text-slate-500 font-medium p-4 bg-slate-50/50 rounded-xl border border-slate-200/40">
                    {quotation.termsAndConditions}
                  </p>
                </div>
              )}
            </div>

            {/* Calculations Summary */}
            <div className="w-full md:max-w-xs space-y-3 text-sm font-medium">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-700">{formatAmount(subtotal)}</span>
              </div>

              <div className="flex justify-between text-slate-500">
                <span>Tax</span>
                <span className="font-semibold text-slate-700">{formatAmount(tax)}</span>
              </div>

              <div className="flex justify-between text-slate-500">
                <span>Discount</span>
                <span className="font-semibold text-rose-600">-{formatAmount(discount)}</span>
              </div>

              <div className="border-t border-slate-100 pt-4 mt-2">
                <div className="flex items-center justify-between text-base font-black text-slate-800 tracking-tight">
                  <span>Grand Total</span>
                  <span className="text-xl text-blue-600 font-mono">{formatAmount(grandTotal)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer remarks */}
          <div className="border-t border-slate-100 py-6 text-center text-xs text-slate-400 font-medium">
            This is a system generated estimate proposal. Valid till due date.
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

      {/* DELETE MODAL */}
      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => {
          if (!deleteLoading) {
            setDeleteModalOpen(false);
          }
        }}
        onConfirm={handleConfirmDelete}
        quotation={quotation}
        loading={deleteLoading}
      />
    </div>
  );
}
}
