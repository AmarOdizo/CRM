"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Edit3, AlertCircle } from "lucide-react";

import InvoiceForm from "../../invoicecomponents/InvoiceForm";
import { getInvoiceById, updateInvoice } from "../../data";

export default function EditInvoicePage({ params }) {
  const router = useRouter();

  // Next.js dynamic params
  const { id } = use(params);

  const [invoice, setInvoice] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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

  // --------------------------------------------------
  // LOAD INVOICE
  // --------------------------------------------------

  useEffect(() => {
    if (id) {
      fetchInvoice();
    }
  }, [id]);

  // --------------------------------------------------
  // UPDATE INVOICE
  // --------------------------------------------------

  const handleUpdateInvoice = async (formData) => {
    try {
      setSaving(true);
      setError("");

      await updateInvoice(id, formData);

      // Go back to invoice list
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

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex min-h-[400px] items-center justify-center rounded-xl border bg-white shadow-sm">
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
  // ERROR / NOT FOUND
  // --------------------------------------------------

  if (error && !invoice) {
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

                <p className="mt-1 text-sm text-red-600">{error}</p>
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
                Back
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // PAGE
  // --------------------------------------------------

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* ----------------------------------------- */}
        {/* HEADER */}
        {/* ----------------------------------------- */}

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-100">
              <Edit3 size={22} className="text-yellow-600" />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-800">Edit Invoice</h1>

              <p className="mt-1 text-sm text-gray-500">
                Update invoice information and save your changes.
              </p>
            </div>
          </div>

          <Link
            href="/admin1/invoice"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            <ArrowLeft size={17} />
            Back to Invoices
          </Link>
        </div>

        {/* ----------------------------------------- */}
        {/* ERROR */}
        {/* ----------------------------------------- */}

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            <AlertCircle size={20} className="mt-0.5 shrink-0" />

            <div>
              <p className="font-semibold">Update failed</p>

              <p className="mt-1 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* ----------------------------------------- */}
        {/* INVOICE FORM */}
        {/* ----------------------------------------- */}

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
