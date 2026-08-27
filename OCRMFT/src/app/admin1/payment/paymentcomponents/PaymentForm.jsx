"use client";

import { useEffect, useState } from "react";
import { createPayment, updatePayment } from "../data";
import { formatCurrency, toNumber, validatePaymentAmount } from "../utils";
import { getInvoices } from "../../invoice/data";

const initialForm = {
  invoiceId: "",
  amount: "",
  paymentDate: "",
  paymentMethod: "Cash",
  transactionReference: "",
  notes: "",
};

const paymentMethods = [
  "Cash",
  "UPI",
  "Bank Transfer",
  "Cheque",
  "Card",
  "Other",
];

export default function PaymentForm({
  payment = null,
  invoice = null,
  onSuccess,
  onCancel,
}) {
  const isEdit = Boolean(payment);

  const [form, setForm] = useState(initialForm);
  const [remainingAmount, setRemainingAmount] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [invoicesList, setInvoicesList] = useState([]);
  const [loadingInvoices, setLoadingInvoices] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(invoice);

  // ==========================================
  // SET FORM DATA
  // ==========================================

  useEffect(() => {
    if (payment) {
      setForm({
        invoiceId:
          payment.invoiceId?._id ||
          payment.invoiceId ||
          payment.invoice?._id ||
          payment.invoice?.id ||
          "",

        amount: payment.amount ?? payment.paidAmount ?? "",

        paymentDate: payment.paymentDate
          ? new Date(payment.paymentDate).toISOString().split("T")[0]
          : "",

        paymentMethod: payment.paymentMethod || payment.method || "Cash",

        transactionReference:
          payment.transactionReference ||
          payment.referenceNumber ||
          payment.transactionId ||
          "",

        notes: payment.notes || "",
      });

      if (payment.invoiceId && typeof payment.invoiceId === "object") {
        setSelectedInvoice(payment.invoiceId);
      } else if (invoice) {
        setSelectedInvoice(invoice);
      }
      return;
    }

    setForm({
      ...initialForm,

      invoiceId: invoice?._id || invoice?.id || "",
    });
    setSelectedInvoice(invoice);
  }, [payment, invoice]);

  useEffect(() => {
    if (!isEdit && !invoice) {
      const fetchInvoices = async () => {
        try {
          setLoadingInvoices(true);
          const data = await getInvoices();
          setInvoicesList(data || []);
        } catch (err) {
          console.error("Failed to load invoices:", err);
          setError("Failed to load invoices list.");
        } finally {
          setLoadingInvoices(false);
        }
      };
      fetchInvoices();
    }
  }, [isEdit, invoice]);

  // ==========================================
  // CALCULATE REMAINING AMOUNT
  // ==========================================

  useEffect(() => {
    if (!selectedInvoice) {
      setRemainingAmount(0);
      return;
    }

    const totalAmount = toNumber(
      selectedInvoice.totalAmount ?? selectedInvoice.grandTotal ?? selectedInvoice.amount ?? 0,
    );

    const paidAmount = toNumber(
      selectedInvoice.paidAmount ?? selectedInvoice.totalPaid ?? selectedInvoice.amountPaid ?? 0,
    );

    let remaining = totalAmount - paidAmount;

    // While editing, add current payment back
    // so it can be updated without failing validation.
    if (isEdit) {
      remaining += toNumber(payment?.amount ?? payment?.paidAmount ?? 0);
    }

    setRemainingAmount(Math.max(remaining, 0));
  }, [selectedInvoice, payment, isEdit]);

  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const handleInvoiceChange = (e) => {
    const id = e.target.value;
    setForm((prev) => ({
      ...prev,
      invoiceId: id,
    }));
    const found = invoicesList.find((inv) => (inv._id || inv.id) === id);
    setSelectedInvoice(found || null);
    setError("");
    setSuccess("");
  };

  // ==========================================
  // SUBMIT
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // ------------------------------
    // Invoice validation
    // ------------------------------

    if (!form.invoiceId) {
      setError("Invoice is required.");
      return;
    }

    // ------------------------------
    // Amount validation
    // ------------------------------

    const amount = toNumber(form.amount);

    if (amount <= 0) {
      setError("Payment amount must be greater than 0.");
      return;
    }

    if (!isEdit && selectedInvoice) {
      const amountError = validatePaymentAmount(amount, remainingAmount);

      if (amountError) {
        setError(amountError);
        return;
      }
    }

    // ------------------------------
    // Payment date
    // ------------------------------

    if (!form.paymentDate) {
      setError("Payment date is required.");
      return;
    }

    // ------------------------------
    // Payment method
    // ------------------------------

    if (!form.paymentMethod) {
      setError("Payment method is required.");
      return;
    }

    try {
      setLoading(true);

      const paymentData = {
        invoiceId: form.invoiceId,
        amount: amount,
        paymentDate: form.paymentDate,
        paymentMethod: form.paymentMethod,
        transactionReference: form.transactionReference.trim(),
        notes: form.notes.trim(),
      };

      let result;

      // ==================================
      // CREATE
      // POST /api/Payment
      // ==================================

      if (!isEdit) {
        result = await createPayment(paymentData);
      }

      // ==================================
      // UPDATE
      // PUT /api/Payment/:id
      // ==================================
      else {
        const paymentId = payment?._id || payment?.id;

        if (!paymentId) {
          throw new Error("Payment ID is missing.");
        }

        result = await updatePayment(paymentId, paymentData);
      }

      setSuccess(
        isEdit
          ? "Payment updated successfully."
          : "Payment added successfully.",
      );

      // Give parent component updated API response
      if (onSuccess) {
        onSuccess(result);
      }

      // Reset only when adding
      if (!isEdit) {
        setForm({
          ...initialForm,
          invoiceId: form.invoiceId,
        });
      }
    } catch (err) {
      console.error("Payment Form Error:", err);

      setError(err.message || "Something went wrong while saving payment.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // CANCEL
  // ==========================================

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  // ==========================================
  // INVOICE DISPLAY
  // ==========================================

  const invoiceNumber =
    selectedInvoice?.invoiceNumber ||
    selectedInvoice?.invoiceNo ||
    selectedInvoice?.number ||
    payment?.invoiceNumber ||
    payment?.invoiceNo ||
    "";

  const invoiceTotal = toNumber(
    selectedInvoice?.totalAmount ??
      selectedInvoice?.grandTotal ??
      selectedInvoice?.amount ??
      0,
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
    >
      {/* =====================================
          HEADER
      ====================================== */}

      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800">
          {isEdit ? "Edit Payment" : "Add Payment"}
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          {isEdit
            ? "Update payment information."
            : "Enter payment details for the invoice."}
        </p>
      </div>

      {/* =====================================
          ERROR
      ====================================== */}

      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {/* =====================================
          SUCCESS
      ====================================== */}

      {success && (
        <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          {success}
        </div>
      )}

      {/* =====================================
          INVOICE
      ====================================== */}

      <div className="mb-5">
        <label className="mb-2 block text-sm font-semibold text-gray-700">
          Invoice
          {!isEdit && !invoice && <span className="ml-1 text-red-500">*</span>}
        </label>

        {isEdit || invoice ? (
          <>
            <input
              type="text"
              value={invoiceNumber || form.invoiceId}
              readOnly
              className="w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-2.5 text-sm text-gray-700 outline-none"
            />
            <input type="hidden" name="invoiceId" value={form.invoiceId} readOnly />
          </>
        ) : (
          <select
            name="invoiceId"
            value={form.invoiceId}
            onChange={handleInvoiceChange}
            disabled={loadingInvoices}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
          >
            <option value="">Select Invoice</option>
            {invoicesList.map((inv) => (
              <option key={inv._id || inv.id} value={inv._id || inv.id}>
                {inv.invoiceNumber} - {inv.clientName || inv.customerName || "No Name"} ({formatCurrency(inv.totalAmount)})
              </option>
            ))}
          </select>
        )}

        {selectedInvoice && (
          <div className="mt-2 flex flex-col gap-1 text-xs text-gray-500">
            <p>
              Invoice Total:{" "}
              <span className="font-semibold text-gray-700">
                {formatCurrency(selectedInvoice.totalAmount ?? selectedInvoice.grandTotal ?? selectedInvoice.amount ?? 0)}
              </span>
            </p>
            <p>
              Client Name:{" "}
              <span className="font-semibold text-gray-700">
                {selectedInvoice.clientName || selectedInvoice.customerName || "-"}
              </span>
            </p>
          </div>
        )}
      </div>

      {/* =====================================
          PAYMENT AMOUNT
      ====================================== */}

      <div className="mb-5">
        <label className="mb-2 block text-sm font-semibold text-gray-700">
          Payment Amount
          <span className="ml-1 text-red-500">*</span>
        </label>

        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 font-medium text-gray-500">
            ₹
          </span>

          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            min="0"
            step="0.01"
            placeholder="Enter payment amount"
            className="w-full rounded-lg border border-gray-300 py-2.5 pl-9 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {invoice && (
          <p className="mt-2 text-xs text-gray-500">
            Remaining Amount:{" "}
            <span className="font-semibold text-red-600">
              {formatCurrency(remainingAmount)}
            </span>
          </p>
        )}
      </div>

      {/* =====================================
          PAYMENT DATE
      ====================================== */}

      <div className="mb-5">
        <label className="mb-2 block text-sm font-semibold text-gray-700">
          Payment Date
          <span className="ml-1 text-red-500">*</span>
        </label>

        <input
          type="date"
          name="paymentDate"
          value={form.paymentDate}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      {/* =====================================
          PAYMENT METHOD
      ====================================== */}

      <div className="mb-5">
        <label className="mb-2 block text-sm font-semibold text-gray-700">
          Payment Method
          <span className="ml-1 text-red-500">*</span>
        </label>

        <select
          name="paymentMethod"
          value={form.paymentMethod}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        >
          {paymentMethods.map((method) => (
            <option key={method} value={method}>
              {method}
            </option>
          ))}
        </select>
      </div>

      {/* =====================================
          TRANSACTION REFERENCE
      ====================================== */}

      <div className="mb-5">
        <label className="mb-2 block text-sm font-semibold text-gray-700">
          Transaction / Reference Number
        </label>

        <input
          type="text"
          name="transactionReference"
          value={form.transactionReference}
          onChange={handleChange}
          placeholder="Enter transaction or reference number"
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      {/* =====================================
          NOTES
      ====================================== */}

      <div className="mb-6">
        <label className="mb-2 block text-sm font-semibold text-gray-700">
          Notes
        </label>

        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          rows={4}
          placeholder="Enter payment notes..."
          className="w-full resize-none rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      {/* =====================================
          BUTTONS
      ====================================== */}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        {onCancel && (
          <button
            type="button"
            onClick={handleCancel}
            disabled={loading}
            className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? isEdit
              ? "Updating..."
              : "Saving..."
            : isEdit
              ? "Update Payment"
              : "Save Payment"}
        </button>
      </div>
    </form>
  );
}
