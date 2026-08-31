"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import CustomerSelector from "./CustomerSelector";
import ItemTable from "./ItemTable";

import { createQuotation, updateQuotation } from "../data";

import {
  calculateQuotationTotals,
  formatCurrency,
  formatDateForInput,
} from "../utils";

// ============================================================
// DEFAULT ITEM
// ============================================================

const defaultItem = {
  productName: "",
  description: "",
  quantity: 1,
  rate: 0,
  discount: 0,
  tax: 0,
  amount: 0,
};

// ============================================================
// COMPONENT
// ============================================================

export default function QuotationForm({ initialData = null, mode = "create", onSuccess, onCancel }) {
  const router = useRouter();

  const isEdit = mode === "edit";

  // ==========================================================
  // CUSTOMER
  // ==========================================================

  const [customer, setCustomer] = useState({
    customerId: initialData?.customerId || null,

    customerName: initialData?.customerName || "",

    companyName: initialData?.companyName || "",

    customerEmail: initialData?.customerEmail || "",

    customerPhone: initialData?.customerPhone || "",

    billingAddress: initialData?.billingAddress || "",

    shippingAddress: initialData?.shippingAddress || "",

    gstin: initialData?.gstin || "",
  });

  // ==========================================================
  // DATES
  // ==========================================================

  const [quotationDate, setQuotationDate] = useState(
    formatDateForInput(initialData?.quotationDate || new Date()),
  );

  const [validUntil, setValidUntil] = useState(
    formatDateForInput(initialData?.validUntil),
  );

  // ==========================================================
  // ITEMS
  // ==========================================================

  const [items, setItems] = useState(
    initialData?.items?.length ? initialData.items : [defaultItem],
  );

  // ==========================================================
  // STATUS
  // ==========================================================

  const [status, setStatus] = useState(initialData?.status || "Draft");

  // ==========================================================
  // NOTES
  // ==========================================================

  const [notes, setNotes] = useState(initialData?.notes || "");

  // ==========================================================
  // TERMS
  // ==========================================================

  const [termsAndConditions, setTermsAndConditions] = useState(
    initialData?.termsAndConditions || "",
  );

  // ==========================================================
  // CREATED BY
  // ==========================================================

  const [createdBy, setCreatedBy] = useState(initialData?.createdBy || "Admin");

  // ==========================================================
  // SUBMIT STATES
  // ==========================================================

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  // ==========================================================
  // CALCULATE TOTALS
  // ==========================================================

  const totals = useMemo(() => calculateQuotationTotals(items), [items]);

  // ==========================================================
  // VALIDATION
  // ==========================================================

  const validateForm = () => {
    if (!customer.customerName.trim()) {
      return "Customer name is required.";
    }

    if (!quotationDate) {
      return "Quotation date is required.";
    }

    if (!validUntil) {
      return "Valid until date is required.";
    }

    if (new Date(validUntil) < new Date(quotationDate)) {
      return "Valid until date cannot be before quotation date.";
    }

    if (!items.length) {
      return "At least one item is required.";
    }

    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      if (!item.productName?.trim()) {
        return `Product / Service name is required for item ${i + 1}.`;
      }

      if (Number(item.quantity) <= 0) {
        return `Quantity must be greater than 0 for item ${i + 1}.`;
      }

      if (Number(item.rate) < 0) {
        return `Rate cannot be negative for item ${i + 1}.`;
      }

      if (Number(item.discount) < 0 || Number(item.discount) > 100) {
        return `Discount must be between 0 and 100 for item ${i + 1}.`;
      }

      if (Number(item.tax) < 0) {
        return `Tax cannot be negative for item ${i + 1}.`;
      }
    }

    return "";
  };

  // ==========================================================
  // SUBMIT
  // ==========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);

      return;
    }

    try {
      setLoading(true);

      // ------------------------------------------------------
      // FINAL PAYLOAD
      // ------------------------------------------------------

      const payload = {
        quotationDate,

        validUntil,

        // Customer
        customerId: customer.customerId,

        customerName: customer.customerName,

        companyName: customer.companyName,

        customerEmail: customer.customerEmail,

        customerPhone: customer.customerPhone,

        billingAddress: customer.billingAddress,

        shippingAddress: customer.shippingAddress,

        gstin: customer.gstin,

        // Items
        items: totals.items,

        // Totals
        subtotal: totals.subtotal,

        totalDiscount: totals.totalDiscount,

        totalTax: totals.totalTax,

        grandTotal: totals.grandTotal,

        // Other
        status,

        notes,

        termsAndConditions,

        createdBy,
      };

      // ------------------------------------------------------
      // CREATE
      // ------------------------------------------------------

      if (!isEdit) {
        const result = await createQuotation(payload);

        setSuccess(result?.message || "Quotation created successfully.");

        if (onSuccess) {
          onSuccess(result?.data?._id || result?.data?.id);
        } else {
          // Redirect after creation
          setTimeout(() => {
            if (result?.data?._id) {
              router.push(`/admin1/quotation/view/${result.data._id}`);
            } else {
              router.push("/admin1/quotation");
            }
          }, 700);
        }
      }

      // ------------------------------------------------------
      // UPDATE
      // ------------------------------------------------------
      else {
        const result = await updateQuotation(initialData._id, payload);

        setSuccess(result?.message || "Quotation updated successfully.");

        if (onSuccess) {
          onSuccess(initialData._id);
        } else {
          setTimeout(() => {
            router.push(`/admin1/quotation/view/${initialData._id}`);
          }, 700);
        }
      }
    } catch (err) {
      console.error("Quotation Submit Error:", err);

      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // CANCEL
  // ==========================================================

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.push("/admin1/quotation");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ======================================================
          ERROR
      ====================================================== */}

      {error && (
        <div
          className="
            rounded-lg
            border
            border-red-200
            bg-red-50
            px-4
            py-3
            text-sm
            text-red-700
          "
        >
          {error}
        </div>
      )}

      {/* ======================================================
          SUCCESS
      ====================================================== */}

      {success && (
        <div
          className="
            rounded-lg
            border
            border-green-200
            bg-green-50
            px-4
            py-3
            text-sm
            text-green-700
          "
        >
          {success}
        </div>
      )}

      {/* ======================================================
          QUOTATION INFORMATION
      ====================================================== */}

      <section
        className="
          rounded-xl
          border
          border-gray-200
          bg-white
          p-6
          shadow-sm
        "
      >
        <div className="mb-5">
          <h2
            className="
              text-lg
              font-semibold
              text-gray-800
            "
          >
            Quotation Information
          </h2>

          <p
            className="
              mt-1
              text-sm
              text-gray-500
            "
          >
            Enter quotation date, validity and status.
          </p>
        </div>

        <div
          className="
            grid
            grid-cols-1
            gap-5
            md:grid-cols-3
          "
        >
          {/* Quotation Number */}

          <div>
            <label
              className="
                mb-2
                block
                text-sm
                font-medium
                text-gray-700
              "
            >
              Quotation Number
            </label>

            <input
              type="text"
              value={initialData?.quotationNumber || "Auto Generated"}
              disabled
              className="
                w-full
                rounded-lg
                border
                border-gray-200
                bg-gray-100
                px-4
                py-2.5
                text-sm
                text-gray-500
              "
            />
          </div>

          {/* Quotation Date */}

          <div>
            <label
              className="
                mb-2
                block
                text-sm
                font-medium
                text-gray-700
              "
            >
              Quotation Date
              <span className="text-red-500"> *</span>
            </label>

            <input
              type="date"
              value={quotationDate}
              onChange={(e) => setQuotationDate(e.target.value)}
              className="
                w-full
                rounded-lg
                border
                border-gray-300
                bg-white
                px-4
                py-2.5
                text-sm
                outline-none
                focus:border-blue-500
                focus:ring-2
                focus:ring-blue-100
              "
            />
          </div>

          {/* Valid Until */}

          <div>
            <label
              className="
                mb-2
                block
                text-sm
                font-medium
                text-gray-700
              "
            >
              Valid Until
              <span className="text-red-500"> *</span>
            </label>

            <input
              type="date"
              value={validUntil}
              onChange={(e) => setValidUntil(e.target.value)}
              className="
                w-full
                rounded-lg
                border
                border-gray-300
                bg-white
                px-4
                py-2.5
                text-sm
                outline-none
                focus:border-blue-500
                focus:ring-2
                focus:ring-blue-100
              "
            />
          </div>

          {/* Status */}

          <div>
            <label
              className="
                mb-2
                block
                text-sm
                font-medium
                text-gray-700
              "
            >
              Status
            </label>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="
                w-full
                rounded-lg
                border
                border-gray-300
                bg-white
                px-4
                py-2.5
                text-sm
                outline-none
                focus:border-blue-500
                focus:ring-2
                focus:ring-blue-100
              "
            >
              <option value="Draft">Draft</option>

              <option value="Sent">Sent</option>

              <option value="Accepted">Accepted</option>

              <option value="Rejected">Rejected</option>

              <option value="Expired">Expired</option>

              <option value="Converted">Converted</option>
            </select>
          </div>

          {/* Created By */}

          <div>
            <label
              className="
                mb-2
                block
                text-sm
                font-medium
                text-gray-700
              "
            >
              Created By
            </label>

            <input
              type="text"
              value={createdBy}
              onChange={(e) => setCreatedBy(e.target.value)}
              placeholder="Admin"
              className="
                w-full
                rounded-lg
                border
                border-gray-300
                px-4
                py-2.5
                text-sm
                outline-none
                focus:border-blue-500
                focus:ring-2
                focus:ring-blue-100
              "
            />
          </div>
        </div>
      </section>

      {/* ======================================================
          CUSTOMER
      ====================================================== */}

      <section
        className="
          rounded-xl
          border
          border-gray-200
          bg-white
          p-6
          shadow-sm
        "
      >
        <div className="mb-5">
          <h2
            className="
              text-lg
              font-semibold
              text-gray-800
            "
          >
            Customer Information
          </h2>

          <p
            className="
              mt-1
              text-sm
              text-gray-500
            "
          >
            Select the customer for this quotation.
          </p>
        </div>

        <CustomerSelector value={customer} onChange={setCustomer} />

        {/* Customer Addresses */}

        {customer.customerId && (
          <div
            className="
              mt-5
              grid
              grid-cols-1
              gap-5
              md:grid-cols-2
            "
          >
            <div>
              <label
                className="
                  mb-2
                  block
                  text-sm
                  font-medium
                  text-gray-700
                "
              >
                Billing Address
              </label>

              <textarea
                value={customer.billingAddress}
                onChange={(e) =>
                  setCustomer({
                    ...customer,
                    billingAddress: e.target.value,
                  })
                }
                rows={3}
                className="
                  w-full
                  resize-none
                  rounded-lg
                  border
                  border-gray-300
                  px-4
                  py-2.5
                  text-sm
                  outline-none
                  focus:border-blue-500
                  focus:ring-2
                  focus:ring-blue-100
                "
              />
            </div>

            <div>
              <label
                className="
                  mb-2
                  block
                  text-sm
                  font-medium
                  text-gray-700
                "
              >
                Shipping Address
              </label>

              <textarea
                value={customer.shippingAddress}
                onChange={(e) =>
                  setCustomer({
                    ...customer,
                    shippingAddress: e.target.value,
                  })
                }
                rows={3}
                className="
                  w-full
                  resize-none
                  rounded-lg
                  border
                  border-gray-300
                  px-4
                  py-2.5
                  text-sm
                  outline-none
                  focus:border-blue-500
                  focus:ring-2
                  focus:ring-blue-100
                "
              />
            </div>
          </div>
        )}
      </section>

      {/* ======================================================
          ITEMS
      ====================================================== */}

      <section
        className="
          rounded-xl
          border
          border-gray-200
          bg-white
          p-6
          shadow-sm
        "
      >
        <ItemTable items={items} onChange={setItems} />
      </section>

      {/* ======================================================
          TOTAL SUMMARY
      ====================================================== */}

      <section
        className="
          flex
          justify-end
        "
      >
        <div
          className="
            w-full
            max-w-md
            rounded-xl
            border
            border-gray-200
            bg-white
            p-6
            shadow-sm
          "
        >
          <h3
            className="
              mb-4
              text-lg
              font-semibold
              text-gray-800
            "
          >
            Quotation Summary
          </h3>

          <div
            className="
              space-y-3
              text-sm
            "
          >
            <div
              className="
                flex
                justify-between
                text-gray-600
              "
            >
              <span>Subtotal</span>

              <span className="font-medium">
                {formatCurrency(totals.subtotal)}
              </span>
            </div>

            <div
              className="
                flex
                justify-between
                text-red-600
              "
            >
              <span>Discount</span>

              <span className="font-medium">
                - {formatCurrency(totals.totalDiscount)}
              </span>
            </div>

            <div
              className="
                flex
                justify-between
                text-blue-600
              "
            >
              <span>Tax</span>

              <span className="font-medium">
                {formatCurrency(totals.totalTax)}
              </span>
            </div>

            <div
              className="
                my-3
                border-t
                border-gray-200
              "
            />

            <div
              className="
                flex
                justify-between
                text-base
                font-bold
                text-gray-900
              "
            >
              <span>Grand Total</span>

              <span>{formatCurrency(totals.grandTotal)}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================
          NOTES + TERMS
      ====================================================== */}

      <section
        className="
          rounded-xl
          border
          border-gray-200
          bg-white
          p-6
          shadow-sm
        "
      >
        <div
          className="
            grid
            grid-cols-1
            gap-5
            md:grid-cols-2
          "
        >
          {/* Notes */}

          <div>
            <label
              className="
                mb-2
                block
                text-sm
                font-medium
                text-gray-700
              "
            >
              Notes
            </label>

            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={5}
              placeholder="Enter quotation notes..."
              className="
                w-full
                resize-none
                rounded-lg
                border
                border-gray-300
                px-4
                py-3
                text-sm
                outline-none
                focus:border-blue-500
                focus:ring-2
                focus:ring-blue-100
              "
            />
          </div>

          {/* Terms */}

          <div>
            <label
              className="
                mb-2
                block
                text-sm
                font-medium
                text-gray-700
              "
            >
              Terms & Conditions
            </label>

            <textarea
              value={termsAndConditions}
              onChange={(e) => setTermsAndConditions(e.target.value)}
              rows={5}
              placeholder="Enter terms and conditions..."
              className="
                w-full
                resize-none
                rounded-lg
                border
                border-gray-300
                px-4
                py-3
                text-sm
                outline-none
                focus:border-blue-500
                focus:ring-2
                focus:ring-blue-100
              "
            />
          </div>
        </div>
      </section>

      {/* ======================================================
          ACTION BUTTONS
      ====================================================== */}

      <div
        className="
          flex
          flex-col
          justify-end
          gap-3
          sm:flex-row
        "
      >
        <button
          type="button"
          onClick={handleCancel}
          disabled={loading}
          className="
            rounded-lg
            border
            border-gray-300
            bg-white
            px-5
            py-2.5
            text-sm
            font-medium
            text-gray-700
            transition
            hover:bg-gray-50
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="
            rounded-lg
            bg-blue-600
            px-6
            py-2.5
            text-sm
            font-semibold
            text-white
            transition
            hover:bg-blue-700
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          {loading
            ? isEdit
              ? "Updating..."
              : "Creating..."
            : isEdit
              ? "Update Quotation"
              : "Create Quotation"}
        </button>
      </div>
    </form>
  );
}
