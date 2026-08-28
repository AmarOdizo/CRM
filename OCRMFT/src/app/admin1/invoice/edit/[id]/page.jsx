"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import InvoiceForm from "../../invoicecomponents/InvoiceForm";
import { getInvoiceById, updateInvoice } from "../../data";

export default function EditInvoicePage({ params }) {
  const router = useRouter();

  const { id } = use(params);

  const [invoice, setInvoice] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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

  const handleUpdateInvoice = async (formData) => {
    try {
      setSaving(true);
      setError("");

      await updateInvoice(id, formData);
      router.push("/admin1/invoice");
      router.refresh();
    } catch (err) {
      console.error("Update invoice error:", err);

      setError(
        err.message || "Something went wrong while updating the invoice.",
      );
    } finally {
      setSaving(false);
    }
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

  if (error && !invoice) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-md rounded-2xl border border-rose-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-2xl font-black text-rose-600">Unable to Load Invoice</h2>
          <p className="mt-2 text-sm text-slate-500 leading-relaxed mb-6">{error}</p>

          <div className="flex justify-center gap-3">
            <button
              onClick={fetchInvoice}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 hover:shadow-lg active:scale-95 cursor-pointer"
            >
              Try Again
            </button>
            <Link
              href="/admin1/invoice"
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900 active:scale-95 cursor-pointer"
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-5xl">
        {/* HEADER */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Edit Invoice</h1>
            <p className="mt-1 text-slate-500 font-medium">Update invoice customer parameters and line items.</p>
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
          <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-600 font-semibold text-sm">
            {error}
          </div>
        )}

        {/* INVOICE FORM */}
        {invoice && (
          <InvoiceForm
            initialData={invoice}
            onSubmit={handleUpdateInvoice}
            loading={saving}
            submitText="Update Invoice"
          />
        )}
      </div>
    </div>
  );
}
