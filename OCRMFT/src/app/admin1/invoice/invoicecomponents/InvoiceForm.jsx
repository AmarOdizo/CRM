"use client";

import { useState } from "react";
import { Save, X, Plus, Trash2, User, Calendar, ClipboardList, DollarSign, FileText } from "lucide-react";
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
      {/* 1. Customer Information */}
      <div className="rounded-2xl border border-slate-200/60 bg-white p-8 shadow-sm">
        <div className="flex items-center gap-2 pb-3 mb-6 border-b border-slate-100 text-slate-800">
          <User size={18} className="text-blue-500" />
          <h3 className="text-base font-bold">Customer Details</h3>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
              Customer Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              required
              placeholder="Enter customer name"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 outline-none transition text-sm text-slate-800"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
              Customer Email
            </label>
            <input
              type="email"
              name="customerEmail"
              value={formData.customerEmail}
              onChange={handleChange}
              placeholder="customer@example.com"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 outline-none transition text-sm text-slate-800"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
              Phone
            </label>
            <input
              type="text"
              name="customerPhone"
              value={formData.customerPhone}
              onChange={handleChange}
              placeholder="Enter phone number"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 outline-none transition text-sm text-slate-800"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
              Address
            </label>
            <input
              type="text"
              name="customerAddress"
              value={formData.customerAddress}
              onChange={handleChange}
              placeholder="Enter customer address"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 outline-none transition text-sm text-slate-800"
            />
          </div>
        </div>
      </div>

      {/* 2. Invoice Information */}
      <div className="rounded-2xl border border-slate-200/60 bg-white p-8 shadow-sm">
        <div className="flex items-center gap-2 pb-3 mb-6 border-b border-slate-100 text-slate-800">
          <Calendar size={18} className="text-blue-500" />
          <h3 className="text-base font-bold">Invoice Parameters</h3>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
              Invoice Date <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              name="invoiceDate"
              value={formData.invoiceDate}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 outline-none transition text-sm text-slate-800"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
              Due Date <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 outline-none transition text-sm text-slate-800"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
              Invoice Status
            </label>
            <div className="relative">
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full py-3 pl-4 pr-10 rounded-xl border border-slate-200 bg-slate-50/50 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 outline-none transition text-sm text-slate-800 appearance-none cursor-pointer"
              >
                <option value="Draft">Draft</option>
                <option value="Sent">Sent</option>
                <option value="Overdue">Overdue</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Paid">Paid</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
              Payment Status
            </label>
            <div className="relative">
              <select
                name="paymentStatus"
                value={formData.paymentStatus}
                onChange={handleChange}
                className="w-full py-3 pl-4 pr-10 rounded-xl border border-slate-200 bg-slate-50/50 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 outline-none transition text-sm text-slate-800 appearance-none cursor-pointer"
              >
                <option value="Pending">Pending</option>
                <option value="Partial">Partial</option>
                <option value="Paid">Paid</option>
                <option value="Failed">Failed</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Invoice Items */}
      <div className="rounded-2xl border border-slate-200/60 bg-white p-8 shadow-sm">
        <div className="flex items-center justify-between pb-3 mb-6 border-b border-slate-100 text-slate-800">
          <div className="flex items-center gap-2">
            <ClipboardList size={18} className="text-blue-500" />
            <h3 className="text-base font-bold">Line Items</h3>
          </div>

          <button
            type="button"
            onClick={addItem}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl border border-blue-100 transition active:scale-95 cursor-pointer"
          >
            <Plus size={14} />
            <span>Add Item</span>
          </button>
        </div>

        <div className="space-y-4">
          {formData.items.map((item, index) => {
            const amount = Number(item.quantity || 0) * Number(item.rate || 0);

            return (
              <div
                key={index}
                className="grid grid-cols-1 gap-4 rounded-xl border border-slate-150 bg-slate-50/50 p-5 md:grid-cols-12 items-end"
              >
                <div className="md:col-span-6">
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                    Description <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) =>
                      handleItemChange(index, "description", e.target.value)
                    }
                    required
                    placeholder="Product / service description"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition text-sm text-slate-800"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                    Qty
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      handleItemChange(index, "quantity", e.target.value)
                    }
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition text-sm text-slate-800"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                    Rate (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.rate}
                    onChange={(e) =>
                      handleItemChange(index, "rate", e.target.value)
                    }
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition text-sm text-slate-800"
                  />
                </div>

                <div className="md:col-span-2 flex items-center gap-2">
                  <div className="w-full">
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                      Amount
                    </label>
                    <input
                      type="text"
                      value={`₹${amount.toFixed(2)}`}
                      readOnly
                      className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-100/50 text-slate-500 text-sm font-semibold outline-none"
                    />
                  </div>

                  {formData.items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="p-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 transition active:scale-95 cursor-pointer shrink-0 mt-6"
                      title="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Tax / Discount / Total */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200/60 bg-white p-8 shadow-sm">
          <div className="flex items-center gap-2 pb-3 mb-6 border-b border-slate-100 text-slate-800">
            <DollarSign size={18} className="text-blue-500" />
            <h3 className="text-base font-bold">Tax & Discount</h3>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                Tax (%)
              </label>
              <input
                type="number"
                min="0"
                value={formData.tax}
                onChange={handleChange}
                name="tax"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 outline-none transition text-sm text-slate-800"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                Discount (%)
              </label>
              <input
                type="number"
                min="0"
                value={formData.discount}
                onChange={handleChange}
                name="discount"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 outline-none transition text-sm text-slate-800"
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/60 bg-white p-8 shadow-sm">
          <div className="flex items-center gap-2 pb-3 mb-6 border-b border-slate-100 text-slate-800">
            <DollarSign size={18} className="text-blue-500" />
            <h3 className="text-base font-bold">Invoice Summary</h3>
          </div>

          <div className="space-y-3.5 text-sm font-medium">
            <div className="flex justify-between text-slate-500">
              <span>Subtotal</span>
              <span className="font-semibold text-slate-700">₹{subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-slate-500">
              <span>Tax ({formData.tax || 0}%)</span>
              <span className="font-semibold text-slate-700">₹{taxAmount.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-slate-500">
              <span>Discount ({formData.discount || 0}%)</span>
              <span className="font-semibold text-rose-600">-₹{discountAmount.toFixed(2)}</span>
            </div>

            <div className="border-t border-slate-100 pt-4 mt-2">
              <div className="flex justify-between text-lg font-black tracking-tight text-slate-800">
                <span>Total Amount</span>
                <span className="text-blue-600 font-mono">₹{totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Notes */}
      <div className="rounded-2xl border border-slate-200/60 bg-white p-8 shadow-sm">
        <div className="flex items-center gap-2 pb-3 mb-6 border-b border-slate-100 text-slate-800">
          <FileText size={18} className="text-blue-500" />
          <h3 className="text-base font-bold">Additional Remarks</h3>
        </div>

        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={3}
          placeholder="Enter payment notes, terms, bank details..."
          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 outline-none resize-none transition text-sm text-slate-800"
        />
      </div>

      {/* 6. Form Footer Button */}
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-1.5 px-7 py-3.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/10 transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer text-sm"
        >
          <Save size={16} />
          <span>{loading ? "Saving..." : submitText}</span>
        </button>
      </div>
    </form>
  );
}
