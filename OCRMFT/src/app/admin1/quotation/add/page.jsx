"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, FileText, Loader2 } from "lucide-react";

import QuotationForm from "../quotationcomponents/QuotationForm";

const API_URL = "http://localhost:5000/api/Quotation";

export default function AddQuotationPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /*
   * ==========================================
   * CREATE QUOTATION
   * ==========================================
   */
  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          result?.message || result?.error || "Failed to create quotation",
        );
      }

      /*
       * After successful creation
       * go back to quotation list
       */
      router.push("/admin1/quotation");
    } catch (err) {
      console.error("Create quotation error:", err);

      setError(err?.message || "Unable to create quotation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /*
   * ==========================================
   * CANCEL
   * ==========================================
   */
  const handleCancel = () => {
    if (loading) return;

    router.push("/admin1/quotation");
  };

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
              disabled={loading}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-300 bg-white text-gray-600 shadow-sm transition hover:bg-gray-50 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Back to quotations"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="hidden h-11 w-11 items-center justify-center rounded-xl bg-blue-100 sm:flex">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Create Quotation
                </h1>

                <p className="text-sm text-gray-500">
                  Create a new quotation for your customer
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================
            ERROR
        ===================================== */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
            <p className="text-sm font-medium text-red-700">{error}</p>
          </div>
        )}

        {/* =====================================
            FORM
        ===================================== */}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-5 py-4 sm:px-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Quotation Details
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Enter customer and item details below.
            </p>
          </div>

          <div className="p-5 sm:p-6">
            <QuotationForm
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              loading={loading}
            />
          </div>
        </div>

        {/* =====================================
            SUBMIT LOADING
        ===================================== */}
        {loading && (
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            Saving quotation...
          </div>
        )}
      </div>
    </div>
  );
}
