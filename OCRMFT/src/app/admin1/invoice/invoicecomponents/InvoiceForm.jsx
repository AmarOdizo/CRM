"use client";

import { useState } from "react";
import { formatDateForInput } from "../utils";

const initialFormData = {
  customerName: "",
  customerEmail: "",
  customerPhone: "",
  customerAddress: "",
  invoiceDate: "",
  dueDate: "",
  items: [
    {
      description: "",
      quantity: 1,
      rate: 0,
    },
  ],
  tax: 0,
  discount: 0,
  paymentStatus: "Pending",
  status: "Draft",
  notes: "",
};

export default function InvoiceForm({
  initialData = null,
  onSubmit,
  loading = false,
  submitText = "Create Invoice",
}) {
  const [formData, setFormData] = useState(() => {
    if (!initialData) {
      return initialFormData;
    }

    return {
      ...initialFormData,
      ...initialData,
      invoiceDate: formatDateForInput(initialData.invoiceDate),
      dueDate: formatDateForInput(initialData.dueDate),
      items:
        initialData.items?.length > 0
          ? initialData.items
          : initialFormData.items,
    };
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleItemChange = (index, field, value) => {
    setFormData((prev) => {
      const updatedItems = [...prev.items];

      updatedItems[index] = {
        ...updatedItems[index],
        [field]:
          field === "quantity" || field === "rate" ? Number(value) : value,
      };

      return {
        ...prev,
        items: updatedItems,
      };
    });
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          description: "",
          quantity: 1,
          rate: 0,
        },
      ],
    }));
  };

  const removeItem = (index) => {
    if (formData.items.length === 1) return;

    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const calculateSubtotal = () => {
    return formData.items.reduce((total, item) => {
      return total + Number(item.quantity || 0) * Number(item.rate || 0);
    }, 0);
  };

  const subtotal = calculateSubtotal();

  const taxAmount = (subtotal * Number(formData.tax || 0)) / 100;

  const discountAmount = (subtotal * Number(formData.discount || 0)) / 100;

  const totalAmount = subtotal + taxAmount - discountAmount;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      tax: Number(formData.tax || 0),
      discount: Number(formData.discount || 0),
      subtotal,
      taxAmount,
      discountAmount,
      totalAmount,
      items: formData.items.map((item) => ({
        ...item,
        quantity: Number(item.quantity || 0),
        rate: Number(item.rate || 0),
        amount: Number(item.quantity || 0) * Number(item.rate || 0),
      })),
    };

    if (onSubmit) {
      await onSubmit(payload);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Customer Information */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-lg font-semibold text-gray-800">
          Customer Information
        </h2>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Customer Name *
            </label>

            <input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              required
              placeholder="Enter customer name"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Customer Email
            </label>

            <input
              type="email"
              name="customerEmail"
              value={formData.customerEmail}
              onChange={handleChange}
              placeholder="customer@example.com"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Phone
            </label>

            <input
              type="text"
              name="customerPhone"
              value={formData.customerPhone}
              onChange={handleChange}
              placeholder="Enter phone number"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Address
            </label>

            <input
              type="text"
              name="customerAddress"
              value={formData.customerAddress}
              onChange={handleChange}
              placeholder="Enter customer address"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>
      </div>

      {/* Invoice Information */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-lg font-semibold text-gray-800">
          Invoice Information
        </h2>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Invoice Date *
            </label>

            <input
              type="date"
              name="invoiceDate"
              value={formData.invoiceDate}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Due Date *
            </label>

            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Invoice Status
            </label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="Draft">Draft</option>
              <option value="Sent">Sent</option>
              <option value="Overdue">Overdue</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Paid">Paid</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Payment Status
            </label>

            <select
              name="paymentStatus"
              value={formData.paymentStatus}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="Pending">Pending</option>
              <option value="Partial">Partial</option>
              <option value="Paid">Paid</option>
              <option value="Failed">Failed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Invoice Items */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">Invoice Items</h2>

          <button
            type="button"
            onClick={addItem}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            + Add Item
          </button>
        </div>

        <div className="space-y-4">
          {formData.items.map((item, index) => {
            const amount = Number(item.quantity || 0) * Number(item.rate || 0);

            return (
              <div
                key={index}
                className="grid grid-cols-1 gap-4 rounded-lg border bg-gray-50 p-4 md:grid-cols-12"
              >
                <div className="md:col-span-5">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Description *
                  </label>

                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) =>
                      handleItemChange(index, "description", e.target.value)
                    }
                    required
                    placeholder="Product / service description"
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Quantity
                  </label>

                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      handleItemChange(index, "quantity", e.target.value)
                    }
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Rate
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.rate}
                    onChange={(e) =>
                      handleItemChange(index, "rate", e.target.value)
                    }
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Amount
                  </label>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={amount.toFixed(2)}
                      readOnly
                      className="w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-2.5 text-gray-700"
                    />

                    {formData.items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="rounded-lg bg-red-100 px-3 py-2.5 text-red-600 transition hover:bg-red-200"
                        title="Remove item"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tax / Discount / Total */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-lg font-semibold text-gray-800">
            Tax & Discount
          </h2>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Tax (%)
              </label>

              <input
                type="number"
                min="0"
                value={formData.tax}
                onChange={handleChange}
                name="tax"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Discount (%)
              </label>

              <input
                type="number"
                min="0"
                value={formData.discount}
                onChange={handleChange}
                name="discount"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-lg font-semibold text-gray-800">
            Invoice Summary
          </h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">₹{subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Tax ({formData.tax || 0}%)</span>
              <span className="font-medium">₹{taxAmount.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">
                Discount ({formData.discount || 0}%)
              </span>
              <span className="font-medium text-red-600">
                -₹{discountAmount.toFixed(2)}
              </span>
            </div>

            <div className="border-t pt-3">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-blue-600">₹{totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Notes
        </label>

        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={4}
          placeholder="Enter additional notes..."
          className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-blue-600 px-7 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Saving..." : submitText}
        </button>
      </div>
    </form>
  );
}
