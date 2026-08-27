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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-100">
              <Loader2 className="h-7 w-7 animate-spin text-blue-600" />
            </div>

            <h2 className="mt-4 text-lg font-semibold text-gray-800">
              Loading Quotation
            </h2>

            <p className="mt-1 text-sm text-gray-500">Please wait...</p>
          </div>
        </div>
      </div>
    );
  }

  /*
   * ==========================================
   * ERROR
   * ==========================================
   */

  if (error && !quotation) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
              <AlertCircle className="h-7 w-7 text-red-600" />
            </div>

            <h2 className="mt-4 text-lg font-semibold text-gray-900">
              Quotation Not Found
            </h2>

            <p className="mt-2 text-sm text-gray-500">{error}</p>

            <button
              type="button"
              onClick={() => router.push("/admin1/quotation")}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Quotations
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* =====================================
            HEADER
        ===================================== */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.push("/admin1/quotation")}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-300 bg-white text-gray-600 shadow-sm hover:bg-gray-50"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="hidden h-11 w-11 items-center justify-center rounded-xl bg-blue-100 sm:flex">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Quotation Details
                </h1>

                <p className="text-sm text-gray-500">{getQuotationNumber()}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleEdit}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            >
              <Edit className="h-4 w-4" />
              Edit
            </button>

            <button
              type="button"
              onClick={handleDelete}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-700"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          </div>
        </div>

        {/* =====================================
            ERROR
        ===================================== */}

        {error && quotation && (
          <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
            <AlertCircle className="mt-0.5 h-5 w-5 text-red-600" />

            <p className="text-sm font-medium text-red-700">{error}</p>
          </div>
        )}

        {/* =====================================
            QUOTATION HEADER CARD
        ===================================== */}

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 bg-gray-50 px-5 py-5 sm:px-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                  Quotation Number
                </p>

                <h2 className="mt-1 text-2xl font-bold text-gray-900">
                  {getQuotationNumber()}
                </h2>
              </div>

              <QuotationBadge status={quotation?.status || "draft"} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-4">
            {/* Quotation Date */}
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100">
                <CalendarDays className="h-5 w-5 text-blue-600" />
              </div>

              <div>
                <p className="text-xs text-gray-500">Quotation Date</p>

                <p className="mt-1 text-sm font-semibold text-gray-800">
                  {formatDate(quotationDate)}
                </p>
              </div>
            </div>

            {/* Valid Until */}
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-100">
                <CalendarDays className="h-5 w-5 text-orange-600" />
              </div>

              <div>
                <p className="text-xs text-gray-500">Valid Until</p>

                <p className="mt-1 text-sm font-semibold text-gray-800">
                  {formatDate(validUntil)}
                </p>
              </div>
            </div>

            {/* Customer */}
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-100">
                <User className="h-5 w-5 text-green-600" />
              </div>

              <div className="min-w-0">
                <p className="text-xs text-gray-500">Customer</p>

                <p className="mt-1 truncate text-sm font-semibold text-gray-800">
                  {getCustomerName()}
                </p>
              </div>
            </div>

            {/* Total */}
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100">
                <IndianRupee className="h-5 w-5 text-indigo-600" />
              </div>

              <div>
                <p className="text-xs text-gray-500">Grand Total</p>

                <p className="mt-1 text-sm font-bold text-gray-900">
                  {formatAmount(grandTotal)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================
            CUSTOMER INFORMATION
        ===================================== */}

        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-5 py-4 sm:px-6">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              <User className="h-5 w-5 text-blue-600" />
              Customer Information
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 lg:grid-cols-3 sm:p-6">
            {/* Name */}
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Customer Name
              </p>

              <p className="mt-1 text-sm font-semibold text-gray-800">
                {getCustomerName()}
              </p>
            </div>

            {/* Email */}
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Email
              </p>

              <div className="mt-1 flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-400" />

                <p className="truncate text-sm text-gray-700">
                  {getCustomerEmail()}
                </p>
              </div>
            </div>

            {/* Phone */}
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Phone
              </p>

              <div className="mt-1 flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-400" />

                <p className="text-sm text-gray-700">{getCustomerPhone()}</p>
              </div>
            </div>

            {/* Address */}
            <div className="sm:col-span-2 lg:col-span-3">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Address
              </p>

              <div className="mt-1 flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />

                <p className="text-sm leading-6 text-gray-700">
                  {getCustomerAddress()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================
            ITEMS
        ===================================== */}

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-5 py-4 sm:px-6">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              <FileText className="h-5 w-5 text-blue-600" />
              Quotation Items
            </h2>
          </div>

          {/* Desktop */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    #
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Description
                  </th>

                  <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Qty
                  </th>

                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Rate
                  </th>

                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Amount
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {items.length > 0 ? (
                  items.map((item, index) => {
                    const quantity = Number(item?.quantity || 0);

                    const rate = Number(item?.rate || item?.unitPrice || 0);

                    const amount = Number(
                      item?.amount ?? item?.total ?? quantity * rate,
                    );

                    return (
                      <tr
                        key={item?._id || item?.id || index}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-5 py-4 text-sm text-gray-500">
                          {index + 1}
                        </td>

                        <td className="px-5 py-4">
                          <p className="text-sm font-medium text-gray-800">
                            {item?.description ||
                              item?.name ||
                              item?.itemName ||
                              "-"}
                          </p>
                        </td>

                        <td className="px-5 py-4 text-center text-sm text-gray-700">
                          {quantity}
                        </td>

                        <td className="px-5 py-4 text-right text-sm text-gray-700">
                          {formatAmount(rate)}
                        </td>

                        <td className="px-5 py-4 text-right text-sm font-semibold text-gray-800">
                          {formatAmount(amount)}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-5 py-10 text-center text-sm text-gray-500"
                    >
                      No quotation items found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile */}
          <div className="divide-y divide-gray-100 md:hidden">
            {items.length > 0 ? (
              items.map((item, index) => {
                const quantity = Number(item?.quantity || 0);

                const rate = Number(item?.rate || item?.unitPrice || 0);

                const amount = Number(
                  item?.amount ?? item?.total ?? quantity * rate,
                );

                return (
                  <div key={item?._id || item?.id || index} className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs text-gray-400">
                          Item {index + 1}
                        </p>

                        <p className="mt-1 text-sm font-semibold text-gray-800">
                          {item?.description ||
                            item?.name ||
                            item?.itemName ||
                            "-"}
                        </p>
                      </div>

                      <p className="text-sm font-bold text-gray-800">
                        {formatAmount(amount)}
                      </p>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-3 rounded-xl bg-gray-50 p-3">
                      <div>
                        <p className="text-xs text-gray-500">Quantity</p>

                        <p className="mt-1 text-sm font-medium text-gray-700">
                          {quantity}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-xs text-gray-500">Rate</p>

                        <p className="mt-1 text-sm font-medium text-gray-700">
                          {formatAmount(rate)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-sm text-gray-500">
                No quotation items found.
              </div>
            )}
          </div>
        </div>

        {/* =====================================
            TOTALS
        ===================================== */}

        <div className="flex justify-end">
          <div className="w-full rounded-2xl border border-gray-200 bg-white shadow-sm sm:max-w-md">
            <div className="space-y-3 p-5 sm:p-6">
              {/* Subtotal */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Subtotal</span>

                <span className="text-sm font-medium text-gray-800">
                  {formatAmount(subtotal)}
                </span>
              </div>

              {/* Discount */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Discount</span>

                <span className="text-sm font-medium text-red-600">
                  - {formatAmount(discount)}
                </span>
              </div>

              {/* Tax */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Tax</span>

                <span className="text-sm font-medium text-gray-800">
                  {formatAmount(tax)}
                </span>
              </div>

              <div className="border-t border-gray-200 pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-base font-semibold text-gray-900">
                    Grand Total
                  </span>

                  <span className="text-xl font-bold text-blue-600">
                    {formatAmount(grandTotal)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================
            NOTES
        ===================================== */}

        {quotation?.notes && (
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 px-5 py-4 sm:px-6">
              <h2 className="text-lg font-semibold text-gray-900">Notes</h2>
            </div>

            <div className="p-5 sm:p-6">
              <p className="whitespace-pre-wrap text-sm leading-6 text-gray-600">
                {quotation.notes}
              </p>
            </div>
          </div>
        )}

        {/* =====================================
            FOOTER ACTIONS
        ===================================== */}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => router.push("/admin1/quotation")}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          <button
            type="button"
            onClick={handleEdit}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <Edit className="h-4 w-4" />
            Edit Quotation
          </button>
        </div>

        {/* =====================================
            DELETE MODAL
        ===================================== */}

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
    </div>
  );
}
