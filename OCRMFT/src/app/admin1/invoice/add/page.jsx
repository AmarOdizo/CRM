"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import InvoiceForm from "../invoicecomponents/InvoiceForm";
import { createInvoice } from "../data";

export default function AddInvoicePage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreateInvoice = async (formData) => {
    try {
      setLoading(true);
      setError("");

      await createInvoice(formData);
      router.push("/admin1/invoice");
      router.refresh();
    } catch (err) {
      console.error("Create invoice error:", err);

      setError(
        err.message || "Something went wrong while creating the invoice.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-5xl">
        {/* HEADER */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Create Invoice</h1>
            <p className="mt-1 text-slate-500 font-medium">Create a new invoice statement for your customer billing.</p>
          </div>

          <Link
            href="/admin1/invoice"
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900 active:scale-95 cursor-pointer w-fit"
          >
            <ArrowLeft size={16} />
            <span>Back to Invoices</span>
          </Link>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-600 font-semibold text-sm">
            {error}
          </div>
        )}

        {/* FORM */}
        <InvoiceForm
          onSubmit={handleCreateInvoice}
          loading={loading}
          submitText="Create Invoice"
        />
      </div>
    </div>
  );
}
