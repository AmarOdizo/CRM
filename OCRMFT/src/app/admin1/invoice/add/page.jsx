"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, FilePlus } from "lucide-react";
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

      /*
       * After successful creation:
       * Redirect to invoice list.
       */
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
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* ----------------------------------------- */}
        {/* HEADER */}
        {/* ----------------------------------------- */}

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100">
              <FilePlus size={22} className="text-blue-600" />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Create Invoice
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Create a new invoice for your customer.
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
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="font-semibold text-red-700">
              Unable to create invoice
            </p>

            <p className="mt-1 text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* ----------------------------------------- */}
        {/* FORM */}
        {/* ----------------------------------------- */}

        <InvoiceForm
          onSubmit={handleCreateInvoice}
          loading={loading}
          submitText="Create Invoice"
        />
      </div>
    </div>
  );
}
